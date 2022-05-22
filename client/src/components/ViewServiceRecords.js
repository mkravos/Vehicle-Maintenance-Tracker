import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Card } from 'react-bootstrap';
import EditServiceItem from './EditServiceItem';

function ViewServiceRecords() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>View Service Records</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>View Service Records for (Vehicle Name)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="Card">
              <Card.Body>
                <div className="VSR-card-title">
                  <Card.Title>(Service Item Name)</Card.Title>
                  <div className="VSR-card-buttons">
                    <Button variant="outline-success" className="btn-sm">Tracking</Button>
                    <EditServiceItem/>
                  </div>
                </div>
                Last Serviced: (date, mileage)<br/>
                Next Service: (date, mileage)<br/>
                Part Number: (part_number)<br/>
                Service Cost: (cost)<br/>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  
  export default ViewServiceRecords;