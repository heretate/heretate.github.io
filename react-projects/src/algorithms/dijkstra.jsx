import PriorityQueue, {comparator} from "../helpers/PriorityQueue.js"


const UP = [0, 1];
const DOWN = [0, -1];
const LEFT = [-1, 0];
const RIGHT = [1, 0]; 

const prepareSearchGrid = (startGrid) => {
    const filledGrid = structuredClone(startGrid);
    return filledGrid;
}

const getShortestPath = (finishedGrid, endSquare) => {
    let arr = [];
    let currentSquare = finishedGrid[endSquare[0]][endSquare[1]];
    while (!currentSquare.isStart) {
        arr.push(currentSquare);
        currentSquare = currentSquare.prevSquare;
    }
    arr.push(currentSquare);
    return arr.reverse();
}


/**
 * Utilizes the Dijkstra (same as BFS in unweighted scenario) Search Algorithm to get the search path and shortest path.
 *
 * @param {2D Array} grid The provided state of the grid
 * @param {[Number, Number]} startSquare The 2D coordinate of the starting location
 * @param {[Number, Number]} endSquare  The 2D coordinate of the target location
 * @return {[Array, Array]} Tuple of visited sequence of squares and shortest path from start to target.
 */

export default function dijkstra(grid, startSquare, endSquare) {
    
    const frontier = new PriorityQueue(comparator);

    const newGrid = prepareSearchGrid(grid);
    const visitSequence = [];
    
    let k = 0;
    frontier.push([0, k, newGrid[startSquare[0]][startSquare[1]]]);


    /* Main Loop */
    while (frontier.size() > 0) {
        const [priority, , currentSquare] = frontier.pop();
        const [row, col] = [currentSquare.row, currentSquare.col];

        if (currentSquare.leftVisited) {
            continue;
        }
        currentSquare.leftVisited = true;
        visitSequence.push(currentSquare);
        if (currentSquare.isEnd){
            return [visitSequence, getShortestPath(newGrid, endSquare)];
        }

        /* Increment frontier */
        for (let [i, j] of [UP, DOWN, LEFT, RIGHT]) {
            if (((row+i < 0) || (row+i > newGrid.length - 1)) || ((col + j < 0) || (col + j > newGrid[0].length - 1))) {
                continue
            }
            let square = newGrid[row+i][col+j];
            if (!(square.leftVisited || square.isWall)) {
                square.distance = priority+1;
                square.prevSquare = currentSquare;
                k += 1;
                frontier.push([priority+1, k, square]);
                
            }
        } 
    }

    /*
    Reach here if no path is available.
    */
    return [visitSequence, []];


    



}