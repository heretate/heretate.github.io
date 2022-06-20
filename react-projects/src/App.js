import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import MainContent from "./components/maincontent/MainContent";

import "./app.css"

function App() {
  return (
    <div>
      <Topbar/>
      <div className="appContainer">
        <Sidebar/>
        <div className="contentContainer">
          <MainContent/>
        </div>
        
      </div>
    </div>
  );
}

export default App;
