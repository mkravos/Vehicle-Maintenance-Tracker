import { Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Login() {
    return (
      <div className="Login">
        <header className="App-header">
          <h1>Vehicle Maintenance Tracker</h1>
          <p>Please log in to continue.</p>
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
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <center>
                  <Link to="/dashboard"><Button variant="primary" /*type="submit"*/>Log In</Button></Link>
                  <br/><br/>
                  <Link to="/register">Don't have an account? Register!</Link>
              </center>
            </Form>
          </div>
        </header>
      </div>
    );
}

export default Login;