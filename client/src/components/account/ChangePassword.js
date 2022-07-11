import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';

function containsWhitespace(str) {
  return /\s/.test(str);
}

function ChangePassword() {
    const [show, setShow] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([""]);
    const [newPasswordErrors, setNewPasswordErrors] = useState([""]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_new_password, setConfirmNewPassword] = useState("");
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getUsername = async () => {
      try {
        const res = await fetch("http://localhost:1234/username", {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
  
        const parseRes = await res.json();
        return parseRes;
      } catch (err) {
        console.error(err.message);
      }
    }
  
    const p = getUsername();
    p.then(value => {
      setUsername(value.username);
    })

    const handleSubmit = async e => {
      e.preventDefault();

      try {
        // client-side error checking
        if(containsWhitespace(new_password)) { 
          throw new Error("PWORD_WHITESPACE");
        } else setNewPasswordErrors([""]);
        if(new_password !== confirm_new_password) {
          throw new Error("PWORD_MISMATCH");
        } else setNewPasswordErrors([""]);
        if(!password || !new_password || !confirm_new_password) {
          throw new Error("MISSING_REQ_FIELDS")
        } else setNewPasswordErrors([""]);

        const change_password_request = await fetch("http://localhost:1234/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password, new_password})}
        ).then(async res => {
          // server-side error checking
          if(res.ok) {
            const text = await res.text();
            if (text.includes("PWORD_INVALID")) {
              throw new Error("PWORD_INVALID"); // invalid password error
            } else setPasswordErrors([""]);
          }
          handleClose();
          window.location.reload();
        });
        console.log(change_password_request);
      } catch (err) {
        if(err.message==="PWORD_WHITESPACE") setNewPasswordErrors(["New password cannot contain a space."]);
        else if(err.message==="MISSING_REQ_FIELDS") setNewPasswordErrors(["Please fill in all required fields (*)."]);
        else if(err.message==="PWORD_MISMATCH") setNewPasswordErrors(["Passwords do not match."]);
        else if(err.message==="PWORD_INVALID") setPasswordErrors(["Your current password is incorrect."]);
        else console.error(err);
      }
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
                <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter current password" required/>
                <div id="passwordErrorDiv" className="Register-error text-danger">
                  {passwordErrors.map((error, ind) => (
                      <div key={ind}>{error}</div>
                  ))}
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="change-password-box-1">
                <Form.Label>New Password*</Form.Label>
                <Form.Control value={new_password} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="Enter new password" required/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="change-password-box-2">
                <Form.Label>Re-enter New Password*</Form.Label>
                <Form.Control value={confirm_new_password} onChange={e => setConfirmNewPassword(e.target.value)} type="password" placeholder="Re-enter new password" required/>
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