import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';

function containsWhitespace(str) {
  return /\s/.test(str);
}
function containsSpecialChars(str) {
  return /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(str);
}

function ChangeUsername() {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");
    const [new_username, setNewUsername] = useState("");
    const [password, setPassword] = useState("");
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const usernameErrorDiv = document.getElementById('usernameErrorDiv');
    const passwordErrorDiv = document.getElementById('passwordErrorDiv');

    const handleSubmit = async e => {
      e.preventDefault();
      try {
        // client-side error checking
        if(containsWhitespace(username)) { 
          throw new Error("UNAME_WHITESPACE");
        } else usernameErrorDiv.textContent="";
        if(containsSpecialChars(username)) { 
          throw new Error("UNAME_SPECIAL");
        } else usernameErrorDiv.textContent="";

        const change_username_request = await fetch("http://localhost:1234/change-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, new_username, password})}
        ).then(async res => {
          // server-side error checking
          if(res.ok) {
            const text = await res.text();
            if (text.includes("\"code\":\"23505\"")) {
              throw new Error("DUP"); // duplicate username error
            } else usernameErrorDiv.textContent="";
            if (text.includes("PWORD_INVALID")) {
              throw new Error("PWORD_INVALID"); // invalid password error
            } else passwordErrorDiv.textContent="";
          }
        });
        console.log(change_username_request);
      } catch (err) {
        if(err.message==="DUP") usernameErrorDiv.textContent="This username already exists.";
        else if(err.message==="UNAME_WHITESPACE") usernameErrorDiv.textContent="Username cannot contain a space.";
        else if(err.message==="UNAME_SPECIAL") usernameErrorDiv.textContent="Username can't contain special characters.";
        else if(err.message==="PWORD_INVALID") passwordErrorDiv.textContent="Your password is incorrect.";
        else console.error(err);
      }

      handleClose();
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
                <Form.Label>New Username</Form.Label>
                <Form.Control placeholder="Enter new username" required/>
                <div id="usernameErrorDiv" className="Register-error text-danger"></div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="password-box">
                <Form.Label>Verify Password</Form.Label>
                <Form.Control placeholder="Enter your current password" required/>
                <div id="passwordErrorDiv" className="Register-error text-danger"></div>
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