import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Card } from 'react-bootstrap';
import BootstrapNavbar from '../BootstrapNavbar.js';
import EditServiceItem from './EditServiceItem';

function ViewServiceRecords() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Service-records">
        <BootstrapNavbar/>
        <header className="Garage-header">
          <p className="Page-title">Service Records for (Vehicle Name)</p>
            <Card className="col-sm-8 Card">
              <Card.Body>
                <div className="VSR-card-title">
                  <Card.Title>(Service Item Name)</Card.Title>
                  <div className="VSR-card-buttons">
                    <Button variant="outline-success" className="Tracking-service-item-btn btn-sm">Tracking</Button>
                    <EditServiceItem/>
                  </div>
                </div>
                <div className="Card-text">
                  Last Serviced: (date, mileage)<br/>
                  Next Service: (date, mileage)<br/>
                  Part Number: (part_number)<br/>
                  Service Cost: (cost)<br/>
                </div>
              </Card.Body>
            </Card>
        </header>
      </div>
    )
  }
  
  export default ViewServiceRecords;