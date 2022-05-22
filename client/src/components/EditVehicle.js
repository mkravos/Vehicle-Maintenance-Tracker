import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form, Dropdown } from 'react-bootstrap';

function EditVehicle() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>Edit Vehicle</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Vehicle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="form-control-lg">
              <Form.Group className="mb-3" controlId="add-name-box">
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Enter vehicle name (nickname)" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="add-year-box">
                <Form.Label>Year</Form.Label>
                <Form.Control placeholder="Enter model year" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="add-make-box">
                <Form.Label>Make</Form.Label>
                <Form.Control placeholder="Enter make (ex: Volkswagen)" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="add-model-box">
                <Form.Label>Model</Form.Label>
                <Form.Control placeholder="Enter model (ex: Passat)" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="add-mileage-box">
                <Form.Label>Mileage</Form.Label>
                <Form.Control placeholder="Enter current mileage" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="add-vin-box">
                <Form.Label>VIN</Form.Label>
                <Form.Control placeholder="Enter Vehicle Identification Number" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
}
  
export default EditVehicle;