CREATE TABLE IF NOT EXISTS user_account(
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    userkey TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicle(
    id SERIAL PRIMARY KEY,
    vehicle_name TEXT NOT NULL,
    model_year INTEGER NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    mileage INTEGER,
    vin TEXT
);

CREATE TABLE IF NOT EXISTS service_item(
    id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL,
    service_date TEXT NOT NULL,
    mileage INTEGER NOT NULL,
    interval_miles INTEGER,
    interval_time TEXT,
    part_number TEXT,
    cost INTEGER,
    receipt_image TEXT,
    tracking INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS maintenance_record(
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
    FOREIGN KEY (item_id) REFERENCES service_item(id)
);

CREATE TABLE IF NOT EXISTS user_vehicle(
    id SERIAL PRIMARY KEY,
    account_id TEXT NOT NULL,
    vehicle_id INTEGER NOT NULL,
    FOREIGN KEY (account_id) REFERENCES user_account(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id)
);