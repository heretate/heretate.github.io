import './legend.css'
import startIcon from "../../../assets/start.png"
import targetIcon from "../../../assets/target.png"

export default function Legend(props) {
   
 
 

  // The components generated in makeGrid are rendered in div.grid-board

    return (
        <div className='legend'>
            <div className="navbar-buffer"></div>
            <div className="legend-labels">
                <div className='legend-label'>
                    <div className='legend-left-visited legend-square'>1</div>
                    <div className='legend-right-visited legend-square'>2</div>
                    <div className='legend-both-visited legend-square'>1+2</div>
                    <div className='grid-text'>
                        Visited Squares
                    </div>
                </div>

                <div className='legend-label'>
                    <div className='legend-left-shortest legend-square'>1</div>
                    <div className='legend-right-shortest legend-square'>2</div>
                    <div className='legend-both-shortest legend-square'>1+2</div>
                    <div className='grid-text'>
                        Shortest Path Squares
                    </div>
                </div>

                <div className='legend-label'>
                    <div className='start-square'><img src={startIcon} alt="" width='30px' height='30px' /></div>
                    <div className='grid-text'>
                        Start Square
                    </div>
                </div>

                <div className='legend-label'>
                    <div className='end-square'><img src={targetIcon} alt="" width='30px' height='30px' /></div>
                    <div className='grid-text'>
                        Target Square
                    </div>
                </div>

                <div className='legend-label'>
                    <div className='legend-wall legend-square'></div>
                    <div className='grid-text'>
                        Wall Square
                    </div>
                </div>
                
            
                
            </div>
            
        </div> 
        
    )
}