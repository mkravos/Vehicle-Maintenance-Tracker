import BootstrapNavbar from '../BootstrapNavbar.js';
import { Card, DropdownButton, Button } from 'react-bootstrap';
import ChangeUsername from './ChangeUsername.js'
import ChangePassword from './ChangePassword.js';
import DeleteAccount from './DeleteAccount.js';

function Account() {
  return (
    <div className="Account">
      <BootstrapNavbar/>
      <header className="Account-header">
        <p className="Page-title">Account Settings</p>
        <Card className="col-sm-8 Card">
            <Card.Body>
              <Card.Title>Account Information</Card.Title>
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
          <Button variant="outline-danger" className="Logout-btn">Log Out</Button>
      </header>
    </div>
  );
}

export default Account;