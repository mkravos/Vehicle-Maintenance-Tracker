import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';
import { containsSpecialChars, containsWhitespace, checkUsernameLength } from '../utilities/InputValidation';
import { updateUser } from '../../api/user';

function ChangeUsername() {
  const [show, setShow] = useState(false);
  const [usernameErrors, setUsernameErrors] = useState([""]);
  const [passwordErrors, setPasswordErrors] = useState([""]);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [new_username, setNewUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => {
    setShow(false);
    setUsernameErrors([""]);
    setPasswordErrors([""]);
    setUsername("");
    setNewUsername("");
    setPassword("");
  }
  const handleShow = () => setShow(true);

  const handleSubmit = async e => {
    e.preventDefault();
    updateUser('changeUsername', username, password, new_username).then(res => {
      if (res.status === 200) {
        setUsernameErrors([""]);
        setPasswordErrors([""]);

        handleClose();
        localStorage.setItem("username", new_username);
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
      <Dropdown.Item onClick={handleShow}>Change Username</Dropdown.Item>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-control-lg" id="changeUsernameForm">
            <Form.Group className="mb-3" controlId="change-username-box">
              <Form.Label>New Username*</Form.Label>
              <Form.Control value={new_username} onChange={e => setNewUsername(e.target.value)} type="new_username" placeholder="Enter new username" required />
              <div id="usernameErrorDiv" className="Register-error text-danger">
                {usernameErrors.map((error, ind) => (
                  <div key={ind}>{error}</div>
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password-box">
              <Form.Label>Verify Password*</Form.Label>
              <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter your current password" required />
              <div id="passwordErrorDiv" className="Register-error text-danger">
                {passwordErrors.map((error, ind) => (
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
          <Button type="submit" form="changeUsernameForm" variant="primary" onClick={handleSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ChangeUsername;
