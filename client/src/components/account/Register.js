import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Register() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    const registerNewAccount = async e => {
      e.preventDefault();
      try {
        const register_request = await fetch("http://localhost:1234/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password})}
        ).then(async res => {
          if(res.ok) {
            const text = await res.text();
            throw new Error(text);
          }
        });
        console.log(register_request);
      } catch (err) {
        console.error(err);
      }
    }

    return (
      <div className="Register">
        <header className="App-header">
          <h1>Vehicle Maintenance Tracker</h1>
          <p>Welcome! Register an account.</p>
          <div>
            <Form className="form-control-lg" onSubmit={registerNewAccount}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control value={username} type="username" placeholder="Enter username" onChange={e => setUsername(e.target.value)}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control value={password} type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)}/>
              </Form.Group>
              {/*<Form.Group className="mb-3" controlId="formBasicPassword-2">
                <Form.Label>Re-enter password</Form.Label>
                <Form.Control type="password" placeholder="Re-enter password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>*/}
              <center>
                <Button variant="primary" type="submit">Register</Button>
                <br/><br/>
                <Link to="/">Already have an account? Log in!</Link>
              </center>
            </Form>
            <a href="https://www.freepik.com/vectors/modern-texture" target="_blank" rel="noopener noreferrer" className="Background-attribution">Modern texture vector created by rawpixel.com - www.freepik.com</a>
          </div>
        </header>
      </div>
    );
}

export default Register;