import BootstrapNavbar from '../BootstrapNavbar.js';
import { Card, DropdownButton, Button } from 'react-bootstrap';
import ChangeUsername from '../account/ChangeUsername.js'
import ChangePassword from '../account/ChangePassword.js';
import DeleteAccount from '../account/DeleteAccount.js';

function Settings({ setAuth }) {
  const username = localStorage.getItem("username")

  return (
    <div className="Account">
      <BootstrapNavbar />
      <header className="Account-header">
        <p className="Page-title">Application Settings</p>
        <Card className="col-sm-8 Card">
          <Card.Body>
            <Card.Title>Account information for {username}</Card.Title>
            <Card.Text className="Card-text">
              Change your username, password, or delete your account.
            </Card.Text>
            <DropdownButton id="dropdown-basic-button" title="Actions">
              <ChangeUsername />
              <ChangePassword />
              <DeleteAccount />
            </DropdownButton>
          </Card.Body>
        </Card>
        <Button
          variant="outline-danger"
          className="Logout-btn"
          onClick={() => setAuth(false)}
        >
          Log Out
        </Button>
      </header>
    </div>
  );
}

export default Settings;
