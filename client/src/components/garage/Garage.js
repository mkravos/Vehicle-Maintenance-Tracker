import React, { useState, useEffect } from 'react';
import BootstrapNavbar from '../BootstrapNavbar.js';
import UpdateMileage from './UpdateMileage.js';
import RecordServiceItem from './RecordServiceItem.js';
import GenerateReport from './GenerateReport.js';
import AddVehicle from './AddVehicle.js';
import EditVehicle from './EditVehicle.js';
import RemoveVehicle from './RemoveVehicle.js';
import ServiceRecords from './ServiceRecords.js';
import { Card, DropdownButton } from 'react-bootstrap';

function Garage() {
  const [vehicleAdded, setVehicleAdded] = useState(false);
  const [vehicleEdited, setVehicleEdited] = useState(false);
  const [vehicleRemoved, setVehicleRemoved] = useState(false);
  const [mileageUpdated, setMileageUpdated] = useState(false);
  const [itemRecorded, setItemRecorded] = useState(false);

  const recordedItem = boolean => {
    setItemRecorded(boolean);
  };
  const setNewVehicle = boolean => {
    setVehicleAdded(boolean);
  };
  const updatedMileage = boolean => {
    setMileageUpdated(boolean);
  };
  const editedVehicle = boolean => {
    setVehicleEdited(boolean);
  };
  const removedVehicle = boolean => {
    setVehicleRemoved(boolean);
  };

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
  function getVehicleList(id) {
    getVehicles(id)
    .then(value => {
      setVehicles(value);
    });
  }
  if(userId && !vehicles) {
    getVehicleList(userId);
  }

  useEffect(() => {
    if(userId) {
      setVehicleAdded(false);
      getVehicleList(userId);
    }
  },[vehicleAdded]);
  useEffect(() => {
    if(userId) {
      setVehicleEdited(false);
      getVehicleList(userId);
    }
  },[vehicleEdited]);
  useEffect(() => {
    if(userId) {
      setVehicleRemoved(false);
      getVehicleList(userId);
    }
  },[vehicleRemoved]);
  useEffect(() => {
    if(userId) {
      setMileageUpdated(false);
      getVehicleList(userId);
    }
  },[mileageUpdated]);
  useEffect(() => {
    setItemRecorded(false);
  },[itemRecorded]);
  
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
                </div>
                <div className="Garage-dropdown-container">
                  <DropdownButton className="Actions-dropdown" variant="primary" id="dropdown-basic-button" title="Actions">
                    <UpdateMileage id={val.id} updatedMileage={updatedMileage}/>
                    <RecordServiceItem id={val.id} vehicleName={val.vehicle_name} recordedItem={recordedItem}/>
                    <GenerateReport id={val.id}/>
                  </DropdownButton>
                  <DropdownButton className="Vehicle-dropdown" variant="outline-primary" id="dropdown-basic-button" title="Vehicle">
                    <EditVehicle id={val.id} editedVehicle={editedVehicle}/>
                    <RemoveVehicle id={val.id} removedVehicle={removedVehicle}/>
                  </DropdownButton>
                </div>
                <ServiceRecords 
                  vehicleId={val.id} 
                  currMiles={val.mileage} 
                  vehicleName={val.vehicle_name} 
                  itemRecorded={itemRecorded}
                />
              </Card.Body>
            </Card>
          )
        }) : null}
        <AddVehicle setNewVehicle={setNewVehicle}/>
      </header>
    </div>
  );
}

export default Garage;