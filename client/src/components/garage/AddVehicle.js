import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { containsSpecialChars, checkInteger, checkAlphanumeric } from '../utilities/InputValidation';
import { addVehicle } from '../../rest/vehicleREST';

function AddVehicle({ setNewVehicle, userId }) {
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleMileage, setVehicleMileage] = useState("");
  const [VIN, setVIN] = useState("");
  const [errorDiv, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async e => {
    e.preventDefault();
    addVehicle(userId, {
      vehicle_name: vehicleName,
      model_year: parseInt(vehicleYear, 10),
      make: vehicleMake,
      model: vehicleModel,
      mileage: vehicleMileage !== "" ? parseInt(vehicleMileage, 10) : undefined,
      vin: VIN !== "" ? VIN : undefined
    }).then((res) => {
      if (res.status === 201) {
        setNewVehicle(true);
      } else {
        console.error('Failed to add vehicle. Response:', res);
      }
    }).catch((err) => {
      console.error('Error adding vehicle:', err);
    }).finally(() => {
      handleClose();
    });
  }

  useEffect(() => {
    setVehicleName("");
    setVehicleYear("");
    setVehicleMake("");
    setVehicleModel("");
    setVehicleMileage("");
    setVIN("");
    setError("");
  }, [show]);

  return (
    <div className="Garage-modal">
      <OverlayTrigger placement="bottom" overlay={AddVehicleTooltip}>
        <Button className="addVehicle" variant="outline-primary" onClick={handleShow}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
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
          <Button variant="primary" onClick={handleSubmit}>
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