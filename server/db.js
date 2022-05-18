const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "root",
    host: "localhost",
    port: "5000",
    database: "vehicle_maintenance_db"
});

module.exports = pool;