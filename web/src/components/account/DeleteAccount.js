import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Dropdown, Form } from 'react-bootstrap';

function DeleteAccount() {
    const [show, setShow] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([""]);
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

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
      try {
        // client-side error checking
        if(!password) {
          throw new Error("MISSING_REQ_FIELDS")
        } else setPasswordErrors([""]);

        // delete all service records
    
        // delete all vehicles

        // delete account
        const delete_request = await fetch("http://localhost:1234/delete-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password})}
        ).then(async res => {
          // server-side error checking
          if(res.ok) {
            const text = await res.text();
            if (text.includes("UNAME_NON_EXISTING")) {
              throw new Error("UNAME_NON_EXISTING"); // invalid username error
            } else setPasswordErrors([""]);
            if (text.includes("PWORD_INVALID")) {
              throw new Error("PWORD_INVALID"); // invalid password error
            } else setPasswordErrors([""]);
          }
          handleClose();
          log_out();
        });

        console.log(delete_request);
      } catch (err) {
        if(err.message==="PWORD_INVALID") setPasswordErrors(["Your password is incorrect."]);
        if(err.message==="MISSING_REQ_FIELDS") setPasswordErrors(["You must enter your password."]);
        else console.error(err);
      }
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
                  <Form.Control value={password} type="password" placeholder="Enter your current password*" onChange={e => setPassword(e.target.value)} required/>
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