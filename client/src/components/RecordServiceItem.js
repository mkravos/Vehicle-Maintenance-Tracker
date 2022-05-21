import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';

function RecordServiceItem() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>Record Service Item</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Record Service Item for (Vehicle Name)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="form-control-lg">
              <Form.Group className="mb-3" controlId="service-name-box">
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Enter part name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="service-date-box">
                <Form.Label>Date</Form.Label>
                <Form.Control placeholder="Enter date of service" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="service-mileage-box">
                <Form.Label>Mileage</Form.Label>
                <Form.Control placeholder="Enter mileage at time of service" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="mileage-interval-box">
                <Form.Label>Service Interval (Miles)</Form.Label>
                <Form.Control placeholder="Enter service interval (miles)" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="time-interval-box">
                <Form.Label>Next Service Interval (Date)</Form.Label>
                <Form.Control placeholder="Enter next service interval (date)" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="service-cost-box">
                <Form.Label>Cost</Form.Label>
                <Form.Control placeholder="Enter cost of service" />
              </Form.Group>
                <Form.Label>Attach Part Receipt:</Form.Label><br/>
                <Button variant="outline-primary">Attach</Button>
                <div id="filename" className="Modal-filename text-muted">(no file attached)</div>
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
  
  export default RecordServiceItem;