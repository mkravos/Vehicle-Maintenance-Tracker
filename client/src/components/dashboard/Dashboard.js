import React, { useState, useEffect } from 'react';
import BootstrapNavbar from '../BootstrapNavbar.js';
import { Card, Button } from 'react-bootstrap';

function Dashboard() {
  const getUserId = async () => {
    try {
      const res = await fetch("http://localhost:1234/uuid", {
        method: "GET",
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.json();
      return parseRes;
    } catch (err) {
      console.error(err.message);
    }
  }
  const [ userId, setUserId ] = useState();
  if(!userId) {
    getUserId()
    .then(value => {
      setUserId(value.id);
    });
  }

  const getVehicles = async (uuid) => {
    try {
      const res = await fetch("http://localhost:1234/get-vehicle-list/" + uuid, {
        method: "GET"
      });

      const parseRes = await res.json();
      return parseRes;
    } catch (err) {
      console.error(err.message);
    }
  }
  const [ vehicles, setVehicles ] = useState();
  function getVehicleList(id) {
    getVehicles(id)
    .then(value => {
      setVehicles(value);
    });
  }
  if(userId && !vehicles) {
    getVehicleList(userId);
  }

  const getCategorizedServiceItems = async (uuid) => {
    try {
      const res = await fetch("http://localhost:1234/get-categorized-service-items/" + uuid, {
        method: "GET"
      });

      const parseRes = await res.json();
      return parseRes;
    } catch (err) {
      console.error(err.message);
    }
  }
  const [ service_items, setServiceItems ] = useState();
  function getServiceItemList(id) {
    getCategorizedServiceItems(id)
    .then(value => {
      setServiceItems(value);
    });
  }
  if(userId && !vehicles) {
    getServiceItemList(userId);
  }

  if(service_items) {
    console.log(service_items);
  }

  return (
    <div className="Dashboard">
      <BootstrapNavbar/>
      <header className="Dashboard-header">
        <p className="Page-title">Dashboard</p>
        {/* red notification */}
        <Card border='danger' key='Danger' className="col-sm-8 Card">
          <Card.Header className='Dashboard-card-header text-danger'>
            <div>PAST DUE</div>
            <Button variant="outline-danger" className="btn-sm dontTrackBtn">
              Don't Track This Item
            </Button>
          </Card.Header>
          <Card.Body className="dashboardCardBody">
            <Card.Title>Year, Make, Model: Item Name</Card.Title>
            <Card.Text className="Dashboard-card-text">
              Needs servicing now. You are past due by: (mileage - interval_miles)/(date - interval_time).
            </Card.Text>
          </Card.Body>
        </Card>
        {/* yellow notification */}
        <Card border='warning' key='Warning' className="col-sm-8 Card">
          <Card.Header className='Dashboard-card-header text-warning'>
            <div>COMING UP</div>
            <Button variant="outline-danger" className="btn-sm dontTrackBtn">
              Don't Track This Item
            </Button>
          </Card.Header>
          <Card.Body className="dashboardCardBody">
            <Card.Title>Year, Make, Model: Item Name</Card.Title>
            <Card.Text className="Dashboard-card-text">
              Needs servicing soon. Your next interval is: (mileage - interval_miles)/(date - interval_time).
            </Card.Text>
          </Card.Body>
        </Card>
        {/* green notification */}
        <Card border='success' key='Success' className="col-sm-8 Card">
          <Card.Header className='Dashboard-card-header text-success'>
            <div>OK</div>
            <Button variant="outline-danger" className="btn-sm dontTrackBtn">
              Don't Track This Item
            </Button>
          </Card.Header>
          <Card.Body className="dashboardCardBody">
            <Card.Title>Year, Make, Model: Item Name</Card.Title>
            <Card.Text className="Dashboard-card-text">
              All good! You do not need to worry about this yet.
            </Card.Text>
          </Card.Body>
        </Card>
        {/* gray notification */}
        <Card border='secondary' key='Secondary' className="col-sm-8 Card">
          <Card.Header className='Dashboard-card-header text-secondary'>
            <div>NO DATA</div>
            <Button variant="outline-danger" className="btn-sm dontTrackBtn">
              Don't Track This Item
            </Button>
          </Card.Header>
          <Card.Body className="dashboardCardBody">
            <Card.Title>Year, Make, Model: Item Name</Card.Title>
            <Card.Text className="Dashboard-card-text">
              Please provide the service interval information if you would like to track this item.
            </Card.Text>
          </Card.Body>
        </Card>
      </header>
    </div>
  );
}

export default Dashboard;