import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Login({setAuth}) {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const usernameErrorDiv = document.getElementById('usernameErrorDiv');
    const passwordErrorDiv = document.getElementById('passwordErrorDiv');

    const log_in = async e => {
      e.preventDefault();
      try {
        const login_request = await fetch("http://localhost:1234/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password})}
        ).then(async res => {
          // server-side error checking
          if(res.ok) {
            const text = await res.text();
            if (text.includes("UNAME_NON_EXISTING")) {
              throw new Error("UNAME_NON_EXISTING"); // invalid username error
            } else usernameErrorDiv.textContent="";
            if (text.includes("PWORD_INVALID")) {
              throw new Error("PWORD_INVALID"); // invalid password error
            } else {
              passwordErrorDiv.textContent="";
            }
          }
        });

        const parseRes = await login_request.json(); // typeerror: cannot read properties of undefined (reading 'json') at log_in
        if(parseRes.token) {
          localStorage.setItem("token", parseRes.token);
          setAuth(true);
          console.log("Authentication passed.");
        } else {
          setAuth(false);
          console.log("Authentication failed.");
        }
      } catch (err) {
        if(err.message==="UNAME_NON_EXISTING") usernameErrorDiv.textContent="Username does not exist.";
        else if(err.message==="PWORD_INVALID") passwordErrorDiv.textContent="Your password is incorrect.";
        else console.error(err);
      }
    }

    return (
      <div className="Login">
        <header className="App-header">
          <h1>Vehicle Maintenance Tracker</h1>
          <p className="loginTitle">Please log in to continue.</p>
          <div>
            <Form className="form-control-lg" onSubmit={log_in}>
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