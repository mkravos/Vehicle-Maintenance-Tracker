import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';
import { containsWhitespace, checkPasswordLength } from '../utilities/InputValidation';
import { updateUser } from '../../rest/userREST';

function ChangePassword() {
  const [show, setShow] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([""]);
  const [newPasswordErrors, setNewPasswordErrors] = useState([""]);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_new_password, setConfirmNewPassword] = useState("");

  const handleClose = () => {
    setShow(false);
    setPasswordErrors([""]);
    setNewPasswordErrors([""]);
    setUsername("");
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  }
  const handleShow = () => setShow(true);

  const handleSubmit = async e => {
    e.preventDefault();
    updateUser('changePassword', username, password, new_password).then(res => {
      if (res.status === 200) {
        setPasswordErrors([""]);
        setNewPasswordErrors([""]);

        handleClose();
        window.location.reload();
      } else if (res.status === 401) {
        setPasswordErrors(["Incorrect password. Please try again."]);
      } else {
        setPasswordErrors(["An error occurred. Please try again."]);
        console.error(res);
      }
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <div className="Account-modal">
      <Dropdown.Item onClick={handleShow}>Change Password</Dropdown.Item>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-control-lg" id="changePasswordForm">
            <Form.Group className="mb-3" controlId="change-password-box">
              <Form.Label>Current Password*</Form.Label>
              <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter current password" required />
              <div id="passwordErrorDiv" className="Register-error text-danger">
                {passwordErrors.map((error, ind) => (
                  <div key={ind}>{error}</div>
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="change-password-box-1">
              <Form.Label>New Password*</Form.Label>
              <Form.Control value={new_password} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="Enter new password" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="change-password-box-2">
              <Form.Label>Re-enter New Password*</Form.Label>
              <Form.Control value={confirm_new_password} onChange={e => setConfirmNewPassword(e.target.value)} type="password" placeholder="Re-enter new password" required />
              <div id="newPasswordErrorDiv" className="Register-error text-danger">
                {newPasswordErrors.map((error, ind) => (
                  <div key={ind}>{error}</div>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="changePasswordForm" variant="primary" onClick={handleSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ChangePassword;