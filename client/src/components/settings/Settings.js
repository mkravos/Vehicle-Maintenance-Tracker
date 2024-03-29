import BootstrapNavbar from '../BootstrapNavbar.js';
import { Card, DropdownButton, Button } from 'react-bootstrap';
import { useState } from 'react';
import ChangeUsername from '../account/ChangeUsername.js'
import ChangePassword from '../account/ChangePassword.js';
import DeleteAccount from '../account/DeleteAccount.js';

function Settings({setAuth}) {
  const log_out = async () => {
    localStorage.removeItem("token");
    setAuth(false);
    window.location.reload();
  }

  const getUsername = async () => {
    try {
      const res = await fetch("http://localhost:1234/username", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.json();
      return parseRes;
    } catch (err) {
      console.error(err.message);
    }
  }

  const [username, setUsername] = useState();
  getUsername()
  .then(value => {
    setUsername(value.username);
  })

  return (
    <div className="Account">
      <BootstrapNavbar/>
      <header className="Account-header">
        <p className="Page-title">Application Settings</p>
        <Card className="col-sm-8 Card">
            <Card.Body>
              <Card.Title>Account information for {username}</Card.Title>
              <Card.Text className="Card-text">
                Change your username, password, or delete your account.
              </Card.Text>
              <DropdownButton id="dropdown-basic-button" title="Actions">
                <ChangeUsername/>
                <ChangePassword/>
                <DeleteAccount/>
              </DropdownButton>
            </Card.Body>
          </Card>
          <Button variant="outline-danger" className="Logout-btn" onClick={log_out}>Log Out</Button>
      </header>
    </div>
  );
}

export default Settings;