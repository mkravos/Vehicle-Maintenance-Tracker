import React from 'react';
import BootstrapNavbar from '../BootstrapNavbar.js';
import UpdateMileage from './UpdateMileage.js';
import RecordServiceItem from './RecordServiceItem.js';
import ViewServiceRecords from './ViewServiceRecords';
import GenerateReport from './GenerateReport.js';
import AddVehicle from './AddVehicle.js';
import EditVehicle from './EditVehicle.js';
import RemoveVehicle from './RemoveVehicle.js';
import { Card, DropdownButton } from 'react-bootstrap';

function Garage() {
    return (
      <div className="Garage">
        <BootstrapNavbar/>
        <header className="Garage-header">
          <p className="Page-title">Garage</p>
          <Card className="col-sm-8 Card">
            <Card.Body>
              <Card.Title>Year, Make, Model</Card.Title>
              <Card.Text>
                <p className="Card-text">
                  Name:
                  <br/>
                  Mileage:
                  <br/>
                  Last Service:
                </p>
              </Card.Text>
              <div className="Garage-dropdown-container">
                <DropdownButton id="dropdown-basic-button" title="Actions">
                  <UpdateMileage/>
                  <RecordServiceItem/>
                  <ViewServiceRecords/>
                  <GenerateReport/>
                </DropdownButton>
                <DropdownButton className="Vehicle-dropdown" variant="outline-primary" id="dropdown-basic-button" title="Vehicle">
                  <EditVehicle/>
                  <RemoveVehicle/>
                </DropdownButton>
              </div>
            </Card.Body>
          </Card>
          <AddVehicle/>
        </header>
      </div>
    );
}

export default Garage;