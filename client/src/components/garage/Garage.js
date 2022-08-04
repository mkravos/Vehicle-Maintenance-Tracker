import React, { useState } from 'react';
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
  const getUserId = async () => {
    try {
      const res = await fetch("http://localhost:1234/uuid", {
        method: "GET",
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.json();
      return parseRes;
    } catch (err) {
      console.error(err.message);
    }
  }

  const [ userId, setUserId ] = useState();
  if(!userId) {
    getUserId()
    .then(value => {
      setUserId(value.id);
    });
  }
  
  const getVehicles = async (uuid) => {
    try {
      const res = await fetch("http://localhost:1234/get-vehicle-list/" + uuid, {
        method: "GET"
      });

      const parseRes = await res.json();
      return parseRes;
    } catch (err) {
      console.error(err.message);
    }
  }

  const [ vehicles, setVehicles ] = useState();
  if(userId && !vehicles) {
    getVehicles(userId)
    .then(value => {
      setVehicles(value);
    });
  }

  return (
    <div className="Garage">
      <BootstrapNavbar/>
      <header className="Garage-header">
        <p className="Page-title">Garage</p>
        {vehicles ? vehicles.map((val, key) => {
          return (
            <Card className="col-sm-8 Card" key={key}>
              <Card.Body>
                <Card.Title>{val.model_year} {val.make} {val.model}</Card.Title>
                <div className="Card-text">
                  <div><span className="vehicleItem">Name: </span>{val.vehicle_name}</div>
                    <div><span className="vehicleItem">Mileage: </span> {val.mileage}</div>
                    {
                      val.vin ? <div><span className="vehicleItem">VIN: </span> {val.vin}</div> : null
                    }
                  <div><span className="vehicleItem">Last Service: </span>Not Implemented</div>
                </div>
                <div className="Garage-dropdown-container">
                  <DropdownButton className="Actions-dropdown" variant="primary" id="dropdown-basic-button" title="Actions">
                    <UpdateMileage id={val.id}/>
                    <RecordServiceItem id={val.id}/>
                    <ViewServiceRecords id={val.id}/>
                    <GenerateReport id={val.id}/>
                  </DropdownButton>
                  <DropdownButton className="Vehicle-dropdown" variant="outline-primary" id="dropdown-basic-button" title="Vehicle">
                    <EditVehicle id={val.id}/>
                    <RemoveVehicle id={val.id}/>
                  </DropdownButton>
                </div>
              </Card.Body>
            </Card>
          )
        }) : null}
        <AddVehicle/>
      </header>
    </div>
  );
}

export default Garage;