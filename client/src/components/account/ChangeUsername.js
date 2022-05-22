import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';

function ChangeUsername() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Account-modal">
        <Dropdown.Item onClick={handleShow}>Change Username</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Change Username</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="form-control-lg">
              <Form.Group className="mb-3" controlId="change-username-box">
                <Form.Label>New Username</Form.Label>
                <Form.Control placeholder="Enter new username" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password-box">
                <Form.Label>Verify Password</Form.Label>
                <Form.Control placeholder="Enter your current password" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  
  export default ChangeUsername;