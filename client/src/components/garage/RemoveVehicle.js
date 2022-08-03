import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Dropdown } from 'react-bootstrap';

function RemoveVehicle({id}) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const deleteVehicle = async e => {
      e.preventDefault();
      try {
        const request = await fetch("http://localhost:1234/delete-vehicle", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({id:id})
        })
        console.log(request);
        handleClose();
        window.location.reload();
      } catch (err) {
        console.log(err.message);
      }
    }
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>Remove Vehicle</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Remove (Vehicle Name)</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you would like to remove this vehicle? This will irreversibly delete the vehicle and all service records associated with it.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteVehicle}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
}
  
export default RemoveVehicle;