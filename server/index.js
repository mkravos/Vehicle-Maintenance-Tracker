const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db.js");
const jwtGenerator = require("./utils/jwtGenerator.js");
const authorize = require("./middleware/authorize.js");

// middleware
app.use(cors());
app.use(express.json()); // req.body

// ROUTES //

// verify validity of token
app.get("/verified", authorize, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
  }
});

// get user id
app.get("/uuid", authorize, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
  }
});

// get username by id
app.post("/username", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT username FROM user_account WHERE id = $1",
      [req.user.id] 
    );
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// register new account
app.post("/register", async (req, res) => {
  try {
    // destructure req.body (username, password)  
    const { username, password } = req.body;

    // bcrypt the user password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // enter new user inside database
    const registerNewAccount = await pool.query(
      "INSERT INTO user_account (username, userkey) VALUES ($1, $2) RETURNING *",
      [username, bcryptPassword]
    );

    // generate jwt token
    const token = jwtGenerator(registerNewAccount.rows[0].id);
    res.json({token});
  } catch (err) {
    if (err.message == "duplicate key value violates unique constraint \"user_account_username_key\"") {
      res.send(err);
    } else {
      console.error(err.message);
    }
  }
});

// log in to an existing account
app.post("/", async (req, res) => {
  try {
    // destructure req.body
    const { username, password } = req.body;

    // check if username exists in database
    const user = await pool.query("SELECT * FROM user_account WHERE username = $1", [username]);
    if(user.rows.length === 0) { throw new Error("UNAME_NON_EXISTING"); }

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.rows[0].userkey);
    if(!validPassword) { throw new Error("PWORD_INVALID"); }

    // generate jwt token
    const token = jwtGenerator(user.rows[0].id);
    res.json({token});
  } catch (err) {
    if(err.message==="UNAME_NON_EXISTING") { res.send(err.message); }
    else if(err.message==="PWORD_INVALID") { res.send(err.message); }
    else console.error(err);
  }
});

app.listen(1234, () => {
  console.log("Server is running on port: 1234");
});