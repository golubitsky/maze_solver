;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  Maze = mazeSolver.Maze = function (yMax, xMax) {
    this.x = xMax || Math.floor(Math.random() * 90) + 10;
    this.y = yMax || Math.floor(Math.random() * 90) + 10;
    this.dataStore = this._generate();
    this._randomizePrim();
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

  Maze.prototype._randomizeNaive = function () {
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

  Maze.prototype.findLongestPath = function () {
    var lengths = [];
    var f;
    for (var y = 0; y < this.y; y++) {
      for (var x = 0; x < this.x; x++) {
        f = this.solve(y, x);
        this.countSteps(f[0],f[1]);
        lengths[this.numberOfSteps] = lengths[this.numberOfSteps] || []
        lengths[this.numberOfSteps].push([ [y,x], f])
      }
    }
    var coords = lengths[lengths - 1][0];
    var start = coords[0];
    var end = coords[1];
    this.solve(start[0], start[1]);
    mazeSolver.view.renderPath(end[0],end[1]);
  }
  Maze.prototype.solve = function (y,x) {
    this._resetParentPointers();

    var seen = {undefined: true};

    var coord, cell, x, y;
    var q = [ [y, x] ];

    var lastSeen;
    while (q.length) {
      coord = q.shift();
      lastSeen = coord;
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
    return lastSeen;
  }

  Maze.prototype.solveAsyncBFS = function (y,x) {
    //used to animate solving
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
