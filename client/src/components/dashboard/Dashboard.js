import React, { useState } from 'react';
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

  const updateServiceItemTracking = id => async e => {
    e.preventDefault();
    const request = await fetch("http://localhost:1234/update-service-item-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id:id})
    });
    console.log(request);
    if(userId) getServiceItemList(userId);
  }

  return (
    <div className="Dashboard">
      <BootstrapNavbar/>
      <header className="Dashboard-header">
        <p className="Page-title">Dashboard</p>
        {/* red notification */}
        { 
          service_items ?
          service_items.map((val, key) => {
            let vehicle = undefined;

            if(vehicles) {
              vehicle = vehicles.find(o => o.id === val.vehicle_id);
            } else {
              return null;
            }

            let today = new Date();
            let interval_date = new Date();
            let days_difference = undefined;

            if(val.interval_time) {
              interval_date = new Date(val.interval_time);
              // get difference (in days) between today and last service date (interval_date)
              days_difference = Math.floor((today-interval_date)/(1000*60*60*24));
            }

            if(val.tracking && val.interval_miles && days_difference && (val.interval_miles - vehicle.mileage) < 0 && days_difference > 0) {
              return(
                <Card border='danger' key={key} className="col-sm-8 Card">
                  <Card.Header className='Dashboard-card-header text-danger'>
                    <div>PAST DUE</div>
                    <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                      Don't Track This Item
                    </Button>
                  </Card.Header>
                  <Card.Body className="dashboardCardBody">
                    <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                    <Card.Text className="Dashboard-card-text">
                      {days_difference === 1 && val.interval_miles - vehicle.mileage === -1 ? <>Needs servicing now. You are past due by {(val.interval_miles - vehicle.mileage)*-1} mile and {days_difference} day.</> : null}
                      {days_difference > 1 && val.interval_miles - vehicle.mileage < -1 ? <>Needs servicing now. You are past due by {(val.interval_miles - vehicle.mileage)*-1} miles and {days_difference} days.</> : null}
                      {days_difference === 1 && val.interval_miles - vehicle.mileage < -1 ? <>Needs servicing now. You are past due by {(val.interval_miles - vehicle.mileage)*-1} miles and {days_difference} day.</> : null}
                    </Card.Text>
                    <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                  </Card.Body>
                </Card>
              );
            }
            // if interval_miles not present
            if(val.tracking && days_difference && !val.interval_miles && days_difference > 0) {
              return(
                <Card border='danger' key={key} className="col-sm-8 Card">
                  <Card.Header className='Dashboard-card-header text-danger'>
                    <div>PAST DUE</div>
                    <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                      Don't Track This Item
                    </Button>
                  </Card.Header>
                  <Card.Body className="dashboardCardBody">
                    <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                    <Card.Text className="Dashboard-card-text">
                      {days_difference === 1 ? <>Needs servicing now. You are past due by {days_difference} day.</> : null}
                      {days_difference > 1 ? <>Needs servicing now. You are past due by {days_difference} days.</> : null}
                    </Card.Text>
                    <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                  </Card.Body>
                </Card>
              );
            }
            // if days_difference not present
            if(val.tracking && val.interval_miles && !days_difference && ((val.interval_miles - vehicle.mileage) < 0)) {
              return(
                <Card border='danger' key={key} className="col-sm-8 Card">
                  {console.log("days_difference not present")}
                  <Card.Header className='Dashboard-card-header text-danger'>
                    <div>PAST DUE</div>
                    <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                      Don't Track This Item
                    </Button>
                  </Card.Header>
                  <Card.Body className="dashboardCardBody">
                    <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                    <Card.Text className="Dashboard-card-text">
                      {val.interval_miles - vehicle.mileage === -1 ? <>Needs servicing now. You are past due by {(val.interval_miles - vehicle.mileage)*-1} mile.</> : null}
                      {val.interval_miles - vehicle.mileage < -1 ? <>Needs servicing now. You are past due by {(val.interval_miles - vehicle.mileage)*-1} miles.</> : null}
                    </Card.Text>
                    <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                  </Card.Body>
                </Card>
              );
            }
            return null;
          })
          : null
        }
        {/* yellow notification */}
        {
          service_items ?
          service_items.map((val, key) => {
            let vehicle = undefined;

            if(vehicles) {
              vehicle = vehicles.find(o => o.id === val.vehicle_id);
            } else {
              return null;
            }

            let today = new Date();
            let interval_date = new Date();
            let days_difference = 0;

            if(val.interval_time) {
              interval_date = new Date(val.interval_time);
              // get difference (in days) between today and last service date (interval_date)
              days_difference = Math.floor((today-interval_date)/(1000*60*60*24));
            }

            // if interval_miles is not present
            if(val.tracking && !val.interval_miles && (days_difference < 0 && days_difference >= -14)) {
              return (
                <Card border='warning' key={key} className="col-sm-8 Card">
                  <Card.Header className='Dashboard-card-header text-warning'>
                    <div>COMING UP</div>
                    <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                      Don't Track This Item
                    </Button>
                  </Card.Header>
                  <Card.Body className="dashboardCardBody">
                    <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                    <Card.Text className="Dashboard-card-text">
                      {days_difference === 1 ? <>Needs servicing soon. Your next interval is in {days_difference*-1} day.</> : null}
                      {days_difference < 1 ? <>Needs servicing soon. Your next interval is in {days_difference*-1} days.</> : null}
                    </Card.Text>
                    <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                  </Card.Body>
                </Card>
              );
            }
            // if interval_miles is present
            if(val.tracking && val.interval_miles && ((val.interval_miles - vehicle.mileage) <= 200) && ((val.interval_miles - vehicle.mileage) > 0) && (days_difference < 0 && days_difference >= -14)) {
              return (
                <Card border='warning' key={key} className="col-sm-8 Card">
                  <Card.Header className='Dashboard-card-header text-warning'>
                    <div>COMING UP</div>
                    <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                      Don't Track This Item
                    </Button>
                  </Card.Header>
                  <Card.Body className="dashboardCardBody">
                    <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                    <Card.Text className="Dashboard-card-text">
                      {days_difference === 1 && vehicle.mileage-val.interval_miles < 1 ? <>Needs servicing soon. Your next interval is in {(vehicle.mileage-val.interval_miles)*-1} miles or {days_difference*-1} day.</> : null}
                      {days_difference === 1 && vehicle.mileage-val.interval_miles === 1 ? <>Needs servicing soon. Your next interval is in {(vehicle.mileage-val.interval_miles)*-1} mile or {days_difference*-1} day.</> : null}
                      {days_difference < 1 && vehicle.mileage-val.interval_miles === 1 ? <>Needs servicing soon. Your next interval is in {(vehicle.mileage-val.interval_miles)*-1} mile or {days_difference*-1} days.</> : null}
                    </Card.Text>
                    <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                  </Card.Body>
                </Card>
              );
            }
            // if days_difference is not present
            if(val.tracking && !days_difference && ((val.interval_miles - vehicle.mileage) <= 200) && ((val.interval_miles - vehicle.mileage) > 0)) {
              return (
                <Card border='warning' key={key} className="col-sm-8 Card">
                  <Card.Header className='Dashboard-card-header text-warning'>
                    <div>COMING UP</div>
                    <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                      Don't Track This Item
                    </Button>
                  </Card.Header>
                  <Card.Body className="dashboardCardBody">
                    <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                    <Card.Text className="Dashboard-card-text">
                      {vehicle.mileage-val.interval_miles < 1 ? <>Needs servicing soon. Your next interval is in {(vehicle.mileage-val.interval_miles)*-1} miles.</> : null}
                      {vehicle.mileage-val.interval_miles === 1 ? <>Needs servicing soon. Your next interval is in {(vehicle.mileage-val.interval_miles)*-1} mile.</> : null}
                    </Card.Text>
                    <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                  </Card.Body>
                </Card>
              );
            }
            return null;
          })
          : null
        }
        {/* green notification */}
        {
          service_items ?
          service_items.map((val, key) => {
            let vehicle = undefined;

            if(vehicles) {
              vehicle = vehicles.find(o => o.id === val.vehicle_id);
            } else {
              return null;
            }

              let today = new Date();
              let interval_date = new Date();
              let days_difference = 0;

              if(val.interval_time) {
                interval_date = new Date(val.interval_time);
                // get difference (in days) between today and last service date (interval_date)
                days_difference = Math.floor((today-interval_date)/(1000*60*60*24));
              }

              // if interval_miles is not present
              if(val.tracking && !val.interval_miles && days_difference < -14) {
                return (
                  <Card border='success' key={key} className="col-sm-8 Card">
                    <Card.Header className='Dashboard-card-header text-success'>
                      <div>OK</div>
                      <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                        Don't Track This Item
                      </Button>
                    </Card.Header>
                    <Card.Body className="dashboardCardBody">
                      <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                      <Card.Text className="Dashboard-card-text">
                        All good! You do not need to worry about this yet.
                      </Card.Text>
                      <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                    </Card.Body>
                  </Card>
                );
              }
              // if interval_miles is present
              if(val.tracking && val.interval_miles && ((val.interval_miles - vehicle.mileage) > 200) && days_difference < -14) {
                return (
                  <Card border='success' key={key} className="col-sm-8 Card">
                    <Card.Header className='Dashboard-card-header text-success'>
                      <div>OK</div>
                      <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                        Don't Track This Item
                      </Button>
                    </Card.Header>
                    <Card.Body className="dashboardCardBody">
                      <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                      <Card.Text className="Dashboard-card-text">
                        All good! You do not need to worry about this yet.
                      </Card.Text>
                      <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                    </Card.Body>
                  </Card>
                );
              }
              // if interval_time is not present
              if(val.tracking && !days_difference && ((val.interval_miles - vehicle.mileage) > 200)) {
                return (
                  <Card border='success' key={key} className="col-sm-8 Card">
                    <Card.Header className='Dashboard-card-header text-success'>
                      <div>OK</div>
                      <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                        Don't Track This Item
                      </Button>
                    </Card.Header>
                    <Card.Body className="dashboardCardBody">
                      <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                      <Card.Text className="Dashboard-card-text">
                        All good! You do not need to worry about this yet.
                      </Card.Text>
                      <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                    </Card.Body>
                  </Card>
                );
              }
              return null;
            })
          :
          null
        }
        {/* gray notification */}
        {
          service_items ?
          service_items.map((val, key) => {
            let vehicle = undefined;

            if(vehicles) {
              vehicle = vehicles.find(o => o.id === val.vehicle_id);
            } else {
              return null;
            }

            if(val.tracking && !val.interval_miles && !val.interval_time) {
              return (
                <Card border='secondary' key={key} className="col-sm-8 Card">
                  <Card.Header className='Dashboard-card-header text-secondary'>
                    <div>NO DATA</div>
                    <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="btn-sm dontTrackBtn">
                      Don't Track This Item
                    </Button>
                  </Card.Header>
                  <Card.Body className="dashboardCardBody">
                    <Card.Title>{vehicle.model_year} {vehicle.make} {vehicle.model} ({vehicle.vehicle_name}): {val.item_name}</Card.Title>
                    <Card.Text className="Dashboard-card-text">
                      Please provide the service interval information if you would like to track this item.
                    </Card.Text>
                    <div className="dashboardServicedText">Serviced: {new Date(val.service_date).toLocaleDateString()} at {val.mileage} miles.</div>
                  </Card.Body>
                </Card>
              );
            }
            return null;
          })
          : null
        }
      </header>
    </div>
  );
}

export default Dashboard;