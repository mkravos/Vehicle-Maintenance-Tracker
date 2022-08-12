import React, { useState } from 'react';
import EditServiceItem from './EditServiceItem';
import { Card, Button, Accordion } from 'react-bootstrap';

function ServiceRecords({id}) {
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
    if(id && !service_items) {
        getServiceItems(id)
        .then(value => {
            setServiceItems(value);
        });
    }

    return (
        <Accordion className="serviceRecordsAccordion" flush>
            <Accordion.Item eventKey="0">
            <Accordion.Header>Service Records</Accordion.Header>
                <Accordion.Body className="serviceRecordsAccordionBody">
                    <div className="service-records">
                        {service_items ? service_items.map((val, key) => {
                            return (
                                <Card className="col-sm-8 Card service-records-card" key={key}>
                                    <Card.Body>
                                        <div className="VSR-card-title">
                                            <Card.Title>{val.item_name}</Card.Title>
                                            <div className="VSR-card-buttons">
                                                <Button variant="outline-success" className="Tracking-service-item-btn btn-sm">Tracking</Button>
                                                <EditServiceItem id={val.id}/>
                                            </div>
                                        </div>
                                        <div className="Card-text">
                                            <div><span className="vehicleItem">Serviced: </span>{val.service_date}, at {val.mileage} miles</div>
                                            {val.interval_date && !val.interval_mileage ? <div><span className="vehicleItem">Next Service: </span>By {val.interval_date}</div> : null}
                                            {!val.interval_date && val.interval_mileage ? <div><span className="vehicleItem">Next Service: </span>In {val.interval_mileage} miles</div> : null}
                                            {val.interval_date && val.interval_mileage ? <div><span className="vehicleItem">Next Service: </span>In {val.interval_mileage} miles or by {val.interval_date}</div> : null}
                                            {val.part_number ? <div><span className="vehicleItem">Part Number: </span>{val.part_number}</div> : null}
                                            <div><span className="vehicleItem">Service Cost: </span>${val.cost}</div>
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