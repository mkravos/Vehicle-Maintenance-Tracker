import React, { useState, useEffect, use } from 'react';
import BootstrapNavbar from '../BootstrapNavbar.js';
import UpdateMileage from './UpdateMileage.js';
import RecordServiceItem from './RecordServiceItem.js';
import AddVehicle from './AddVehicle.js';
import EditVehicle from './EditVehicle.js';
import RemoveVehicle from './RemoveVehicle.js';
import ServiceRecords from './ServiceRecords.js';
import { Card, DropdownButton } from 'react-bootstrap';
import { listVehicles } from '../../rest/vehicle.js';

function Garage(props) {
  const { userId } = props;

  const [vehicles, setVehicles] = useState();
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

  useEffect(() => {
    listVehicles(userId)
      .then((res) => {
        if (res.status === 200) {
          setVehicles(res.data);
        } else {
          console.error('Failed to fetch vehicle list. Response:', res);
        }
      }).catch((err) => {
        console.error('Error fetching vehicle list:', err);
      });
  }, [userId, vehicleAdded, vehicleEdited, vehicleRemoved, mileageUpdated]);

  return (
    <div className="Garage">
      <BootstrapNavbar />
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
                    <UpdateMileage id={val.id} updatedMileage={updatedMileage} />
                    <RecordServiceItem id={val.id} vehicleName={val.vehicle_name} recordedItem={recordedItem} />
                    {/* <GenerateReport id={val.id} /> */}
                  </DropdownButton>
                  <DropdownButton className="Vehicle-dropdown" variant="outline-primary" id="dropdown-basic-button" title="Vehicle">
                    <EditVehicle editedVehicle={editedVehicle} vehicle={val} />
                    <RemoveVehicle id={val.id} removedVehicle={removedVehicle} />
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
        <AddVehicle setNewVehicle={setNewVehicle} userId={userId} />
      </header>
    </div>
  );
}

export default Garage;
