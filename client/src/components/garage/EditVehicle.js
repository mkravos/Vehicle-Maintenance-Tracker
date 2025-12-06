import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { containsSpecialChars, checkInteger, checkAlphanumeric } from '../utilities/InputValidation';
import { updateVehicle } from '../../rest/vehicleREST';

function EditVehicle({ editedVehicle, vehicle }) {
  const [vehicleName, setVehicleName] = useState(vehicle?.vehicle_name ?? "");
  const [vehicleYear, setVehicleYear] = useState(vehicle?.model_year ?? "");
  const [vehicleMake, setVehicleMake] = useState(vehicle?.make ?? "");
  const [vehicleModel, setVehicleModel] = useState(vehicle?.model ?? "");
  const [vehicleMileage, setVehicleMileage] = useState(vehicle?.mileage ?? "");
  const [VIN, setVIN] = useState(vehicle?.vin ?? "");
  const [errorDiv, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async e => {
    e.preventDefault();
    updateVehicle(undefined, {
      id: vehicle.id,
      vehicle_name: vehicleName,
      model_year: parseInt(vehicleYear, 10),
      make: vehicleMake,
      model: vehicleModel,
      mileage: vehicleMileage !== undefined ? parseInt(vehicleMileage, 10) : undefined,
      vin: VIN !== undefined ? VIN : undefined
    }).then((res) => {
      if (res.status === 200) {
        editedVehicle(true);
      } else {
        console.error('Failed to edit vehicle. Response:', res);
      }
    }).catch((err) => {
      console.error('Error editing vehicle:', err);
    }).finally(() => {
      handleClose();
    });
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
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EditVehicle;