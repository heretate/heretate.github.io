import PriorityQueue, {comparator} from "../helpers/PriorityQueue.js"
import getHeuristic from "../helpers/heuristics.js"

const UP = [0, 1];
const DOWN = [0, -1];
const LEFT = [-1, 0];
const RIGHT = [1, 0]; 

const SELECTED_HEURISTIC = "euclidean";

const prepareSearchGrid = (startGrid, target, heuristic) => {
    const filledGrid = structuredClone(startGrid);
    const targetSquare = filledGrid[target[0]][target[1]];
    for (let row = 0; row < startGrid.length; row ++) {
        for (let col = 0; col < startGrid[0].length; col ++) {
            const currentSquare = filledGrid[row][col];
            currentSquare.heuristic = heuristic(currentSquare.row, targetSquare.row, currentSquare.col, targetSquare.col);
        }
    }    
    return filledGrid;
}

const getShortestPath = (finishedGrid, target) => {
    let arr = [];
    let currentSquare = finishedGrid[target[0]][target[1]];
    while (!currentSquare.isStart) {
        arr.push(currentSquare);
        currentSquare = currentSquare.prevSquare;
    }
    arr.push(currentSquare);
    return arr.reverse();
}

/**
 * Utilizes the A* Search Algorithm to get the search path and shortest path.
 *
 * @param {2D Array} grid The provided state of the grid
 * @param {[Number, Number]} startSquare The 2D coordinate of the starting location
 * @param {[Number, Number]} endSquare  The 2D coordinate of the target location
 * @return {[Array, Array]} Tuple of visited sequence of squares and shortest path from start to target.
 */

export default function astar(grid, startSquare, endSquare) {
    /*
    startSquare and endSquare should be [row, col] pairs.

    Heuristic used is Euclidean distance
    */
    
    const frontier = new PriorityQueue(comparator);
    const newGrid = prepareSearchGrid(grid, endSquare, getHeuristic(SELECTED_HEURISTIC));
    const visitSequence = [];

    let k = 0;
    frontier.push([newGrid[startSquare[0]][startSquare[1]].heuristic, k, newGrid[startSquare[0]][startSquare[1]]]);
    
    /* Main Loop */

    while (frontier.size() > 0) {
        const [priority, , currentSquare, prevSquare] = frontier.pop();
        const [row, col] = [currentSquare.row, currentSquare.col];
        
        if (currentSquare.leftVisited) {
            continue;
        }
        
        currentSquare.distance = priority - currentSquare.heuristic;
        currentSquare.prevSquare = prevSquare;
        currentSquare.leftVisited = true;
        visitSequence.push(currentSquare);
        if (currentSquare.isEnd){
            return [visitSequence, getShortestPath(newGrid, endSquare)];
        }

        /* Expand frontier */
        for (let [i, j] of [UP, DOWN, LEFT, RIGHT]) {
            if (((row+i < 0) || (row+i > newGrid.length - 1)) || ((col + j < 0) || (col + j > newGrid[0].length - 1))) {
                continue;
            }
            let square = newGrid[row+i][col+j];
            if (!(square.leftVisited || square.isWall)) {
                k += 1;
                frontier.push([priority - currentSquare.heuristic + square.heuristic + 1, k, square, currentSquare]);
            }
        } 
    }

    /*
    Reach here if no path is available.
    */
    return [visitSequence, []];


    



}