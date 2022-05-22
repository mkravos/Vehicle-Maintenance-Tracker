import { Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Register() {
    return (
      <div className="Register">
        <header className="App-header">
          <h1>Vehicle Maintenance Tracker</h1>
          <p>Welcome! Register an account.</p>
          <div>
            <Form className="form-control-lg">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Enter username" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword-2">
                <Form.Label>Re-enter password</Form.Label>
                <Form.Control type="password" placeholder="Re-enter password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <center>
                <Link to="/dashboard"><Button variant="primary" /*type="submit"*/>Register</Button></Link>
                <br/><br/>
                <Link to="/">Already have an account? Log in!</Link>
              </center>
            </Form>
          </div>
        </header>
      </div>
    );
}

export default Register;