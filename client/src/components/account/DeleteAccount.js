import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Dropdown, Form } from 'react-bootstrap';
import { deleteUser } from '../../rest/user';

function DeleteAccount() {
  const [show, setShow] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([""]);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const handleClose = () => {
    setShow(false);
    setPassword("");
    setUsername("");
    setPasswordErrors([""]);
  }
  const handleShow = () => setShow(true);

  const log_out = async () => {
    localStorage.removeItem("token");
    window.location.reload();
  }

  const handleSubmit = async e => {
    e.preventDefault();
    deleteUser(username, password).then(res => {
      if (res.status === 200) {
        setPasswordErrors([""]);

        handleClose();
        log_out();
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
    <div className="Garage-modal">
      <Dropdown.Item onClick={handleShow}>Delete Account</Dropdown.Item>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Your Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="accountDeletionPrompt">
            Are you sure you would like to delete your account? This will also irreversibly remove all vehicles and maintenance records you have stored here.
          </p>
          <Form id="delete-form" className="form-control-lg" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="password-box">
              <Form.Control value={password} type="password" placeholder="Enter your current password*" onChange={e => setPassword(e.target.value)} required />
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
          <Button variant="danger" type="submit" form="delete-form">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default DeleteAccount;