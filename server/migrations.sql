CREATE TABLE IF NOT EXISTS user_account(
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    userkey TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicle(
    id TEXT PRIMARY KEY,
    vehicle_name TEXT NOT NULL,
    model_year INTEGER NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    mileage INTEGER,
    vin TEXT
);

CREATE TABLE IF NOT EXISTS service_item(
    id TEXT PRIMARY KEY,
    vehicle_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    service_date TEXT NOT NULL,
    mileage INTEGER NOT NULL,
    interval_miles INTEGER,
    interval_time TEXT,
    part_number TEXT,
    cost INTEGER,
    receipt_image TEXT,
    tracking INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id)
);

CREATE TABLE IF NOT EXISTS user_vehicle(
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    vehicle_id TEXT NOT NULL,
    permission TEXT NOT NULL DEFAULT 'owner',  -- 'owner', 'editor', 'viewer'
    FOREIGN KEY (account_id) REFERENCES user_account(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE,
    UNIQUE(account_id, vehicle_id)
);
