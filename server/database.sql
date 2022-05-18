CREATE DATABASE Vehicle_Maintenance_DB;

CREATE TABLE UserAccount(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    userkey VARCHAR(255)
);

CREATE TABLE Vehicle(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    model_year INT NOT NULL,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    mileage INT,
    VIN VARCHAR(255)
);

CREATE TABLE ServiceItem(
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    service_data DATE NOT NULL,
    mileage INT NOT NULL,
    interval_miles INT,
    interval_time INT,
    cost INT,
    receipt_image VARCHAR(255)
);

CREATE TABLE MaintenanceRecord(
    id PRIMARY KEY REFERENCES Vehicle,
    id REFERENCES ServiceItem
);

CREATE TABLE UserVehicle(
    id PRIMARY KEY REFERENCES UserAccount,
    id REFERENCES Vehicle
);