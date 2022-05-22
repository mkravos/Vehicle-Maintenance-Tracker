import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';

function ChangePassword() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Account-modal">
        <Dropdown.Item onClick={handleShow}>Change Password</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="form-control-lg">
              <Form.Group className="mb-3" controlId="change-password-box">
                <Form.Label>Current Password</Form.Label>
                <Form.Control placeholder="Enter current password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="change-password-box-1">
                <Form.Label>New Password</Form.Label>
                <Form.Control placeholder="Enter new password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="change-password-box-2">
                <Form.Label>Re-enter New Password</Form.Label>
                <Form.Control placeholder="Re-enter new password" />
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
  
  export default ChangePassword;