;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  Cell = mazeSolver.Cell = function (y,x) {
    //up right down left
    this.y = y;
    this.x = x;
    this.adjacents = new Array(4)
    this.inMaze = false;
    this.parent;
  }
}());
