import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';
import { containsSpecialChars, containsWhitespace, checkUsernameLength } from '../utilities/InputValidation';

function ChangeUsername() {
    const [show, setShow] = useState(false);
    const [usernameErrors, setUsernameErrors] = useState([""]);
    const [passwordErrors, setPasswordErrors] = useState([""]);
    const [username, setUsername] = useState("");
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
        if(containsWhitespace(new_username)) { 
          throw new Error("UNAME_WHITESPACE");
        } else setUsernameErrors([""]);
        if(containsSpecialChars(new_username)) { 
          throw new Error("UNAME_SPECIAL");
        } else setUsernameErrors([""]);
        if(!password || !new_username) {
          throw new Error("MISSING_REQ_FIELDS")
        } else setPasswordErrors([""]);
        if(!checkUsernameLength(new_username)) {
          throw new Error("USERNAME_LENGTH");
        } else setUsernameErrors([""]);

        const change_username_request = await fetch("http://localhost:1234/change-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, new_username, password})}
        ).then(async res => {
          // server-side error checking
          if(res.ok) {
            const text = await res.text();
            if (text.includes("DUP")) {
              throw new Error("DUP"); // duplicate username error
            } else setUsernameErrors([""]);
            if (text.includes("PWORD_INVALID")) {
              throw new Error("PWORD_INVALID"); // invalid password error
            } else setPasswordErrors([""]);
          }
          handleClose();
        });
        console.log(change_username_request);
      } catch (err) {
        if(err.message==="DUP") setUsernameErrors(["This username already exists."]);
        else if(err.message==="UNAME_WHITESPACE") setUsernameErrors(["Username cannot contain a space."]);
        else if(err.message==="UNAME_SPECIAL") setUsernameErrors(["Username can't contain special characters."]);
        else if(err.message==="PWORD_INVALID") setPasswordErrors(["Your password is incorrect."]);
        else if(err.message==="MISSING_REQ_FIELDS") setPasswordErrors(["Please fill in all required fields (*)."]);
        else if(err.message==="USERNAME_LENGTH") setUsernameErrors(["Username must be at least 3 characters long."]);
        else console.error(err);
      }
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
                <Form.Control value={new_username} onChange={e => setNewUsername(e.target.value)} type="new_username" placeholder="Enter new username" required/>
                <div id="usernameErrorDiv" className="Register-error text-danger">
                  {usernameErrors.map((error, ind) => (
                      <div key={ind}>{error}</div>
                  ))}
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="password-box">
                <Form.Label>Verify Password*</Form.Label>
                <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter your current password" required/>
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