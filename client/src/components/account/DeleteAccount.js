import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Dropdown, Form } from 'react-bootstrap';

function DeleteAccount() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>Delete Account</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Your Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="password-box">
                <Form.Label>
                  Are you sure you would like to irreversibly delete your account? This will also remove all vehicles and maintenance records you have stored here.
                </Form.Label>
                <Form.Control placeholder="Enter your current password" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
}
  
export default DeleteAccount;