;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  var events = window.mazeSolver.events = {};

  events.bind = function () {
    this.generateButtons = [];
    this.generateButtons.push(document.getElementById('generate'));
    this.generateButtons.push(document.getElementById('generate-random'));

    this.generateButtons.forEach(function (btn) {
      btn.addEventListener('click', events.generateMaze, false);
    });

    this.solveButton = document.getElementById('solve');
    this.solveButton.addEventListener('click', events.handleSolveButton.bind(this), false);

    this.mazeDiv = document.getElementById('maze');
    this.mazeDiv.addEventListener('click', events.solveMaze.bind(this), false);
  }

  events.generateMaze = function () {
    if (mazeSolver.view.rendering) { return };

    //else random values will be used
    if (this.id === 'generate') {
      var x = document.getElementById('x-dimension-value').innerHTML;
      var y = document.getElementById('y-dimension-value').innerHTML;
    }

    mazeSolver.maze = new mazeSolver.Maze(y, x);
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

    if (mazeSolver.startCoord) {
      mazeSolver.endCoord = [y, x];
      mazeSolver.endDiv = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');
    } else {
      if (mazeSolver.startDiv) {
        mazeSolver.endDiv.style.background = null;
        mazeSolver.startDiv.style.background = null;
        mazeSolver.view._reset();
      }

      mazeSolver.startCoord = [y, x];
      mazeSolver.startDiv = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]')
      mazeSolver.startDiv.style.background = 'yellow';
      return;
    }

    mazeSolver.maze.solve(mazeSolver.endCoord[0], mazeSolver.endCoord[1]);
    mazeSolver.view.renderPath(mazeSolver.startCoord[0], mazeSolver.startCoord[1]);
    mazeSolver.startCoord = null;
    mazeSolver.endCoord = null;
  }

  events.disableButtons = function () {
    this.generateButtons.forEach(function (btn) {
      btn.disabled = 'disabled';
    });
    this.solveButton.disabled = 'disabled';
  }

  events.enableButtons = function () {
    this.generateButtons.forEach(function (btn) {
      btn.disabled = null;
    });
    this.solveButton.disabled = null;
  }
}());
