import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import AppHeader from "../AppHeader";
import ReCAPTCHA from 'react-google-recaptcha';

function Login({setAuth}) {
    const recaptchaRef = React.useRef();
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const usernameErrorDiv = document.getElementById('usernameErrorDiv');
    const passwordErrorDiv = document.getElementById('passwordErrorDiv');
    const recaptcha_key = "6Lc45kUhAAAAAA9n1PNvrGv7B50oWXnIJVzwG5fV";
    var parseRes;

    const log_in = async e => {
      e.preventDefault();
      try {
        const recaptcha_response = await recaptchaRef.current.executeAsync();
        recaptchaRef.current.reset();
        if(recaptcha_response==='') {
          passwordErrorDiv.textContent="You must solve the captcha to proceed.";
        } else {
          const login_request = await fetch("http://localhost:1234/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({username, password, recaptcha_response})}
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
                parseRes = JSON.parse(text);
              }
            }
          });

          console.log(login_request);
          if(parseRes.token) {
            localStorage.setItem("token", parseRes.token);
            setAuth(true);
            console.log("Authentication passed.");
          } else {
            setAuth(false);
            console.log("Authentication failed.");
          }
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
          <AppHeader/>
          <p className="loginTitle">Please log in to continue.</p>
          <div className="loginForm">
            <Form className="form-control-lg" onSubmit={log_in}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="usernameLabel">Username</Form.Label>
                <Form.Control value={username} type="username" placeholder="Enter username" onChange={e => setUsername(e.target.value)} required/>
                <div id="usernameErrorDiv" className="Register-error text-danger"></div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control value={password} type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} required/>
                <div id="passwordErrorDiv" className="Register-error text-danger"></div>
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
            <a href="https://www.freepik.com/vectors/modern-texture" target="_blank" rel="noopener noreferrer" className="Background-attribution">Modern texture vector created by rawpixel.com - www.freepik.com</a>
          </div>
          <p className="registerPrompt">Don't have an account? Register <a href="/register">here.</a></p>
        </header>
      </div>
    );
}

export default Login;