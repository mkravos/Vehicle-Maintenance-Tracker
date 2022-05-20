import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';

function UpdateMileage() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>Update Mileage</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Mileage</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="form-control-lg">
              <Form.Group className="mb-3" controlId="update-mileage-box">
                <Form.Label>Mileage for Year, Make, Model</Form.Label>
                <Form.Control placeholder="Enter new mileage" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  
  export default UpdateMileage;