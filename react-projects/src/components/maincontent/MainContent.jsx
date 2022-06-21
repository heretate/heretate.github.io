import Game from "./gridsearch/Game";
import React, {useEffect, useRef, useLayoutEffect, useState} from 'react';
import "./maincontent.css";

export default function MainContent() {
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width:0, height: 0 });

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      });
    }
  }, []);

  return (
    <div className="main-content" ref={targetRef}> 
      <Game col={dimensions.width} row={dimensions.height} />
    </div>
  )
}
  