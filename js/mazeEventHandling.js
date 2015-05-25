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

  events.solveMaze = function (e) {
    if (mazeSolver.view.rendering) { return };

    var x = e.target.getAttribute('data-x');
    var y = e.target.getAttribute('data-y');

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
      mazeSolver.startDiv = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');
      mazeSolver.startDiv.style.background = '#444400';
      document.getElementById('click-message').innerHTML = "Now choose your destination...";
      return;
    }

    events.disableButtons();
    document.getElementById('click-message').innerHTML = 'Solving, please stand by...';
    mazeSolver.maze.solve(mazeSolver.endCoord[0], mazeSolver.endCoord[1]);
    mazeSolver.view.renderPath(mazeSolver.startCoord[0], mazeSolver.startCoord[1]);
    mazeSolver.startCoord = null;
    mazeSolver.endCoord = null;
  }

  events.disableButtons = function () {
    this.generateButtons.forEach(function (btn) {
      btn.disabled = 'disabled';
    });
  }

  events.enableButtons = function () {
    this.generateButtons.forEach(function (btn) {
      btn.disabled = null;
    });
  }
}());
