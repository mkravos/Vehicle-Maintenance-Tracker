import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Dropdown, Form } from 'react-bootstrap';

function DeleteAccount() {
    const [show, setShow] = useState(false);
    const [ password, setPassword ] = useState("");
    const passwordErrorDiv = document.getElementById('passwordErrorDiv');

    const get_username = () => {
      try {
        const request = fetch("http://localhost:1234/username", {
          method: "GET",
          headers: { "token": localStorage.getItem("token") }
        });
        console.log(request.username);
        return request.username;
      } catch (err) {
        console.error(err.message);
      }
    }
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const delete_account = async e => {
      e.preventDefault();
      try {
        const username = get_username();
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
            } else passwordErrorDiv.textContent="";
            if (text.includes("PWORD_INVALID")) {
              throw new Error("PWORD_INVALID"); // invalid password error
            } else {
              passwordErrorDiv.textContent="";
            }
          }
        });

        console.log(delete_request);
      } catch (err) {
        if(err.message==="PWORD_INVALID") passwordErrorDiv.textContent="Your password is incorrect.";
        else console.error(err);
      }

      handleClose();
    }
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>Delete Account</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Your Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="delete-form" className="form-control-lg" onSubmit={delete_account}>
              <Form.Group className="mb-3" controlId="password-box">
                  <Form.Label>
                    Are you sure you would like to irreversibly delete your account? This will also remove all vehicles and maintenance records you have stored here.
                  </Form.Label>
                  <Form.Control value={password} type="password" placeholder="Enter your current password" onChange={e => setPassword(e.target.value)} required/>
                  <div id="passwordErrorDiv" className="Register-error text-danger"></div>
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