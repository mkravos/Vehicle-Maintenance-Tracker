import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppHeader from "./AppHeader";

function Error404() {
    return (
        <div className="e404">
          <header className="App-header">
            <AppHeader/>
            <div>
              <p>404: There is nothing at this address.</p>
              <a href="https://www.freepik.com/vectors/modern-texture" target="_blank" rel="noopener noreferrer" className="Background-attribution">Modern texture vector created by rawpixel.com - www.freepik.com</a>
              <center><Link to="/dashboard"><Button variant="outline-primary">Go Home</Button></Link></center>
            </div>
          </header>
        </div>
      );
}

export default Error404;