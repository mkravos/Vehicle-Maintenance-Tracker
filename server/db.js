const Pool = require("pg").Pool;

const pool = new Pool({
    user: "majk",
    password: "root",
    host: "localhost",
    port: "5432",
    database: "vehicle_maintenance_db"
});

module.exports = pool;