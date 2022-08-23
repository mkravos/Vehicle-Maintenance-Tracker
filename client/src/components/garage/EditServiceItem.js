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
                <Form.Label>Name *</Form.Label>
                <Form.Control className="servicenamebox" placeholder="Enter part name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="service-date-box">
                <Form.Label>Date *</Form.Label>
                <Form.Control placeholder="Enter date of service" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="service-mileage-box">
                <Form.Label>Mileage *</Form.Label>
                <Form.Control placeholder="Enter mileage at time of service" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="part-number-box">
                <Form.Label>Part Number</Form.Label>
                <Form.Control placeholder="Enter part number" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="service-cost-box">
                <Form.Label>Cost</Form.Label>
                <Form.Control placeholder="Enter cost of service" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="mileage-interval-box">
                <Form.Label>Service Interval</Form.Label>
                <Form.Control placeholder="Enter the next service deadline (miles)" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="time-interval-box">
                <Form.Control placeholder="Enter the next service deadline (date)" />
              </Form.Group>
              <Form.Group className="mb-3 RSI-attach-file" controlId="attach-receipt-box">
                <Button variant="outline-primary" className="Attach-btn">Attach Receipt</Button>
                <div id="filename" className="Modal-filename text-muted">(no file attached)</div>
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