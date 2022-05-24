import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";

function containsWhitespace(str) {
  return /\s/.test(str);
}
function containsSpecialChars(str) {
  return /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(str);
}

function Register() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ verify_password, setVerifyPassword ] = useState("");
    const usernameErrorDiv = document.getElementById('usernameErrorDiv');
    const passwordErrorDiv = document.getElementById('passwordErrorDiv');
    const verifyPasswordErrorDiv = document.getElementById('verifyPasswordErrorDiv');

    const registerNewAccount = async e => {
      e.preventDefault();
      try {
        // client-side error checking
        if(containsWhitespace(username) && containsWhitespace(password)) {
          throw new Error("ALL_WHITESPACE");
        } else {
          passwordErrorDiv.textContent="";
          usernameErrorDiv.textContent="";
        }
        if(containsWhitespace(username)) { 
          throw new Error("UNAME_WHITESPACE");
        } else usernameErrorDiv.textContent="";
        if(containsWhitespace(password)) {
          throw new Error("PWORD_WHITESPACE");
        } else passwordErrorDiv.textContent="";
        if(containsSpecialChars(username)) { 
          throw new Error("UNAME_SPECIAL");
        } else usernameErrorDiv.textContent="";
        if(password !== verify_password) {
          throw new Error("PWORD_MISMATCH");
        } else verifyPasswordErrorDiv.textContent="";

        const register_request = await fetch("http://localhost:1234/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password})}
        ).then(async res => {
          // server-side error checking
          if(res.ok) {
            const text = await res.text();
            if (text.includes("\"code\":\"23505\"")) {
              throw new Error("DUP"); // duplicate username error
            } else usernameErrorDiv.textContent="";
          }
        });
        console.log(register_request);
      } catch (err) {
        if(err.message==="DUP") usernameErrorDiv.textContent="This username already exists.";
        else if(err.message==="UNAME_WHITESPACE") usernameErrorDiv.textContent="Username cannot contain a space.";
        else if(err.message==="PWORD_WHITESPACE") passwordErrorDiv.textContent="Password cannot contain a space.";
        else if(err.message==="ALL_WHITESPACE") {
          usernameErrorDiv.textContent="Username cannot contain a space.";
          passwordErrorDiv.textContent="Password cannot contain a space.";
        }
        else if(err.message==="UNAME_SPECIAL") usernameErrorDiv.textContent="Username can't contain special characters.";
        else if(err.message==="PWORD_MISMATCH") verifyPasswordErrorDiv.textContent="Passwords do not match.";
        else console.error(err);
      }
    }

    return (
      <div className="Register">
        <header className="App-header">
          <h1>Vehicle Maintenance Tracker</h1>
          <p className="loginTitle">Welcome! Register an account.</p>
          <div>
            <Form className="form-control-lg" onSubmit={registerNewAccount}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control value={username} type="username" placeholder="Enter username" onChange={e => setUsername(e.target.value)} required/>
                <div id="usernameErrorDiv" className="Register-error text-danger"></div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control value={password} type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} required/>
                <div id="passwordErrorDiv" className="Register-error text-danger"></div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword-2">
                <Form.Label>Re-enter password</Form.Label>
                <Form.Control value={verify_password} type="password" placeholder="Re-enter password" onChange={e => setVerifyPassword(e.target.value)} required/>
                <div id="verifyPasswordErrorDiv" className="Register-error text-danger"></div>
              </Form.Group>
              {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group> */}
              <center>
                <Button className="Login-btn" variant="primary" type="submit">Register</Button>
                <br/>
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