import PriorityQueue, {comparator} from "../helpers/PriorityQueue.js"
import getHeuristic from "../helpers/heuristics.js";

const UP = [0, 1];
const DOWN = [0, -1];
const LEFT = [-1, 0];
const RIGHT = [1, 0]; 



const SELECTED_HEURISTIC = "euclidean";

const prepareSearchGrid = (startGrid, start, target, heuristic) => {
    const filledGrid = structuredClone(startGrid);
    const startSquare = filledGrid[start[0]][start[1]];
    const targetSquare = filledGrid[target[0]][target[1]];
    for (let row = 0; row < startGrid.length; row ++) {
        for (let col = 0; col < startGrid[0].length; col ++) {
            const currentSquare = filledGrid[row][col];
            currentSquare.startHeuristic = heuristic(currentSquare.row, targetSquare.row, currentSquare.col, targetSquare.col);
            currentSquare.goalHeuristic = heuristic(currentSquare.row, startSquare.row, currentSquare.col, startSquare.col);
        }
    }    
    
    return filledGrid;
}

const getShortestPath = (finishedGrid, leftTerminalSquare, rightTerminalSquare) => {
    let arr = [];
    let currentSquare = finishedGrid[leftTerminalSquare[0]][leftTerminalSquare[1]];
    while (!currentSquare.isStart) {
        arr.push(currentSquare);
        currentSquare = currentSquare.prevSquare;
    }
    arr.push(currentSquare);
    arr = arr.reverse();
    
    currentSquare = finishedGrid[rightTerminalSquare[0]][rightTerminalSquare[1]];
    while (!currentSquare.isEnd) {
        arr.push(currentSquare);
        currentSquare = currentSquare.prevSquare;
    }
    arr.push(currentSquare);
    return arr;
}

/**
 * Utilizes the Bidirectional A* Search Algorithm to get the search path and shortest path
 *
 * @param {2D Array} grid The provided state of the grid
 * @param {[Number, Number]} startSquare The 2D coordinate of the starting location
 * @param {[Number, Number]} endSquare  The 2D coordinate of the target location
 * @return {[Array, Array]} Tuple of visited sequence of squares and shortest path from start to target.
 */

export default function biastar(grid, startSquare, endSquare) {
    /*
    Note that the implementation here is a little hacky, relying on the leftVisited, rightVisited fields 
    to represent the visitation from both sides when they are originally intended for two separate algorithm visits representation
    */

    const startFrontier = new PriorityQueue(comparator);
    const endFrontier = new PriorityQueue(comparator);

    const newGrid = prepareSearchGrid(grid, startSquare, endSquare, getHeuristic(SELECTED_HEURISTIC));
    const visitSequence = [];


    let k = 0;
    startFrontier.push([newGrid[startSquare[0]][startSquare[1]].startHeuristic, k, newGrid[startSquare[0]][startSquare[1]]]);
    k += 1;
    endFrontier.push([newGrid[endSquare[0]][endSquare[1]].goalHeuristic, k, newGrid[endSquare[0]][endSquare[1]]]);
    const frontiers = [startFrontier, endFrontier];

    /* Main Loop */

    while ((frontiers[0].size() > 0) && frontiers[1].size() > 0) {
        const frontierIndex = k % 2;
        const frontier = frontiers[frontierIndex];

        const [priority, , currentSquare, prevSquare] = frontier.pop();
        const [row, col] = [currentSquare.row, currentSquare.col];
        
        if (frontierIndex === 0) {
            if (currentSquare.rightVisited) {
                return [visitSequence, getShortestPath(newGrid, [prevSquare.row, prevSquare.col], [row, col])]
            }
            else if (currentSquare.leftVisited) {
                continue
            }
            else {
                currentSquare.leftVisited = true;
                currentSquare.distance = priority - currentSquare.startHeuristic;
            }
        }
        else {
            if (currentSquare.leftVisited) {
                return [visitSequence, getShortestPath(newGrid, [row, col], [prevSquare.row, prevSquare.col])]
            }
            else if (currentSquare.rightVisited) {
                continue
            }
            else {
                currentSquare.rightVisited = true;
                currentSquare.distance = priority - currentSquare.goalHeuristic;
            }
        }
        
        currentSquare.prevSquare = prevSquare;
        visitSequence.push(currentSquare);

        /* Increment frontier */
        for (let [i, j] of [UP, DOWN, LEFT, RIGHT]) {
            if (((row+i < 0) || (row+i > newGrid.length - 1)) || ((col + j < 0) || (col + j > newGrid[0].length - 1))) {
                continue;
            }
            let square = newGrid[row+i][col+j];
            if (frontierIndex === 0) {
                if (!(square.leftVisited || square.isWall)) {
                    k += 1;
                    frontier.push([priority - currentSquare.startHeuristic + square.startHeuristic + 1, k, square, currentSquare]);
                }
            }
            else {
                if (!(square.rightVisited || square.isWall)) {
                    k += 1;
                    frontier.push([priority - currentSquare.goalHeuristic + square.goalHeuristic + 1, k, square, currentSquare]);
                }
            }
            
        } 
    }

    /*
    Reach here if no path is available.
    */
    return [visitSequence, []];


    



}