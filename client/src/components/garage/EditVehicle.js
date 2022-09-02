import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { containsSpecialChars, checkInteger, checkAlphanumeric } from '../utilities/InputValidation';

function EditVehicle({id}) {
  const getVehicle = async (id) => {
    try {
      const res = await fetch("http://localhost:1234/get-vehicle/" + id, {
        method: "GET"
      });

      const parseRes = await res.json();
      return parseRes;
    } catch (err) {
      console.error(err.message);
    }
  }

  const [ vehicle, setVehicle ] = useState();
  if(!vehicle) {
    getVehicle(id)
    .then(value => {
      setVehicle(value);
    });
  }

  const [ vehicleName, setVehicleName ] = useState(undefined);
  const [ vehicleYear, setVehicleYear ] = useState(undefined);
  const [ vehicleMake, setVehicleMake ] = useState(undefined);
  const [ vehicleModel, setVehicleModel ] = useState(undefined);
  const [ vehicleMileage, setVehicleMileage ] = useState(undefined);
  const [ VIN, setVIN ] = useState(undefined);
  const [ errorDiv, setError ] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if(vehicle && vehicleName === undefined) {
    setVehicleName(vehicle.vehicle_name);
    setVehicleYear(vehicle.model_year);
    setVehicleMake(vehicle.make);
    setVehicleModel(vehicle.model);
    if(vehicle.mileage) setVehicleMileage(vehicle.mileage);
    if(vehicle.vin) setVIN(vehicle.vin);
  }

  const editVehicle = async e => {
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
      if(vehicleMileage) {
        newVehicle = {
          id:id, name:vehicleName, year:vehicleYear, make:vehicleMake, model:vehicleModel, mileage:vehicleMileage, vin:VIN
        }
      } else {
        newVehicle = {
          id:id, name:vehicleName, year:vehicleYear, make:vehicleMake, model:vehicleModel, mileage:0, vin:VIN
        }
      }
      const request = await fetch("http://localhost:1234/edit-vehicle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newVehicle)
      })
      console.log(request);
      handleClose();
      window.location.reload();
    } catch (err) {
      if(err.message === "MISSING_REQ_FIELDS") setError("Error: Please fill in all required fields (*).");
      if(err.message === "INVALID_YEAR") setError("Error: Year must be a number.");
      if(err.message === "INVALID_MILEAGE") setError("Error: Mileage must be a number and contain no commas.");
      if(err.message === "INVALID_VIN") setError("Error: VIN must be an alphanumeric value.");
      if(err.message === "NAME_CHARS") setError("Error: Name can't contain special characters.");
      if(err.message === "MAKE_CHARS") setError("Error: Make can't contain special characters.");
      if(err.message === "MODEL_CHARS") setError("Error: Model can't contain special characters.");
      else console.log(err.message);
    }
  }

  return (
    <div className="Garage-modal">
      <Dropdown.Item onClick={handleShow}>Edit Vehicle</Dropdown.Item>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vehicle</Modal.Title>
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
          <Button variant="primary" onClick={editVehicle}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
  
export default EditVehicle;