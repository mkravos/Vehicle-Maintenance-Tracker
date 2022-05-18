import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BootstrapNavbar from './components/BootstrapNavbar.js';
import { Button, Form } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Login/>}></Route>
          <Route exact path="/dashboard" element={<Dashboard/>}></Route>
          <Route exact path="/garage" element={<Garage/>}></Route>
          <Route exact path="/report" element={<Report/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

function Login() {
  return (
    <div className="Login">
      <header className="App-header">
        <h1>Vehicle Maintenance Tracker</h1>
        <p>Please log in to continue.</p>
        <div>
          <Form className="form-control-lg" style={{width: 500}}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" placeholder="Enter username" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
            <Button href="/dashboard" variant="primary" /*type="submit"*/>Log In</Button>
          </Form>
        </div>
      </header>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="Dashboard">
      <BootstrapNavbar></BootstrapNavbar>
      <header className="App-header">
        <p>Dashboard</p>
      </header>
    </div>
  );
}

function Garage() {
  return (
    <div className="Garage">
      <BootstrapNavbar></BootstrapNavbar>
      <header className="App-header">
        <p>Garage</p>
      </header>
    </div>
  );
}

function Report() {
  return (
    <div className="Report">
      <BootstrapNavbar></BootstrapNavbar>
      <header className="App-header">
        <p>Report</p>
      </header>
    </div>
  );
}

export default App;