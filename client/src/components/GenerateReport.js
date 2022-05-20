import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, DropdownButton, Button, Modal } from 'react-bootstrap';

function GenerateReport() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>Generate Report</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Generate Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DropdownButton id="dropdown-basic-button" title="Generate Report For">
              <Dropdown.Item>One Service Record</Dropdown.Item>
              <Dropdown.Item>All Service Records</Dropdown.Item>
            </DropdownButton>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Generate
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  
  export default GenerateReport;