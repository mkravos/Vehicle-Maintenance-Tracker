import BootstrapNavbar from '../BootstrapNavbar.js';
import { Card, DropdownButton, Dropdown } from 'react-bootstrap';

function Account() {
  return (
    <div className="Account">
      <BootstrapNavbar/>
      <header className="Account-header">
        <p className="Page-title">Account Settings</p>
        <Card className="col-sm-8 Card">
            <Card.Body>
              <Card.Title>Account Information</Card.Title>
              <Card.Text>
                <p className="Card-text">
                  Change your username, password, or delete your account.
                </p>
              </Card.Text>
              <DropdownButton id="dropdown-basic-button" title="Actions">
                <Dropdown.Item>Change Username</Dropdown.Item>
                <Dropdown.Item>Change Password</Dropdown.Item>
                <Dropdown.Item>Delete Account</Dropdown.Item>
              </DropdownButton>
            </Card.Body>
          </Card>
      </header>
    </div>
  );
}

export default Account;