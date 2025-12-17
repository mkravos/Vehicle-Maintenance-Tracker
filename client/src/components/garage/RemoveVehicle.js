import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Dropdown } from 'react-bootstrap';
import { deleteVehicle } from '../../rest/vehicle';

function RemoveVehicle({ id, removedVehicle }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async e => {
    e.preventDefault();
    deleteVehicle(id)
      .then((res) => {
        if (res.status === 200) {
          removedVehicle(true);
        } else {
          console.error('Failed to delete vehicle. Response:', res);
        }
      }).catch((err) => {
        console.error('Error deleting vehicle:', err);
      }).finally(() => {
        handleClose();
      });
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
          <Button variant="danger" onClick={handleSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default RemoveVehicle;