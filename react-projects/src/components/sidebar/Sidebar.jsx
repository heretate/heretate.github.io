import "./sidebar.css"
import {GridOn} from '@mui/icons-material';


export default function Sidebar() {
  return (
    <div className="sidebar">
        <div className="sidebarWrapper">
            <div className="sidebarMenu">
                <h3 className="sidebarTitle">Project Selection</h3>
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <GridOn className="sidebarIcon"/>
                        Grid Search Comparison
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}
