import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { containsSpecialChars, checkInteger, checkAlphanumeric } from '../utilities/InputValidation';

function AddVehicle({setNewVehicle}) {
  const [ vehicleName, setVehicleName ] = useState("");
  const [ vehicleYear, setVehicleYear ] = useState("");
  const [ vehicleMake, setVehicleMake ] = useState("");
  const [ vehicleModel, setVehicleModel ] = useState("");
  const [ vehicleMileage, setVehicleMileage ] = useState("");
  const [ VIN, setVIN ] = useState("");
  const [ errorDiv, setError ] = useState("");
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

  const addVehicle = async e => {
    e.preventDefault();
    try {
      // client-side error checking
      if(!vehicleName || !vehicleYear || !vehicleMake || !vehicleModel) {
        throw new Error("MISSING_REQ_FIELDS");
      }
      if(!checkInteger(vehicleYear)) {
        throw new Error("INVALID_YEAR");
      }
      if(vehicleMileage && !checkInteger(vehicleMileage)) {
        throw new Error("INVALID_MILEAGE");
      }
      if(VIN && !checkAlphanumeric(VIN)) {
        throw new Error("INVALID_VIN");
      }
      if(containsSpecialChars(vehicleName)) {
        throw new Error("NAME_CHARS");
      }
      if(containsSpecialChars(vehicleMake)) {
        throw new Error("MAKE_CHARS");
      }
      if(containsSpecialChars(vehicleModel)) {
        throw new Error("MODEL_CHARS");
      }

      let newVehicle = {}
      if(vehicleMileage && VIN) {
        newVehicle = {
          uuid:userId, name:vehicleName, year:vehicleYear, make:vehicleMake, model:vehicleModel, mileage:vehicleMileage, vin:VIN
        }
      }
      else if(vehicleMileage && !VIN) {
        newVehicle = {
          uuid:userId, name:vehicleName, year:vehicleYear, make:vehicleMake, model:vehicleModel, mileage:vehicleMileage, vin:null
        }
      }
      else if(!vehicleMileage && VIN) {
        newVehicle = {
          uuid:userId, name:vehicleName, year:vehicleYear, make:vehicleMake, model:vehicleModel, mileage:0, vin:VIN
        }
      }
      else if(!vehicleMileage && !VIN) {
        newVehicle = {
          uuid:userId, name:vehicleName, year:vehicleYear, make:vehicleMake, model:vehicleModel, mileage:0, vin:null
        }
      }
      const request = await fetch("http://localhost:1234/add-vehicle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newVehicle)
      })
      console.log(request);
      handleClose();
      setNewVehicle(true);
      setVehicleName("");
      setVehicleYear("");
      setVehicleMake("");
      setVehicleModel("");
      setVehicleMileage("");
      setVIN("");
      setError("");
    } catch (err) {
      if(err.message === "MISSING_REQ_FIELDS") setError("Error: Please fill in all required fields (*).");
      if(err.message === "INVALID_YEAR") setError("Error: Year must be a number.");
      if(err.message === "INVALID_MILEAGE") setError("Error: Mileage must be a number and contain no commas.");
      if(err.message === "INVALID_VIN") setError("Error: VIN can only contain alphanumeric characters.");
      if(err.message === "NAME_CHARS") setError("Error: Name can't contain special characters.");
      if(err.message === "MAKE_CHARS") setError("Error: Make can't contain special characters.");
      if(err.message === "MODEL_CHARS") setError("Error: Model can't contain special characters.");
      else console.log(err.message);
    }
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
          <center><div className="modalErrorDiv">{errorDiv}</div></center>
          <Form className="form-control-lg">
            <Form.Group className="mb-3" controlId="add-name-box">
              <Form.Label>Name *</Form.Label>
              <Form.Control value={vehicleName} onChange={e => setVehicleName(e.target.value)} placeholder="Enter vehicle name (nickname)" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="add-year-box">
              <Form.Label>Year *</Form.Label>
              <Form.Control type="number" value={vehicleYear} onChange={e => setVehicleYear(e.target.value)} placeholder="Enter model year" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="add-make-box">
              <Form.Label>Make *</Form.Label>
              <Form.Control value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} placeholder="Enter make (ex: Volkswagen)" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="add-model-box">
              <Form.Label>Model *</Form.Label>
              <Form.Control value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} placeholder="Enter model (ex: Passat)" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="add-mileage-box">
              <Form.Label>Mileage</Form.Label>
              <Form.Control type="number" value={vehicleMileage} onChange={e => setVehicleMileage(e.target.value)} placeholder="Enter current mileage" />
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