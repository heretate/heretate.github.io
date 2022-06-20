import React, { useState } from "react";
import Board from "./Board";
import NavBar from "./NavBar";
import Legend from "./Legend";
import getAlgorithm from "../../../algorithms/index.js"

import "./game.css"

const UPDATE_SPEED = 10;
const SHORTEST_PATH_MARGIN = 3;
const LATENCY_PADDING = 1000;

const ROW_LEN = 25;
const COL_LEN = 50;
const HORIZONTAL_OFFSET = 7

let root = document.documentElement;
root.style.setProperty('--cols', COL_LEN);

const START_SQUARE_ROW = Math.floor(ROW_LEN / 2);
const START_SQUARE_COL = HORIZONTAL_OFFSET - 1;
const FINISH_SQUARE_ROW = Math.floor(ROW_LEN / 2);
const FINISH_SQUARE_COL = COL_LEN - HORIZONTAL_OFFSET;


const initializeGrid = () => {
  const grid = [];
  for (let row = 0; row < ROW_LEN; row++) {
    const currentRow = [];
    for (let col = 0; col < COL_LEN; col++) {
      currentRow.push(createSquare(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
}

const createSquare = (row, col) => {
  /*
  Initializes the dictionary that describes the square. prevNode and distance together keep track of shortest path to node.
  */
  return {
    row: row,
    col: col,
    squareId: `${row}-${col}`,
    isStart: row === START_SQUARE_ROW && col === START_SQUARE_COL,
    isEnd: row === FINISH_SQUARE_ROW && col === FINISH_SQUARE_COL,
    isWall: false,
    leftVisited: false,
    rightVisited: false,
    prevSquare: null,
  };
};

const animateAlgorithms = (leftSearchSequence, rightSearchSequence) => {
  const visitedSquares = new Set();
  let i = 0;
  let j = 0;
  while ((i < leftSearchSequence.length) || (j < rightSearchSequence.length)) {
    
    const exceedLeft = i >= leftSearchSequence.length;
    const exceedRight = j >= rightSearchSequence.length;
    const leftUnderRight = i <= j;

    const square = exceedLeft
    ? rightSearchSequence[j]
    : exceedRight
    ? leftSearchSequence[i]
    : leftUnderRight
    ? leftSearchSequence[i]
    : rightSearchSequence[j]

    const isLeft = exceedLeft
    ? false
    : exceedRight
    ? true
    : leftUnderRight
    ? true
    : false

    const animateSquare = (styleName, visitedSquares, square, i, j, isLeft) => {
      if (visitedSquares.has(square.squareId)) {
        setTimeout(() => {
          document.getElementById(square.squareId).className =
            `grid-square ${styleName} left-visited-true-right-visited-true`;
        }, (i+j) * UPDATE_SPEED);
      }
      else {
        visitedSquares.add(square.squareId);
        setTimeout(() => {
          document.getElementById(square.squareId).className =
          `grid-square ${styleName} left-visited-${isLeft}-right-visited-${!isLeft}`;
        }, (i+j) * UPDATE_SPEED);
      }
    }



    if ((square.row === START_SQUARE_ROW) && (square.col === START_SQUARE_COL)) {
      animateSquare("start-default", visitedSquares, square, i, j , isLeft);
    }
    else if ((square.row === FINISH_SQUARE_ROW) && (square.col === FINISH_SQUARE_COL)) {
      animateSquare("end-default", visitedSquares, square, i, j , isLeft);
    }
    else {
      animateSquare("", visitedSquares, square, i, j , isLeft);
    }  


    if (isLeft) {
      i += 1;
    }
    else {
      j += 1;
    }
  }

}


const getNewGrid = (grid, keepWalls) => {
  const oldGrid = structuredClone(grid);
  const newGrid = initializeGrid();
  for (let row = 0; row < newGrid.length; row ++) {
    for (let col = 0; col < newGrid[0].length; col ++) {
      if (newGrid[row][col].isEnd) {
        document.getElementById(`${row}-${col}`).className = 'grid-square end-default';
      }
      else if (newGrid[row][col].isStart) {
        document.getElementById(`${row}-${col}`).className = 'grid-square start-default';
      }
      else{
        if (oldGrid[row][col].isWall && keepWalls) {
          newGrid[row][col].isWall = true;
          document.getElementById(`${row}-${col}`).className = 'grid-square wall';
        }
        else{
          document.getElementById(`${row}-${col}`).className = 'grid-square left-visited-false-right-visited-false';
        }

      } 
    }
  }  
  return newGrid;
}

const animateShortestPaths = (leftPathSequence, rightPathSequence, waitTime) => {
  const visitedSquares = new Set();
  let i = 0;
  let j = 0;

  while ((i < leftPathSequence.length) || (j < rightPathSequence.length)) {

    const exceedLeft = i >= leftPathSequence.length;
    const exceedRight = j >= rightPathSequence.length;
    const leftUnderRight = i <= j;

    const square = exceedLeft
    ? rightPathSequence[j]
    : exceedRight
    ? leftPathSequence[i]
    : leftUnderRight
    ? leftPathSequence[i]
    : rightPathSequence[j]

    const isLeft = exceedLeft
    ? false
    : exceedRight
    ? true
    : leftUnderRight
    ? true
    : false

    const animateSquare = (styleName, visitedSquares, square, i, j, isLeft) => {
      if (visitedSquares.has(square.squareId)) {
        setTimeout(() => {
          document.getElementById(square.squareId).className =
            `grid-square ${styleName} left-shortest-true-right-shortest-true`;
        }, (i+j) * UPDATE_SPEED + waitTime);
      }
      else {
        visitedSquares.add(square.squareId);
        setTimeout(() => {
          document.getElementById(square.squareId).className =
          `grid-square ${styleName} left-shortest-${isLeft}-right-shortest-${!isLeft}`;
        }, (i+j) * UPDATE_SPEED + waitTime);
      }
    }



    if ((square.row === START_SQUARE_ROW) && (square.col === START_SQUARE_COL)) {
      animateSquare("start-default", visitedSquares, square, i, j , isLeft);
    }
    else if ((square.row === FINISH_SQUARE_ROW) && (square.col === FINISH_SQUARE_COL)) {
      animateSquare("end-default", visitedSquares, square, i, j , isLeft);
    }
    else {
      animateSquare("", visitedSquares, square, i, j , isLeft);
    }  


    if (isLeft) {
      i += 1;
    }
    else {
      j += 1;
    }
  }
}

export default function Game() {

    const [grid, setGrid] = useState(initializeGrid());
    const [isRun, setIsRun] = useState(false);
    const [leftAlgorithm, setLeftAlgorithm] = useState("none");
    const [rightAlgorithm, setRightAlgorithm] = useState("none");

    /*
    Used async/await to force timeouts to in practice behave synchronously.
    Doesn't solve the lock problem however.

    For now, will omit updating grid...
    */
    const animate = async(leftVisitSequence, leftShortestPath, rightVisitSequence, rightShortestPath) => {
      animateAlgorithms(leftVisitSequence, rightVisitSequence);
      /*
      await new Promise((resolve) => {
        setTimeout(() => {
            // Resolve the promise
            resolve(setGrid(newGrid));
        }, (leftVisitSequence.length + rightVisitSequence.length) * UPDATE_SPEED + 50);
      });
      */
      animateShortestPaths(leftShortestPath, rightShortestPath, (leftVisitSequence.length + rightVisitSequence.length) * UPDATE_SPEED + LATENCY_PADDING / 2);
    }


    const selectLeftAlgorithm = (algo) => {
      setLeftAlgorithm(algo);
      document.getElementById("left-algo-dropdown").title = algo;
      
    }

    const selectRightAlgorithm = (algo) => {
      setRightAlgorithm(algo);
      document.getElementById("right-algo-dropdown").title = algo;
      
    }

    const clickGo = () => {
      if (isRun) {
        const newGrid = getNewGrid(grid, false); 
        setGrid(newGrid);  
      }
      setIsRun(true);
      const leftAlgoFn = getAlgorithm(leftAlgorithm);
      const rightAlgoFn = getAlgorithm(rightAlgorithm);
      const [leftVisitSequence, leftShortestPath] = leftAlgoFn(grid, [START_SQUARE_ROW, START_SQUARE_COL], [FINISH_SQUARE_ROW, FINISH_SQUARE_COL]);
      const [rightVisitSequence, rightShortestPath] = rightAlgoFn(grid, [START_SQUARE_ROW, START_SQUARE_COL], [FINISH_SQUARE_ROW, FINISH_SQUARE_COL]);
      animate(leftVisitSequence, leftShortestPath, rightVisitSequence, rightShortestPath);
      return (leftVisitSequence.length + rightVisitSequence.length) * UPDATE_SPEED + (leftShortestPath.length + rightShortestPath.length) * (UPDATE_SPEED + SHORTEST_PATH_MARGIN) + LATENCY_PADDING * 2;
    }


    const clickReset = () => {
      const newGrid = getNewGrid(grid, false); 
      setGrid(newGrid);    
      setIsRun(false);
    }

    /*
    Soft reset does not clear off walls
    */
    const clickSoftReset = () => {
      const newGrid = getNewGrid(grid, true);   
      setGrid(newGrid);    
      setIsRun(false);
    }

    
    const updateSquare = (row, col, squareState) => {
      const newGrid = grid.slice();
      newGrid[row][col] = squareState;
      setGrid(newGrid);
    }

    const clickWall = (row, col) => {
      const squareState = grid[row][col];
      const newSquareState = {
        ...squareState,
        isWall: !squareState.isWall,
      }
      updateSquare(row, col, newSquareState);
    }

    return (
      <div className="game">
        <NavBar 
        leftAlgoName={leftAlgorithm} 
        rightAlgoName={rightAlgorithm} 
        selectLeftAlgo={selectLeftAlgorithm} 
        selectRightAlgo={selectRightAlgorithm} 
        clickGo={clickGo} 
        clickReset={clickReset}
        clickSoftReset={clickSoftReset}
        />
        <Legend/>
        <Board grid={grid} rowLength={ROW_LEN} colLength={COL_LEN} handleClick={clickWall}/>
      </div>
    )
  }
  