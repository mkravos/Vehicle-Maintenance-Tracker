import BootstrapNavbar from '../BootstrapNavbar.js';
import { Card, Button } from 'react-bootstrap';

function Dashboard() {
    return (
      <div className="Dashboard">
        <BootstrapNavbar/>
        <header className="Dashboard-header">
          <p className="Page-title">Dashboard</p>
          <Card border='danger' key='Danger' className="col-sm-8 Card">
            <Card.Header className='Dashboard-card-header text-danger'>
              <div>PAST DUE</div>
              <Button variant="outline-danger" className="btn-sm">
                Don't Track This Item
              </Button>
            </Card.Header>
            <Card.Body>
              <Card.Title>Year, Make, Model</Card.Title>
              <Card.Text>
                <p className="Dashboard-card-text">
                  Your (service_item) needs to be serviced now. You are past due by: (mileage - interval_miles)/(date - interval_time).
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card border='warning' key='Warning' className="col-sm-8 Card">
            <Card.Header className='Dashboard-card-header text-warning'>
              <div>COMING UP</div>
              <Button variant="outline-danger" className="btn-sm">
                Don't Track This Item
              </Button>
            </Card.Header>
            <Card.Body>
              <Card.Title>Year, Make, Model</Card.Title>
              <Card.Text>
                <p className="Dashboard-card-text">
                  Your (service_item) needs to be serviced soon. Your next interval is: (mileage - interval_miles)/(date - interval_time).
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card border='success' key='Success' className="col-sm-8 Card">
            <Card.Header className='Dashboard-card-header text-success'>
              <div>OK</div>
              <Button variant="outline-danger" className="btn-sm">
                Don't Track This Item
              </Button>
            </Card.Header>
            <Card.Body>
              <Card.Title>Year, Make, Model</Card.Title>
              <Card.Text>
                <p className="Dashboard-card-text">
                  Your (service_item) does not need to be serviced yet.
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        </header>
      </div>
    );
}

export default Dashboard;