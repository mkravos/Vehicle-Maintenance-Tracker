import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from 'react-bootstrap';
import AppHeader from "../AppHeader";
import { validateUsername, validatePassword } from '../utilities/InputValidation';
import ReCAPTCHA from 'react-google-recaptcha';
import { register } from "../../api/user";

function Register() {
  const recaptchaRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify_password, setVerifyPassword] = useState("");
  const errorDiv = document.getElementById('verifyerrorDiv');

  const handleRegister = async (e) => {
    e.preventDefault();
    validateInput();

    const recaptcha_response = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
    if (recaptcha_response === '') {
      errorDiv.textContent = "You must solve the captcha to proceed.";
    } else {
      register(username, password, recaptcha_response).then((res) => {
        console.log(res);
        if (res.status === 201) {
          errorDiv.textContent = "Registered successfully. Please log in using the login page.";
          errorDiv.className = "Register-error text-success";
        } else {
          errorDiv.textContent = "An error occurred. Please try again.";
          errorDiv.className = "Register-error text-danger";
        }
      }).catch(err => {
        console.error(err);
        errorDiv.textContent = "An error occurred. Please try again.";
        errorDiv.className = "Register-error text-danger";
      });
    }
  }

  const validateInput = () => {
    errorDiv.textContent = "";
    errorDiv.textContent = "";
    if (validateUsername(username) !== "") {
      errorDiv.textContent = validateUsername(username);
      return;
    } else if (validatePassword(password, verify_password) !== "") {
      errorDiv.textContent = validatePassword(password, verify_password);
      return;
    }
  }

  return (
    <div className="Register">
      <header className="App-header">
        <AppHeader />
        <p className="loginTitle" />
        <div className="registerForm">
          <Form className="form-control-lg" onSubmit={handleRegister}>
            <center><Form.Label className="usernameLabel" style={{ marginBottom: "25px" }}>New User</Form.Label></center>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Control value={username} type="username" placeholder="Enter username" onChange={e => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control value={password} type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword-2">
              <Form.Control value={verify_password} type="password" placeholder="Re-enter password" onChange={e => setVerifyPassword(e.target.value)} required />
              <div id="verifyerrorDiv" className="Register-error text-danger"></div>
            </Form.Group>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
              size="invisible"
            />
            <center>
              <Button className="Login-btn" variant="primary" type="submit">Register</Button>
              <br />
            </center>
          </Form>
        </div>
        <p className="registerPrompt">Already have an account? <a href="/">Log in!</a></p>
      </header>
    </div>
  );
}

export default Register;