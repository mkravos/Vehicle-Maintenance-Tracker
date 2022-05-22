import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Card } from 'react-bootstrap';

function PickReportRecord() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>One Service Record</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Generate Report for One Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="Card">
              <Card.Body>
                <div className="VSR-card-title">
                  <Card.Title>(Service Item Name)</Card.Title>
                  <div className="VSR-card-buttons">
                    <Button variant="outline-primary" className="btn-sm">Generate Report</Button>
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
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  
  export default PickReportRecord;