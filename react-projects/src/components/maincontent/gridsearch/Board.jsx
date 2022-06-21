import Square from "./Square";

import './board.css'

export default function Board(props) {

    // Needs a grid spec to convert into full board

    // Generates the grid. Note that the dimensions are prespecified here. 
    // TODO - Implement dynamic sizing of chart based on screen size
    
    const grid = []

    for (let row = 0; row < props.rowLength; row ++) {
        grid.push([])
        for (let col = 0; col < props.colLength; col ++) {
            grid[row].push(<Square
                key={`${row}-${col}`}
                handleClick={props.handleClick}
                handleMouseDown={props.handleMouseDown}
                handleMouseUp={props.handleMouseUp}
                handleMouseMove={props.handleMouseMove}
                {...props.grid[row][col]}>
              </Square>)
        }
    }
 

  // The components generated in makeGrid are rendered in div.grid-board

    return (
        <div className='grid-board'>
            {grid}
        </div> 
        
    )
}