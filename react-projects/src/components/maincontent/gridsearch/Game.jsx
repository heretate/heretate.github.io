import React, { useState } from "react";
import Board from "./Board";
import NavBar from "./NavBar";
import Legend from "./Legend";
import getAlgorithm from "../../../algorithms/index.js"

import "./game.css"
import { useEffect } from "react";

const UPDATE_SPEED = 10;
const SHORTEST_PATH_MARGIN = 3;
const LATENCY_PADDING = 1000;

const ROW_LEN = 25;


const HORIZONTAL_OFFSET = 7

const getGridColumn = (colLength) => {
  let root = document.documentElement;
  const boxSize = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--tile-size'));
  let flooredLength = Math.floor(colLength / boxSize);
  flooredLength = Math.min(50, Math.max(flooredLength, 30));
  if (!(flooredLength % 2 === 0)) {

    flooredLength -= 1;
  }
  root.style.setProperty('--cols', flooredLength);
  return flooredLength;
  
}

const initializeGrid = (rowLength, colLength, startSquare, targetSquare) => {
  const grid = [];
  for (let row = 0; row < rowLength; row++) {
    const currentRow = [];
    for (let col = 0; col < colLength; col++) {
      currentRow.push(createSquare(row, col, startSquare, targetSquare));
    }
    grid.push(currentRow);
  }
  return grid;
}

const createSquare = (row, col, startSquare, targetSquare) => {
  /*
  Initializes the dictionary that describes the square. prevNode and distance together keep track of shortest path to node.
  */
  return {
    row: row,
    col: col,
    squareId: `${row}-${col}`,
    isStart: row === startSquare[0] && col === startSquare[1],
    isEnd: row === targetSquare[0] && col === targetSquare[1],
    isWall: false,
    leftVisited: false,
    rightVisited: false,
    prevSquare: null,
  };
};

const animateAlgorithms = (leftSearchSequence, rightSearchSequence, startSquare, targetSquare) => {
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



    if ((square.row === startSquare[0]) && (square.col === startSquare[1])) {
      animateSquare("start-default", visitedSquares, square, i, j , isLeft);
    }
    else if ((square.row === targetSquare[0]) && (square.col === targetSquare[1])) {
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


const getNewGrid = (grid, keepWalls, startSquare, targetSquare) => {
  const oldGrid = structuredClone(grid);
  const newGrid = initializeGrid(grid.length, grid[0].length, startSquare, targetSquare);
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

const animateShortestPaths = (leftPathSequence, rightPathSequence, startSquare, targetSquare, waitTime) => {
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



    if ((square.row === startSquare[0]) && (square.col === startSquare[1])) {
      animateSquare("start-default", visitedSquares, square, i, j , isLeft);
    }
    else if ((square.row === targetSquare[0]) && (square.col === targetSquare[1])) {
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

export default function Game(props) {

  const [colLength, setColLength] = useState(getGridColumn(props.col));
  const [startSquare, setStartSquare] = useState([Math.floor(ROW_LEN/ 2), HORIZONTAL_OFFSET - 1]);
  const [targetSquare, setTargetSquare] = useState([Math.floor(ROW_LEN/ 2), colLength - HORIZONTAL_OFFSET]);
  const [rowLength, setRowLength] = useState(ROW_LEN);
  const [grid, setGrid] = useState(initializeGrid(rowLength, colLength, startSquare, targetSquare));
  const [isRun, setIsRun] = useState(false);
  const [wallSelected, setWallSelected] = useState(0); /* 0 - Not selected, 1 - Selected add wall, 2 - Selected remove wall*/
  const [leftAlgorithm, setLeftAlgorithm] = useState("none");
  const [rightAlgorithm, setRightAlgorithm] = useState("none");
  
  useEffect(() => {
    setColLength(getGridColumn(props.col));
    setStartSquare([Math.floor(ROW_LEN/ 2), HORIZONTAL_OFFSET - 1]);
    setTargetSquare([Math.floor(ROW_LEN/ 2), colLength - HORIZONTAL_OFFSET]);
    setGrid(initializeGrid(ROW_LEN, colLength, [Math.floor(ROW_LEN/ 2), HORIZONTAL_OFFSET - 1], [Math.floor(ROW_LEN/ 2), colLength - HORIZONTAL_OFFSET]));
  }, [props.col, colLength])

    /*
    Used async/await to force timeouts to in practice behave synchronously.
    Doesn't solve the lock problem however.

    For now, will omit updating grid...
    */
    const animate = async(leftVisitSequence, leftShortestPath, rightVisitSequence, rightShortestPath) => {

      animateAlgorithms(leftVisitSequence, rightVisitSequence, startSquare, targetSquare);
      /*
      await new Promise((resolve) => {
        setTimeout(() => {
            // Resolve the promise
            resolve(setGrid(newGrid));
        }, (leftVisitSequence.length + rightVisitSequence.length) * UPDATE_SPEED + 50);
      });
      */
      animateShortestPaths(leftShortestPath, rightShortestPath, startSquare, targetSquare, (leftVisitSequence.length + rightVisitSequence.length) * UPDATE_SPEED + LATENCY_PADDING / 2);
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
      const [leftVisitSequence, leftShortestPath] = leftAlgoFn(grid, startSquare, targetSquare);
      const [rightVisitSequence, rightShortestPath] = rightAlgoFn(grid, startSquare, targetSquare);
      animate(leftVisitSequence, leftShortestPath, rightVisitSequence, rightShortestPath);
      return (leftVisitSequence.length + rightVisitSequence.length) * UPDATE_SPEED + (leftShortestPath.length + rightShortestPath.length) * (UPDATE_SPEED + SHORTEST_PATH_MARGIN) + LATENCY_PADDING * 2;
    }


    const clickReset = () => {
      const newGrid = getNewGrid(grid, false, startSquare, targetSquare); 
      setGrid(newGrid);    
      setIsRun(false);
    }

    /*
    Soft reset does not clear off walls
    */
    const clickSoftReset = () => {
      const newGrid = getNewGrid(grid, true, startSquare, targetSquare);   
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

    const setWall = (row, col) => {
      const squareState = grid[row][col];
      if (squareState.isWall) {
        setWallSelected(2);
        
      }
      else {
        setWallSelected(1);
      }     

    }

    const mouseMove = (row, col) => {
      const squareState = grid[row][col];
      if (wallSelected === 1) {
        if (!squareState.isWall) {
          const newSquareState = {
            ...squareState,
            isWall: !squareState.isWall,
          }
          updateSquare(row, col, newSquareState);
        }
      }
      else if (wallSelected === 2) {
        if (squareState.isWall) {
          const newSquareState = {
            ...squareState,
            isWall: !squareState.isWall,
          }
          updateSquare(row, col, newSquareState);
        }
      }
    }

    const resetWallSelected = () => {
      setWallSelected(0);
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
        <Board grid={grid} rowLength={rowLength} colLength={colLength} handleClick={clickWall} handleMouseDown={setWall} handleMouseUp={resetWallSelected} handleMouseMove={mouseMove}/>
      </div>
    )
  }
  