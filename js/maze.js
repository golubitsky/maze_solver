;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  Maze = mazeSolver.Maze = function (yMax, xMax) {
    this.x = xMax || Math.floor(Math.random() * 90) + 10;
    this.y = yMax || Math.floor(Math.random() * 90) + 10;
    this.dataStore = this._generate();
    this._randomizePrim();
    // this._randomizeDFS(); //alternate maze generation approach
  }

  Maze.prototype._generate = function () {
    var dataStore = [];
    for (var y = 0; y < this.y; y++) {
      var row = [];
      for (var x = 0; x < this.x; x++) {
        row.push(new Cell(y, x));
      }
      dataStore.push(row)
    }
    return dataStore;
  }
  Maze.prototype._randomizePrim = function () {
    //select a RANDOM cell
    var y = Math.floor(Math.random() * this.y);
    var x = Math.floor(Math.random() * this.x);
    var cell = this.dataStore[y][x];
    //mark cell inMaze
    cell.inMaze = true;
    var totalCells = this.x * this.y;
    var inMazeCount = 1;
    //add cell's walls to q
    var q = []
    this._addWalls(cell, q);
    var otherCell;
    while (q.length) {
      //pick RANDOM wall
      var r = Math.floor(Math.random() * q.length);
      r = q.splice(r, 1)[0];
      if (this.dataStore[r.cur[0]] && this.dataStore[r.cur[0]][r.cur[1]]) {
        cell = this.dataStore[r.cur[0]][r.cur[1]];
      }
      //if opposing cell exists and is not inMaze
      if (cell.inMaze) {
        continue;
      }
        //open wall
      cell.adjacents.push([r.prev[0], r.prev[1]]);
      otherCell = this.dataStore[r.prev[0]][r.prev[1]];
      otherCell.adjacents.push([r.cur[0], r.cur[1]]);
        //mark cell inMaze
      cell.inMaze = true;
      inMazeCount++;
      if (inMazeCount === totalCells) {
        return
      }
        //add cell's walls to q
      this._addWalls(cell, q);
    }
  }

  Maze.prototype._addWalls = function (cell, q) {
    var x = cell.x;
    var y = cell.y;
    [1,-1].forEach(function (d) {
      var obj = {};
      obj.prev = [y,x];
      obj.cur = [y + d, x];
      q.push(obj);

      obj = {};
      obj.prev = [y,x];
      obj.cur = [y, x + d];
      q.push(obj);
    });
  }

  Maze.prototype._randomize = function () {
    var open;

    for (var y = this.y - 1; y >= 0; y--) {
      for (var x = 0; x < this.x; x++) {
        open = null;

        if (y > 0 && x < this.x - 1) {
          open = Math.round(Math.random())
        } else if (y > 0) {
          open = 0;
        } else if (x < this.x - 1) {
          open = 1;
        } else {
          //do nothing for upper-right
          break
        }

        //open opposite node for searching
        if (open === 0) {
          this.dataStore[y - 1][x].adjacents[open + 2] = [y,x];
          this.dataStore[y][x].adjacents[open] = [y - 1, x];
        } else {
          this.dataStore[y][x + 1].adjacents[open + 2] = [y,x];
          this.dataStore[y][x].adjacents[open] = [y, x + 1];
        }
      }
    }
  }

  Maze.prototype._randomizeDFS = function () {
    var cell = arguments[0] || this.dataStore[0][0];
    var adj, thisOpen, adjOpen;
    cell.inMaze = true;

    var seen = new Array(4);
    var count = 0;
    while (count < 4) {
      if (this._adjacentsAllVisited(cell)) { return }

      var rand = Math.round(Math.random() * 3);
      if (!seen[rand]) {
        seen[rand] = true;
        count++;
      } else {
        continue;
      }
      switch (rand) {
        case 0:
          adj = this.dataStore[cell.y - 1];
          if (adj && !adj.inMaze) {
            adj = adj[cell.x];
            cell.adjacents[0] = [cell.y - 1, cell.x];
            adj.adjacents[2] = [cell.y, cell.x];
            this._randomizeDFS(adj);
          }
        break;
        case 1:
          adj = this.dataStore[cell.y][cell.x + 1];
          if (adj && !adj.inMaze) {
            cell.adjacents[1] = [cell.y, cell.x + 1];
            adj.adjacents[3] = [cell.y, cell.x];
            this._randomizeDFS(adj);
          }
        break;
        case 2:
          adj = this.dataStore[cell.y + 1];
          if (adj && !adj.inMaze) {
            adj = adj[cell.x];
            cell.adjacents[2] = [cell.y + 1, cell.x];
            adj.adjacents[0] = [cell.y, cell.x];
            this._randomizeDFS(adj);
          }
        break;
        case 3:
          adj = this.dataStore[cell.y][cell.x - 1];
          if (adj && !adj.inMaze) {
            cell.adjacents[3] = [cell.y, cell.x - 1];
            adj.adjacents[1] = [cell.y, cell.x];
            this._randomizeDFS(adj);
          }
        break;
      }
    }
  }

  Maze.prototype._adjacentsAllVisited = function (cell) {
    var adj;
    var result;
    [-1,1].forEach(function (dir) {
      adj = this.dataStore[cell.y + dir];
      if (adj) {
        adj = adj[cell.x];
        if (!adj.inMaze) { result = "false"; }
      }

      adj = this.dataStore[cell.y][cell.x + dir];
      if (adj && !adj.inMaze) {
        result = "false";
      }
    }.bind(this));
    if (result == "false") { return false };
    return true;
  }

  Maze.prototype.solve = function (y,x) {
    this._resetParentPointers();

    var seen = {undefined: true};

    var coord, cell, x, y;
    var q = [ [y, x] ];

    while (q.length) {
      coord = q.shift();
      seen[coord] = true;

      y = coord[0];
      x = coord[1];
      cell = this.dataStore[y][x];
      cell.adjacents.forEach(function (adj) {
        if (!seen[adj]) {
          var adjY = adj[0];
          var adjX = adj[1];
          this.dataStore[adjY][adjX].parent = cell;
          q.push(adj)
        }
      }.bind(this));
    }
  }

  Maze.prototype.solveAsyncBFS = function (y,x) {
    this._resetParentPointers();
    mazeSolver.view._reset();
    mazeSolver.view.rendering = true;

    this.seen = {undefined: true};

    var coord, cell, x, y;
    var q = new mazeSolver.Queue([y, x]);
    var stopInterval = false;
    var exploreMaze = setInterval(function () {
      if (q.length && !stopInterval) {
        coord = q.dequeue();
        if (this._visitNextBFS(coord, q)) {
          stopInterval = true;
        };
      } else {
        clearInterval(exploreMaze);
        mazeSolver.view.renderPath(mazeSolver.startCoord[0], mazeSolver.startCoord[1]);
      }
    }.bind(this), 1);
  }

  Maze.prototype._visitNextBFS = function (coord, q) {
    this.seen[coord] = true;
    var y = coord[0];
    var x = coord[1];
    var cell = this.dataStore[y][x];
    var currentEl = document.querySelector('[data-x="' + cell.x + '"][data-y="' + cell.y + '"]');
    currentEl.className += ' current';
    var stopInterval = false;
    var adjacents = mazeSolver.prioritizeAdjacentOrder(coord, mazeSolver.startCoord, cell.adjacents);
    adjacents.forEach(function (adj) {
      if (!this.seen[adj]) {
        this.dataStore[adj[0]][adj[1]].parent = cell;
        if (mazeSolver.areEqual(adj, mazeSolver.startCoord)) {
          stopInterval = true;
          return;
        };
        q.enqueue(adj)
        var el = document.querySelector('[data-x="' + adj[1] + '"][data-y="' + adj[0] + '"]')
        el.className += ' seen';
      }
    }.bind(this));
    ['current','seen'].forEach(function (klass) {
      currentEl.className = currentEl.className.replace( new RegExp(klass) , '' );
    });
    currentEl.className += ' explored';
    return stopInterval;
  }

Maze.prototype.solveDFS = function (y,x) {
    this._resetParentPointers();
    mazeSolver.view._reset();
    mazeSolver.view.rendering = true;

    this.seen = {undefined: true};

    this._visitNextDFS([y, x]);
  }

  Maze.prototype._visitNextDFS = function (coord) {
    // if (mazeSolver.areEqual(coord, mazeSolver.startCoord)) {
    //   debugger
    //   return true;
    // }
    this.seen[coord] = true;
    var y = coord[0];
    var x = coord[1];
    var cell = this.dataStore[y][x];
    var adjacents = mazeSolver.prioritizeAdjacentOrder(coord, mazeSolver.startCoord, cell.adjacents);
    var searchComplete;
    adjacents.forEach(function (adj) {
      if (!this.seen[adj]) {
        this.dataStore[adj[0]][adj[1]].parent = cell;
        if (this._visitNextDFS([adj[0], adj[1]])) {
          // searchComplete = true;
          return;
        }
      }
    }.bind(this));
    // debugger
    // return searchComplete;
  }
  Maze.prototype.countSteps = function (y, x) {
    //counts the number of steps from start (provided) to already computed end coord
    //to be used for percentage color shading
    this.numberOfSteps = 0;
    var cell = this.dataStore[y][x];
    while (cell) {
      this.numberOfSteps++;
      cell = cell.parent;
    }
  }

  Maze.prototype._resetParentPointers = function () {
    for (var y = 0; y < this.y; y++) {
      for (var x = 0; x < this.x; x++) {
        this.dataStore[y][x].parent = undefined;
      }
    }
  }
}());
