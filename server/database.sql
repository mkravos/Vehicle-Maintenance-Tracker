CREATE DATABASE vehicle_maintenance_db;

CREATE TABLE user_account(
    id SERIAL PRIMARY KEY, 
    username VARCHAR(255) UNIQUE NOT NULL,
    userkey VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE vehicle(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    model_year INT NOT NULL,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    mileage INT,
    vin VARCHAR(255)
);

CREATE TABLE service_item(
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    service_date DATE NOT NULL,
    mileage INT NOT NULL,
    interval_miles INT,
    interval_time DATE,
    part_number VARCHAR(255),
    cost INT,
    receipt_image VARCHAR(255),
    tracking BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE maintenance_record(
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicle(id) NOT NULL,
    item_id INT REFERENCES service_item(id) NOT NULL
);

CREATE TABLE user_vehicle(
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES user_account(id) NOT NULL,
    vehicle_id INT REFERENCES vehicle(id) NOT NULL
);