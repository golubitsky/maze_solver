;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  var events = window.mazeSolver.events = {};

  events.bind = function () {
    this.generateButton = document.getElementById('generate');
    this.generateButton.addEventListener('click', events.generateMaze.bind(this), false);

    this.solveButton = document.getElementById('solve');
    this.solveButton.addEventListener('click', events.handleSolveButton.bind(this), false);

    this.mazeDiv = document.getElementById('maze');
    this.mazeDiv.addEventListener('click', events.solveMaze.bind(this), false);
  }



  events.generateMaze = function () {
    if (mazeSolver.view.rendering) { return };
    var x = document.getElementById('mazeSizeX');
    var y = document.getElementById('mazeSizeY');
    if (x.value != '' && x.value < 10) {
      x.value = 10;
    }
    if (y.value != '' && y.value < 10) {
      y.value = 10;
    }
    mazeSolver.maze = new mazeSolver.Maze(y.value, x.value);
  }

  events.handleSolveButton = function () {
    if (mazeSolver.view.rendering) { return };
    this.solveButton.innerHTML = 'Solving...';

    x = Math.floor(Math.random() * mazeSolver.maze.x);
    y = Math.floor(Math.random() * mazeSolver.maze.y);
    events.solveMaze(null, y, x);
  }

  events.solveMaze = function (e, y, x) {
    events.disableButtons();

    if (mazeSolver.view.rendering) { return };

    if (e) {
      x = e.target.getAttribute('data-x');
      y = e.target.getAttribute('data-y');
    }
    mazeSolver.maze.solve(y, x);
    //TO DO allow user to select start location
    mazeSolver.view.renderPath(mazeSolver.maze.y - 1, 0);
  }

  events.disableButtons = function () {
    this.solveButton.disabled = 'disabled';
    this.generateButton.disabled = 'disabled';
  }

  events.enableButtons = function () {
    this.solveButton.disabled = null;
    this.generateButton.disabled = null;
  }
}());
