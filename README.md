# Maze Generator & Solver

Please [click here](https://golubitsky.github.io/maze_solver/) to generate and solve random mazes!  
  
The particular generation algorithm that you see is called [Randomized Prim's Algorithm](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_Prim.27s_algorithm). It starts at a random cell in a grid, marks it as discovered, and adds all of that cell's adjacent walls to a queue. It then selects a random wall from the queue and, if the cell on the other side of the wall has not yet been discovered, opens up that wall. It adds all of the adjacent cell's walls to the queue, marks the adjacent cell as discovered, and selects the next random wall in the queue until all the cells have been discovered. It's kind of a modified BFS. This algorithm guarantees that all cells are connected.   
  
Planned features:  
* rehaul of visualization in HTML5 Canvas
* visualization of maze-searching algorithm (as opposed to only the solution)
* implementation of multiple maze-generation and maze-solving algorithms
