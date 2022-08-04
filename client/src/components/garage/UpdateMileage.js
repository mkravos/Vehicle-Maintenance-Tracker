import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';
import { checkInteger } from '../utilities/InputValidation';

function UpdateMileage({id}) {
    const getVehicle = async (id) => {
      try {
        const res = await fetch("http://localhost:1234/get-vehicle/" + id, {
          method: "GET"
        });

        const parseRes = await res.json();
        return parseRes;
      } catch (err) {
        console.error(err.message);
      }
    }

    const [ vehicle, setVehicle ] = useState();
    if(!vehicle) {
      getVehicle(id)
      .then(value => {
        setVehicle(value);
      });
    }

    const [ vehicleName, setVehicleName ] = useState("");
    if(vehicle && vehicleName === "") {
      setVehicleName(vehicle.vehicle_name);
    }

    const [ vehicleMileage, setVehicleMileage ] = useState(undefined);
    if(vehicle && vehicleMileage === undefined) {
      setVehicleMileage(vehicle.mileage);
    }

    const updateVehicleMileage = async e => {
      e.preventDefault();
      try {
        // client-side error checking
        if(vehicleMileage && !checkInteger(vehicleMileage)) {
          throw new Error("INVALID_MILEAGE");
        }

        let newMileage = {}
        if(vehicleMileage) {
          newMileage = {
            id:id, mileage:vehicleMileage
          }
        } else {
          newMileage = {
            id:id, mileage:0
          }
        }
        const request = await fetch("http://localhost:1234/update-vehicle-mileage", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newMileage)
        })
        console.log(request);
        handleClose();
        window.location.reload();
      } catch (err) {
        console.log(err.message);
      }
    }

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div className="Garage-modal">
        <Dropdown.Item onClick={handleShow}>Update Mileage</Dropdown.Item>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Mileage for {vehicleName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="form-control-lg">
              <Form.Group className="mb-3" controlId="update-mileage-box">
                <Form.Label>Mileage</Form.Label>
                <Form.Control value={vehicleMileage} onChange={e => setVehicleMileage(e.target.value)} placeholder="Enter current mileage" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={updateVehicleMileage}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  
  export default UpdateMileage;