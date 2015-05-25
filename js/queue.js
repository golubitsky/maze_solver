;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  Node = mazeSolver.Node = function (data, next) {
    this.data = data;
    this.nextNode = next;
  }

  Node.areEqual = function (n1, n2) {
    if (!n1 || !n2) { return false; }
    //this comparison works because we only enqueue a coordinate once
    if (mazeSolver.areEqual(n1.data, n2.data)) {
      return true;
    } else {
      return false;
    }
  }

  Queue = mazeSolver.Queue = function (initialData) {
    var node = new Node(initialData)
    this.head = node;
    this.tail = node;
  }

  Queue.prototype.dequeue = function () {
    if (!this.head) { return false }

    var node = this.head;

    if (Node.areEqual(this.head, this.tail)) {
      //in the case of initial value being dequeued immediately
      this.tail = null;
    }

    this.head = node.nextNode;
    return node.data;
  }

  Queue.prototype.enqueue = function (data) {
    var newNode = new Node(data)

    if (this.tail) {
      this.tail.nextNode = newNode;
    } else {
      this.head = newNode;
    }

    this.tail = newNode;
    return newNode.data;
  }
}());
