import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';

function AddVehicle() {
  const [ vehicleName, setVehicleName ] = useState("");
  const [ vehicleYear, setVehicleYear ] = useState("");
  const [ vehicleMake, setVehicleMake ] = useState("");
  const [ vehicleModel, setVehicleModel ] = useState("");
  const [ vehicleMileage, setVehicleMileage ] = useState("");
  const [ VIN, setVIN ] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const [ userId, setUserId ] = useState("");
  getUserId()
  .then(value => {
    setUserId(value.id);
  });

  const addVehicle = async () => {
    try {
      const newVehicle = {
        uuid:userId, name:vehicleName, year:vehicleYear, make:vehicleMake, model:vehicleModel, mileage:vehicleMileage, vin:VIN
      }
      const register_request = await fetch("http://localhost:1234/add-vehicle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newVehicle)
      }).then(async res => {
          // server-side error checking
          if(res.ok) {
            const text = await res.text();
          }
        });
        console.log(register_request);
    } catch (err) {
      console.log(err.message);
    }

    handleClose();
  }

  return (
    <div className="Garage-modal">
      <OverlayTrigger placement="bottom" overlay={AddVehicleTooltip}>
          <Button className="addVehicle" variant="outline-primary" onClick={handleShow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </Button>
      </OverlayTrigger>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-control-lg">
            <Form.Group className="mb-3" controlId="add-name-box">
              <Form.Label>Name</Form.Label>
              <Form.Control value={vehicleName} onChange={e => setVehicleName(e.target.value)} placeholder="Enter vehicle name (nickname)" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="add-year-box">
              <Form.Label>Year</Form.Label>
              <Form.Control value={vehicleYear} onChange={e => setVehicleYear(e.target.value)} placeholder="Enter model year" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="add-make-box">
              <Form.Label>Make</Form.Label>
              <Form.Control value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} placeholder="Enter make (ex: Volkswagen)" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="add-model-box">
              <Form.Label>Model</Form.Label>
              <Form.Control value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} placeholder="Enter model (ex: Passat)" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="add-mileage-box">
              <Form.Label>Mileage</Form.Label>
              <Form.Control value={vehicleMileage} onChange={e => setVehicleMileage(e.target.value)} placeholder="Enter current mileage" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="add-vin-box">
              <Form.Label>VIN</Form.Label>
              <Form.Control value={VIN} onChange={e => setVIN(e.target.value)} placeholder="Enter Vehicle Identification Number" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addVehicle}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const AddVehicleTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Add a vehicle
  </Tooltip>
);
  
export default AddVehicle;