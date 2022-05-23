const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db.js");

// middleware
app.use(cors());
app.use(express.json()); // req.body

// ROUTES //

// create an account (register new)
app.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const registerNewAccount = await pool.query(
      "INSERT INTO user_account (username, userkey) VALUES ($1, $2)",
      [username, password]
    );

    res.json(registerNewAccount.rows[0]);
  } catch (err) {
    if (err.message == "duplicate key value violates unique constraint \"user_account_username_key\"") {
      res.send(err);
    } else {
      console.error(err.message);
    }
  }
});

// get an account ID (log in)
app.get("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const logIn = await pool.query(
      "SELECT id FROM user_account WHERE username=$1 AND passkey=$2",
      [username, password]
    );

    res.json(logIn.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update an account (change username)


// delete an account


app.listen(1234, () => {
  console.log("Server is running on port: 1234");
});