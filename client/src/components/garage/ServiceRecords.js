import React, { useState, useEffect } from 'react';
import EditServiceItem from './EditServiceItem';
import { Card, Button, Accordion } from 'react-bootstrap';

function ServiceRecords({vehicleId, currMiles, vehicleName, itemRecorded}) {
    const [ serviceItemId, setServiceItemId ] = useState("");
    const [ itemEdited, setItemEdited ] = useState(false);

    const editedServiceItem = boolean => {
        setItemEdited(boolean);
    };

    const getServiceItems = async (vehicle_id) => {
        try {
        const res = await fetch("http://localhost:1234/get-service-item-list/" + vehicle_id, {
            method: "GET"
        });

        const parseRes = await res.json();
        return parseRes;
        } catch (err) {
        console.error(err.message);
        }
    }

    const [ service_items, setServiceItems ] = useState();
    function getItems(id) {
        getServiceItems(id)
        .then(value => {
            setServiceItems(value);
        });
    }
    if(vehicleId && !service_items) {
        getItems(vehicleId);
    }

    const updateServiceItemTracking = id => async e => {
        e.preventDefault();
        const request = await fetch("http://localhost:1234/update-service-item-tracking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id:id})
        })
        console.log(request);
        if(vehicleId) getItems(vehicleId);
    }

    useEffect(() => {
        if(vehicleId) {
            getItems(vehicleId);
        }
    },[itemRecorded, vehicleId]);
    useEffect(() => {
        if(vehicleId) {
            setItemEdited(false);
            getItems(vehicleId);
        }
    },[itemEdited, vehicleId]);

    return (
        <Accordion className="serviceRecordsAccordion" flush>
            <Accordion.Item eventKey="0">
            <Accordion.Header>Service Records</Accordion.Header>
                <Accordion.Body className="serviceRecordsAccordionBody">
                    <div className="service-records">
                        {service_items ? service_items.map((val, key) => {
                            if(!serviceItemId) setServiceItemId(val.id);
                            let today = new Date();
                            let interval_date = new Date();
                            let days_difference = undefined;

                            if(val.interval_time) {
                                interval_date = new Date(val.interval_time);
                                // get difference (in days) between today and last service date (interval_date)
                                days_difference = Math.floor((today-interval_date)/(1000*60*60*24));
                            }
                            
                            return (
                                <Card className="col-sm-8 Card service-records-card" key={key}>
                                    <Card.Body>
                                        <div className="VSR-card-title">
                                            <Card.Title>{val.item_name}</Card.Title>
                                            <div className="VSR-card-buttons">
                                                {val.tracking===true ? 
                                                    <Button onClick={updateServiceItemTracking(val.id)} variant="outline-danger" className="Tracking-service-item-btn btn-sm">Don't Track</Button>
                                                 :
                                                    <Button onClick={updateServiceItemTracking(val.id)} variant="outline-success" className="Tracking-service-item-btn btn-sm">Track</Button>
                                                }
                                                <EditServiceItem id={val.id} vehicleName={vehicleName} serviceItem={val} editedServiceItem={editedServiceItem}/>
                                            </div>
                                        </div>
                                        <div className="Card-text">
                                            <div><span className="vehicleItem">Serviced: </span>{new Date(val.service_date).toLocaleDateString()}, at {val.mileage} miles</div>
                                            {val.interval_time && days_difference < 0 && !val.interval_miles ? <div><span className="vehicleItem">Next Service: </span>By {new Date(val.interval_time).toLocaleDateString()}</div> : null}
                                            {val.interval_time && days_difference > 0 && !val.interval_miles ? <div><span className="vehicleItem">Next Service: </span>Overdue by {days_difference} day(s)</div> : null}
                                            {!val.interval_time && val.interval_miles && val.interval_miles - currMiles > 0 ? <div><span className="vehicleItem">Next Service: </span>In {val.interval_miles - currMiles} mile(s)</div> : null}
                                            {val.interval_time && val.interval_miles && val.interval_miles - currMiles > 0 ? <div><span className="vehicleItem">Next Service: </span>In {val.interval_miles - currMiles} mile(s) or by {new Date(val.interval_time).toLocaleDateString()}</div> : null}
                                            {!val.interval_time && val.interval_miles && val.interval_miles - currMiles < 0 ? <div><span className="vehicleItem">Next Service: </span>Overdue by {(val.interval_miles - currMiles) * -1} mile(s)</div> : null}
                                            {val.interval_time && days_difference > 0 && val.interval_miles && val.interval_miles - currMiles < 0 ? <div><span className="vehicleItem">Next Service: </span>Overdue by {(val.interval_miles - currMiles) * -1} mile(s) and {days_difference} day(s)</div> : null}
                                            {val.part_number ? <div><span className="vehicleItem">Part Number: </span>{val.part_number}</div> : null}
                                            {val.cost ? <div><span className="vehicleItem">Service Cost: </span>${val.cost}</div> : null}
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        }) : null}
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default ServiceRecords;