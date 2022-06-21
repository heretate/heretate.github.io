import './square.css'
import {useState} from 'react';
export default function Square(props) {

    const [isWall, setIsWall] = useState(false);

    const getVisited = (visitLeft, visitRight) => {
        const classType = `left-visited-${visitLeft}-right-visited-${visitRight}`;
        return classType;
    }

    const classType = props.isEnd
    ? 'end-default'
    : props.isStart
    ? 'start-default test'
    : props.isWall
    ? 'wall'
    : getVisited(props.leftVisited, props.rightVisited)

    if (props.isWall !== isWall) {
        setIsWall(props.isWall);
    }

    const handleClick = () => {
        props.handleClick(props.row, props.col);
    }
    
    const handleMouseDown = () => {
        props.handleMouseDown(props.row, props.col);
    }
    const handleMouseMove = () => {
        props.handleMouseMove(props.row, props.col);
    }
    const handleMouseUp = () => {
        props.handleMouseUp();
    }
    const classes = `grid-square ${classType}`
    return <button className={classes} id={`${props.row}-${props.col}`} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}/>
}