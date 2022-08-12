import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form } from 'react-bootstrap';

function EditServiceItem({id}) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Button variant="outline-primary" className="Edit-service-item-button btn-sm" onClick={handleShow}>Edit</Button>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit (Service Item Name)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="form-control-lg">
              <Form.Group className="mb-3" controlId="service-name-box">
                <Form.Label>Name</Form.Label>
                <Form.Control className="servicenamebox" placeholder="Enter part name" />
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
              <Form.Group className="mb-3" controlId="part-number-box">
                <Form.Label>Part Number</Form.Label>
                <Form.Control placeholder="Enter part number" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="service-cost-box">
                <Form.Label>Cost</Form.Label>
                <Form.Control placeholder="Enter cost of service" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="attach-receipt-box">
                <Form.Label>Attach Part Receipt:</Form.Label>
                <div className="RSI-attach-file">
                  <Button variant="outline-primary" className="Attach-btn">Attach</Button>
                  <div id="filename" className="Modal-filename text-muted">(no file attached)</div>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Delete Record
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  
  export default EditServiceItem;