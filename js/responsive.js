;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  css = mazeSolver.css = {}

  css.initialize = function () {
    css.queryViewport();
    css.sizeBoxes();
    mazeSolver.maze = new mazeSolver.Maze(50,50);
    mazeSolver.view = new mazeSolver.MazeView(mazeSolver.maze);

    mazeSolver.events.bind();
  }

  css.queryViewport = function () {
    mazeSolver.windowWidth = $(window).width() - 120;
    mazeSolver.windowHeight = $(window).height() - 40; //subtract for margins
    mazeSolver.sidebarWidth = Math.floor(mazeSolver.windowWidth/5);
    mazeSolver.sidebarHeight = mazeSolver.windowHeight;
    mazeSolver.mazeWidth = mazeSolver.windowWidth - mazeSolver.sidebarWidth;
    mazeSolver.mazeHeight = mazeSolver.windowHeight;
  }

  css.sizeBoxes = function () {
    var c = document.getElementById('controls');
    c.width = mazeSolver.sidebarWidth;
    // c.height = mazeSolver.sidebarHeight;
    var m = document.getElementById('maze');
    m.width = mazeSolver.mazeWidth;
    m.height = mazeSolver.mazeHeight;
  }
}());
