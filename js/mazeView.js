;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  MazeView = mazeSolver.MazeView = function (maze) {
    this.maze = maze;
    this.setCellSize();
    this.render();
  }

  MazeView.prototype.setCellSize = function () {
    this.cellSize = Math.min(
      Math.floor(600/this.maze.y),
      Math.floor(800/this.maze.x)
    );
  }

  MazeView.prototype._reset = function () {
    var cells = document.querySelectorAll('[data-x][data-y]');
    Array.prototype.forEach.call(cells, function (el) {
      el.classList.remove("in-path");
    });
  }

  MazeView.prototype.render = function () {
    this._generateHTML();
  }

  MazeView.prototype._generateHTML = function () {
    var mazeDiv = document.getElementById('maze');
    mazeDiv.style.opacity = '0';

    setTimeout(function () {
      mazeDiv.innerHTML = null;
      mazeDiv.style.width = this.cellSize * this.maze.x + 10 + 'px';
      mazeDiv.style.height = this.cellSize * this.maze.y + 10 + 'px';
      for (var y = 0; y < this.maze.y; y++) {
        for (var x = 0; x < this.maze.x; x++) {

          var el = document.createElement('div')
          el.setAttribute('data-x', x);
          el.setAttribute('data-y', y);
          el.style.width = this.cellSize + 'px';
          el.style.height = this.cellSize + 'px';
          var classes = []
          this.maze.dataStore[y][x].adjacents.forEach(function (adj, index) {
            if (adj) {
              switch(index) {
                case 0:
                  classes.push('up-open');
                  break;
                case 1:
                  classes.push('right-open');
                  break;
                case 2:
                  classes.push('down-open');
                  break;
                case 3:
                  classes.push('left-open');
                  break;
              }
            }
          });

          el.className = classes.join(' ');
          mazeDiv.appendChild(el);
        }
      }
      mazeDiv.style.opacity = '1';
    }.bind(this), 150);

  }

  MazeView.prototype.renderPath = function (y,x) {
    this.rendering = true;
    var cell = this.maze.dataStore[y][x];
    var el;
    pathTrace = setInterval(function () {
      cell = this._goToNextCell(cell);
      if (!cell) {
        clearInterval(pathTrace);
        this.rendering = false;

        solveButton = document.getElementById('solve')
        solveButton.innerHTML = 'Solve Maze!';
        mazeSolver.events.enableButtons();
      }
    }.bind(this), 50);

  }

  MazeView.prototype._goToNextCell = function (cell) {
    el = document.querySelector('[data-x=\"' + cell.x + '\"][data-y=\"'+ cell.y +'\"]');
    el.className += " in-path";
    return cell.parent;
  }
}());
