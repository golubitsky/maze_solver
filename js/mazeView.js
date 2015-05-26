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
    this.cellSize = Math.floor(Math.min(
      Math.floor(mazeSolver.mazeHeight/this.maze.y),
      Math.floor(mazeSolver.mazeWidth/this.maze.x)
    ));
  }

  MazeView.prototype._reset = function () {
    var elements = document.querySelectorAll('[data-x][data-y]');
    Array.prototype.forEach.call(elements, function (el) {
      ['current','seen','explored'].forEach(function (klass) {
        el.className = el.className.replace( new RegExp(klass, 'g') , '' );
      });
      //reset path colors
      el.style.background = null;
    });
    mazeSolver.startDiv.className = mazeSolver.startDiv.className.replace( new RegExp('start', 'g') , '' );
    mazeSolver.endDiv.className = mazeSolver.endDiv.className.replace( new RegExp('end', 'g') , '' );
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
        var row = document.createElement('div')
        row.className = 'maze-row';
        for (var x = 0; x < this.maze.x; x++) {

          var el = document.createElement('div')
          el.setAttribute('data-x', x);
          el.setAttribute('data-y', y);
          el.style.width = this.cellSize + 'px';
          el.style.height = this.cellSize + 'px';
          var classes = ['maze-cell']
          this.maze.dataStore[y][x].adjacents.forEach(function (adj) {
            if (adj[0] < y) {
              classes.push('up-open');
            } else if (adj[0] > y) {
              classes.push('down-open');
            } else if (adj[1] > x) {
              classes.push('right-open');
            } else {
              classes.push('left-open');
            }
          });

          el.className = classes.join(' ');
          row.appendChild(el);
        }
        mazeDiv.appendChild(row);
      }
      mazeDiv.style.opacity = '1';
    }.bind(this), 150);

  }

  MazeView.prototype.renderPath = function (y, x) {
    this.maze.countSteps(y,x);
    //TO DO insert variable colors?
    this.colors = mazeSolver.stepColors('#000000','#ffff00', this.maze.numberOfSteps);
    this.rendering = true;
    var cell = this.maze.dataStore[y][x];
    var el;

    this.count = 1;
    pathTrace = setInterval(function () {
      cell = this._goToNextCell(cell);
      if (!cell) {
        clearInterval(pathTrace);
        this.rendering = false;
        mazeSolver.startCoord = null;
        mazeSolver.endCoord = null;
        mazeSolver.events.enableButtons();
        document.getElementById('click-message').innerHTML = "Click any two locations in the maze to find the shortest path between them!";
      }
    }.bind(this), 25);
  }

  MazeView.prototype._goToNextCell = function (cell) {
    el = document.querySelector('[data-x="' + cell.x + '"][data-y="' + cell.y + '"]');
    el.style.background = this.colors[this.count];

    this.count++;
    return cell.parent;
  }
}());
