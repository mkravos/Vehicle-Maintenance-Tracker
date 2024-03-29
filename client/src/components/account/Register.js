import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import AppHeader from "../AppHeader";
import { containsSpecialChars, containsWhitespace, checkPasswordLength, checkUsernameLength } from '../utilities/InputValidation';
import ReCAPTCHA from 'react-google-recaptcha';

function Register() {
    const recaptchaRef = React.useRef();
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ verify_password, setVerifyPassword ] = useState("");
    const usernameErrorDiv = document.getElementById('usernameErrorDiv');
    const verifyPasswordErrorDiv = document.getElementById('verifyPasswordErrorDiv');
    const recaptcha_key = "6LfsHBEiAAAAAG6BBexsqvVUe1lb8dBQaNFsfplQ";

    const registerNewAccount = async e => {
      e.preventDefault();
      try {
        // client-side error checking
        if(containsWhitespace(username) && containsWhitespace(password)) {
          throw new Error("ALL_WHITESPACE");
        } else {
          verifyPasswordErrorDiv.textContent="";
          usernameErrorDiv.textContent="";
        }
        if(containsWhitespace(username)) { 
          throw new Error("UNAME_WHITESPACE");
        } else usernameErrorDiv.textContent="";
        if(containsWhitespace(password)) {
          throw new Error("PWORD_WHITESPACE");
        } else verifyPasswordErrorDiv.textContent="";
        if(containsSpecialChars(username)) { 
          throw new Error("UNAME_SPECIAL");
        } else usernameErrorDiv.textContent="";
        if(password !== verify_password) {
          throw new Error("PWORD_MISMATCH");
        } else verifyPasswordErrorDiv.textContent="";
        if(!checkPasswordLength(password)) {
          throw new Error("PASSWORD_LENGTH");
        } else verifyPasswordErrorDiv.textContent="";
        if(!checkUsernameLength(username)) {
          throw new Error("USERNAME_LENGTH");
        } else usernameErrorDiv.textContent="";

        const recaptcha_response = await recaptchaRef.current.executeAsync();
        recaptchaRef.current.reset();
        if(recaptcha_response==='') {
          verifyPasswordErrorDiv.textContent="You must solve the captcha to proceed.";
        } else {
          const register_request = await fetch("http://localhost:1234/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({username, password, recaptcha_response})}
          ).then(async res => {
            // server-side error checking
            if(res.ok) {
              const text = await res.text();
              if (text.includes("\"code\":\"23505\"")) {
                throw new Error("DUP"); // duplicate username error
              } else usernameErrorDiv.textContent="";
            }
          });
          verifyPasswordErrorDiv.textContent="Registered successfully. Please log in.";
          verifyPasswordErrorDiv.className = "Register-error text-success";
          console.log(register_request);
        }
      } catch (err) {
        if(err.message==="DUP") usernameErrorDiv.textContent="This username already exists.";
        else if(err.message==="UNAME_WHITESPACE") usernameErrorDiv.textContent="Username cannot contain a space.";
        else if(err.message==="PWORD_WHITESPACE") verifyPasswordErrorDiv.textContent="Password cannot contain a space.";
        else if(err.message==="ALL_WHITESPACE") {
          usernameErrorDiv.textContent="Username cannot contain a space.";
          verifyPasswordErrorDiv.textContent="Password cannot contain a space.";
        }
        else if(err.message==="UNAME_SPECIAL") usernameErrorDiv.textContent="Username can't contain special characters.";
        else if(err.message==="PWORD_MISMATCH") verifyPasswordErrorDiv.textContent="Passwords do not match.";
        else if(err.message==="PASSWORD_LENGTH") verifyPasswordErrorDiv.textContent="Password must be at least 10 characters long.";
        else if(err.message==="USERNAME_LENGTH") usernameErrorDiv.textContent="Username must be at least 3 characters long.";
        else console.error(err);
      }
    }

    return (
      <div className="Register">
        <header className="App-header">
          <AppHeader/>
          <p className="loginTitle">Welcome! Register an account.</p>
          <div className="registerForm">
            <Form className="form-control-lg" onSubmit={registerNewAccount}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label className="usernameLabel">Username</Form.Label>
                <Form.Control value={username} type="username" placeholder="Enter username" onChange={e => setUsername(e.target.value)} required/>
                <div id="usernameErrorDiv" className="Register-error text-danger"></div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control value={password} type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} required/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword-2">
                <Form.Control value={verify_password} type="password" placeholder="Re-enter password" onChange={e => setVerifyPassword(e.target.value)} required/>
                <div id="verifyPasswordErrorDiv" className="Register-error text-danger"></div>
              </Form.Group>
              <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={recaptcha_key}
                  size="invisible"
              />
              <center>
                <Button className="Login-btn" variant="primary" type="submit">Register</Button>
                <br/>
              </center>
            </Form>
            <a href="https://www.freepik.com/vectors/modern-texture" target="_blank" rel="noopener noreferrer" className="Background-attribution">Modern texture vector created by rawpixel.com - www.freepik.com</a>
          </div>
          <p className="registerPrompt">Already have an account? <a href="/">Log in!</a></p>
        </header>
      </div>
    );
}

export default Register;