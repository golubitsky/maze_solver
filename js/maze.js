;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  Maze = mazeSolver.Maze = function (yMax, xMax) {
    this.x = xMax || Math.floor(Math.random() * 90) + 10;
    this.y = yMax || Math.floor(Math.random() * 90) + 10;
    this.dataStore = this._generate();
    this._randomize()
    this._generateView();
  }

  Maze.prototype._generateView = function () {
    this.view = mazeSolver.view = new mazeSolver.MazeView(this);
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

  Maze.prototype.solve = function (y,x) {
    this.end = [y,x];
    this._resetParentPointers();
    this.view._reset();

    var seen = {undefined: true};

    var coord, cell, x, y;
    var q = [ [y, x] ];

    this.dataStore[y][x].end = true;
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
