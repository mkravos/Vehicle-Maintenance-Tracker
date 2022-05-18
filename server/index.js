const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

const port = process.env.PORT || 1234;
app.use(cors());
app.use(express.json());
 
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});