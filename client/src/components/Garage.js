import BootstrapNavbar from './BootstrapNavbar.js';
import { Card, DropdownButton, Dropdown } from 'react-bootstrap';

function Garage() {
    return (
      <div className="Garage">
        <BootstrapNavbar></BootstrapNavbar>
        <header className="Garage-header">
          <br/>
          <p>Garage</p>
          <Card className="col-sm-8">
            <Card.Body>
              <Card.Title>Year, Make, Model</Card.Title>
              <Card.Text>
                <p className="Garage-card-text">
                  Name:
                  <br/>
                  Mileage:
                  <br/>
                  Last Service:
                </p>
              </Card.Text>
              <DropdownButton id="dropdown-basic-button" title="Actions">
                <Dropdown.Item href="#/action-1">Update Mileage</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Record Service Item</Dropdown.Item>
              </DropdownButton>
            </Card.Body>
          </Card>
          <br/>
          <Card className="col-sm-8">
            <Card.Body>
              <Card.Title>Year, Make, Model</Card.Title>
              <Card.Text>
                <p className="Garage-card-text">
                  Name:
                  <br/>
                  Mileage:
                  <br/>
                  Last Service:
                </p>
              </Card.Text>
              <DropdownButton id="dropdown-basic-button" title="Actions">
                <Dropdown.Item href="#/action-1">Update Mileage</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Record Service Item</Dropdown.Item>
              </DropdownButton>
            </Card.Body>
          </Card>
        </header>
      </div>
    );
}

export default Garage;