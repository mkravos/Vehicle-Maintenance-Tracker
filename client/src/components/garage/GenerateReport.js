import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, DropdownButton, Button, Modal } from 'react-bootstrap';
import PickReportRecord from './PickReportRecord';

function GenerateReport() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>Generate Report</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Generate Report for (Vehicle Name)</Modal.Title>
          </Modal.Header>
          <Modal.Body className="Generate-report-body">
            <DropdownButton id="dropdown-basic-button" title="Generate PDF For">
              <PickReportRecord/>
              <Dropdown.Item>All Service History</Dropdown.Item>
            </DropdownButton>
            <div id="report-name" className="Report-name text-muted">(no report chosen)</div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Download
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  
  export default GenerateReport;