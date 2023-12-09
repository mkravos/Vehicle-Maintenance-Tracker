import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal, Form } from 'react-bootstrap';
import { checkInteger, checkAlphanumeric } from '../utilities/InputValidation';

function EditServiceItem({ id, vehicleName, serviceItem, editedServiceItem }) {
  const [itemName, setItemName] = useState(serviceItem.item_name);
  const [serviceDate, setServiceDate] = useState(new Date(serviceItem.service_date).toISOString().split('T')[0]);
  const [mileage, setMileage] = useState(serviceItem.mileage);
  let [partNumber, setPartNumber] = useState(serviceItem.part_number ? serviceItem.part_number : "");
  let [cost, setCost] = useState(serviceItem.cost ? serviceItem.cost : "");
  let [intervalMiles, setIntervalMiles] = useState(serviceItem.interval_miles ? serviceItem.interval_miles : "");
  let [intervalTime, setIntervalTime] = useState(serviceItem.interval_time ? new Date(serviceItem.interval_time).toISOString().split('T')[0] : "");
  let [receiptImage, setReceiptImage] = useState(serviceItem.receipt_image ? serviceItem.receipt_image : "");
  const [deleteBtnText, setDeleteBtnText] = useState("Delete Record");
  const [errorDiv, setError] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addServiceItem = async e => {
    e.preventDefault();
    try {
      // client-side error checking
      if (!itemName || !serviceDate || !mileage) {
        throw new Error("MISSING_REQ_FIELDS");
      }
      if (!checkInteger(mileage)) {
        throw new Error("INVALID_MILEAGE");
      }
      if (cost && !checkInteger(cost)) {
        throw new Error("INVALID_COST");
      }
      if (intervalMiles && !checkInteger(intervalMiles)) {
        throw new Error("INVALID_INTERVAL_MILES");
      }
      if (partNumber && !checkAlphanumeric(partNumber)) {
        throw new Error("INVALID_PART_NUMBER");
      }

      if (partNumber === '') {
        partNumber = null;
      }
      if (cost === '') {
        cost = null;
      }
      if (intervalMiles === '') {
        intervalMiles = null;
      }
      if (intervalTime === '') {
        intervalTime = null;
      }
      if (receiptImage === '') {
        receiptImage = null;
      }

      let newServiceItem = {
        id: id, item_name: itemName, service_date: serviceDate, mileage: parseInt(mileage), interval_miles: parseInt(intervalMiles), interval_time: intervalTime, part_number: partNumber,
        cost: parseInt(cost), receipt_image: receiptImage
      }
      const request = await fetch("http://localhost:1234/edit-service-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newServiceItem)
      })
      console.log(request);
      handleClose();
      editedServiceItem(true);
    } catch (err) {
      if (err.message === "MISSING_REQ_FIELDS") setError("Error: Please fill in all required fields (*).");
      if (err.message === "INVALID_MILEAGE") setError("Error: Mileage must be a number and contain no commas.");
      if (err.message === "INVALID_INTERVAL_MILES") setError("Error: Mileage service interval must be a number and contain no commas.");
      if (err.message === "INVALID_COST") setError("Error: Cost must be a number and contain no symbols or commas.");
      if (err.message === "INVALID_PART_NUMBER") setError("Error: Part number can only contain alphanumeric characters.");
      else console.log(err.message);
    }
  }

  const deleteServiceItem = async e => {
    e.preventDefault();
    if (deleteBtnText !== "Delete Record") {
      const request = await fetch("http://localhost:1234/delete-service-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
      })
      console.log(request);
      handleClose();
      editedServiceItem(true);
    } else {
      setDeleteBtnText("Confirm: Delete Record");
    }
  }

  return (
    <div className="Garage-modal">
      <Button variant="outline-primary" className="Edit-service-item-button btn-sm" onClick={handleShow}>Edit</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service Item for {vehicleName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <center><div className="modalErrorDiv">{errorDiv}</div></center>
          <Form className="form-control-lg" onSubmit={addServiceItem} id="addServiceItemForm">
            <Form.Group className="mb-3" controlId="service-name-box">
              <Form.Label>Name *</Form.Label>
              <Form.Control value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Enter part name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="service-date-box">
              <Form.Label>Date *</Form.Label>
              <Form.Control type="date" value={serviceDate} onChange={e => setServiceDate(e.target.value)} placeholder="Enter date of service" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="service-mileage-box">
              <Form.Label>Mileage *</Form.Label>
              <Form.Control type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="Enter mileage at time of service" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="part-number-box">
              <Form.Label>Part Number</Form.Label>
              <Form.Control value={partNumber} onChange={e => setPartNumber(e.target.value)} placeholder="Enter part number" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="service-cost-box">
              <Form.Label>Cost</Form.Label>
              <Form.Control type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="Enter cost of service" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="mileage-interval-box">
              <Form.Label>Service Interval</Form.Label>
              <Form.Control type="number" value={intervalMiles} onChange={e => setIntervalMiles(e.target.value)} placeholder="Enter the next service deadline (miles)" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="time-interval-box">
              <Form.Control type="date" value={intervalTime} onChange={e => setIntervalTime(e.target.value)} placeholder="Enter the next service deadline (date)" />
            </Form.Group>
            {/* <Form.Group className="mb-3 RSI-attach-file" controlId="attach-receipt-box">
              <Form.Label>Receipt Image</Form.Label>
              <Form.Control type="file" className="Attach-btn"/>
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={deleteServiceItem} variant="danger">
            {deleteBtnText}
          </Button>
          <Button form="addServiceItemForm" type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EditServiceItem;