import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Login() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    return (
      <div className="Login">
        <header className="App-header">
          <h1>Vehicle Maintenance Tracker</h1>
          <p className="loginTitle">Please log in to continue.</p>
          <div>
            <Form className="form-control-lg">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control value={username} type="username" placeholder="Enter username" onChange={e => setUsername(e.target.value)} required/>
                <div id="usernameErrorDiv" className="Register-error text-danger"></div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control value={password} type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} required/>
                <div id="passwordErrorDiv" className="Register-error text-danger"></div>
              </Form.Group>
              <center>
                <Button className="Login-btn" variant="primary" type="submit">Log In</Button>
                <br/>
                <Link to="/register">Don't have an account? Register!</Link>
              </center>
            </Form>
            <a href="https://www.freepik.com/vectors/modern-texture" target="_blank" rel="noopener noreferrer" className="Background-attribution">Modern texture vector created by rawpixel.com - www.freepik.com</a>
          </div>
        </header>
      </div>
    );
}

export default Login;