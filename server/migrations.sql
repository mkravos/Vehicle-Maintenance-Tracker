CREATE TABLE user_account(
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    userkey TEXT NOT NULL
);

CREATE TABLE vehicle(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_name TEXT NOT NULL,
    model_year INTEGER NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    mileage INTEGER,
    vin TEXT
);

CREATE TABLE service_item(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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

CREATE TABLE maintenance_record(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
    FOREIGN KEY (item_id) REFERENCES service_item(id)
);

CREATE TABLE user_vehicle(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT NOT NULL,
    vehicle_id INTEGER NOT NULL,
    FOREIGN KEY (account_id) REFERENCES user_account(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id)
);