import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import OSCTdb from "./components/OSCTdb";
import BALOSCTdb from "./components/BALOSCTdb";
import About from "./components/About";
import COPA from "./components/COPA";

function App() {
  return (
    <Router>
        <nav>
            <Navbar/>
        </nav>
        <Routes>
                <Route exact path="/" element={<About/>} />
                <Route path="/OSCTdb" element={<OSCTdb/>} />
                <Route path="/BALOSCTdb" element={<BALOSCTdb />} />
                <Route path="/COPA" element={<COPA />} />
                {/* API */}
        </Routes>
    </Router>
  )
}

export default App
