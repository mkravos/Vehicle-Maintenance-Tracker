import React, { useState, useRef } from "react";
import { Button, Form } from 'react-bootstrap';
import AppHeader from "../AppHeader";
import ReCAPTCHA from 'react-google-recaptcha';
import { login } from "../../rest/userREST";

function Login({ setAuth }) {
  const recaptchaRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errorDiv = document.getElementById('errorDiv');
  const recaptcha_key = "6LfsHBEiAAAAAG6BBexsqvVUe1lb8dBQaNFsfplQ";

  const handleLogin = async (e) => {
    e.preventDefault();
    const recaptcha_response = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
    if (recaptcha_response === '') {
      errorDiv.textContent = "You must solve the captcha to proceed.";
    } else {
      login(username, password, recaptcha_response).then((res) => {
        console.log(res);
        if (res.status === 200) {
          localStorage.setItem("token", res.data);
          setAuth(true);
        } else {
          setAuth(false);
          errorDiv.textContent = "Invalid username or password.";
        }
      }).catch((err) => {
        console.log(err);
        setAuth(false);
        errorDiv.textContent = "An error occurred. Please try again.";
      });
    }
  }

  return (
    <div className="Login">
      <header className="App-header">
        <AppHeader />
        <p className="loginTitle" />
        <div className="loginForm">
          <Form className="form-control-lg" onSubmit={handleLogin}>
            <center><Form.Label className="usernameLabel" style={{ marginBottom: "25px" }}>Existing User</Form.Label></center>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control value={username} type="username" placeholder="Enter username" onChange={e => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control value={password} type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} required />
              <div id="errorDiv" className="Register-error text-danger"></div>
            </Form.Group>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptcha_key}
              size="invisible"
            />
            <center>
              <Button className="Login-btn" variant="primary" type="submit">Log In</Button>
            </center>
          </Form>
        </div>
        <p className="registerPrompt">Don't have an account? Register <a href="/register">here.</a></p>
      </header>
    </div>
  );
}

export default Login;