import BootstrapNavbar from './BootstrapNavbar.js';
import { Card } from 'react-bootstrap';

function Dashboard() {
    return (
      <div className="Dashboard">
        <BootstrapNavbar/>
        <header className="Dashboard-header">
          <br/>
          <p>Dashboard</p>
          <Card border='danger' key='Danger' className="col-sm-8">
            <Card.Header className='text-danger'>PAST DUE</Card.Header>
            <Card.Body>
              <Card.Title>Year, Make, Model</Card.Title>
              <Card.Text>
                <p className="Dashboard-card-text">
                  Your (service_item) needs to be serviced now. You are past due by: (mileage - interval_miles)/(date - interval_time).
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
          <br/>
          <Card border='warning' key='Warning' className="col-sm-8">
            <Card.Header className='text-warning'>COMING UP</Card.Header>
            <Card.Body>
              <Card.Title>Year, Make, Model</Card.Title>
              <Card.Text>
                <p className="Dashboard-card-text">
                  Your (service_item) needs to be serviced soon. Your next interval is: (mileage - interval_miles)/(date - interval_time).
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
          <br/>
          <Card border='success' key='Success' className="col-sm-8">
            <Card.Header className='text-success'>OK</Card.Header>
            <Card.Body>
              <Card.Title>Year, Make, Model</Card.Title>
              <Card.Text>
                <p className="Dashboard-card-text">
                  Your (service_item) does not need to be serviced yet.
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
          <br/>
        </header>
      </div>
    );
}

export default Dashboard;