const express = require("express");
const app = express();
const axios = require('axios');
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db.js");
const jwtGenerator = require("./utils/jwtGenerator.js");
const authorize = require("./middleware/authorize.js");
const recaptcha_secret = "6Lc45kUhAAAAAArzKgVZmnyP6ugd0ZSlYF9-GTVG";

// middleware
app.use(cors());
app.use(express.json()); // req.body

// VEHICLE ROUTES //

app.get("/get-vehicle-list/:uuid", async (req, res) => {
  try {
    // get user id from request
    const uuid = req.params.uuid;
    var results = [];

    // get all vehicles for that user
    const vehicle_query = await pool.query("SELECT vehicle_id FROM user_vehicle WHERE account_id=$1", [uuid]);

    for(var i=0; i<vehicle_query.rows.length; i++) {
      results.push((await pool.query("SELECT * FROM vehicle WHERE id=$1", [vehicle_query.rows[i].vehicle_id])).rows);
    }

    results = [].concat.apply([], results);

    res.json(results);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/get-vehicle/:id", async (req, res) => {
  try {
    // get vehicle id from request
    const id = req.params.id;

    result = await (await pool.query("SELECT * FROM vehicle WHERE id=$1", [id])).rows[0];

    res.json(result);
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/add-vehicle", async (req, res) => {
  console.log(req.body);
  try {
    // destructure req.body
    const { uuid, name, year, make, model, mileage, vin } = req.body;

    // create vehicle
    const vehicle_query = 
    await pool.query("INSERT INTO vehicle(vehicle_name, model_year, make, model, mileage, vin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", 
    [name, year, make, model, mileage, vin]);

    // get vehicle id from query result
    const vehicle = vehicle_query.rows[0].id;

    // associate vehicle with passed in user
    await pool.query("INSERT INTO user_vehicle(account_id, vehicle_id) VALUES ($1, $2)", [uuid, vehicle]);

    res.send("success");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/edit-vehicle", async (req, res) => {
  console.log(req.body);
  try {
    // destructure req.body
    const { id, name, year, make, model, mileage, vin } = req.body;

    // UPDATE table_name
    // SET column1 = value1, column2 = value2...., columnN = valueN
    // WHERE [condition];

    // update vehicle
    await pool.query("UPDATE vehicle SET vehicle_name=$1, model_year=$2, make=$3, model=$4, mileage=$5, vin=$6 WHERE id=$7", 
    [name, year, make, model, mileage, vin, id]);

    res.send("success");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/update-vehicle-mileage", async (req, res) => {
  console.log(req.body);
  try {
    // destructure req.body
    const { id, mileage } = req.body;

    // UPDATE table_name
    // SET column1 = value1, column2 = value2...., columnN = valueN
    // WHERE [condition];

    // update vehicle
    await pool.query("UPDATE vehicle SET mileage=$1 WHERE id=$2", 
    [mileage, id]);

    res.send("success");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/delete-vehicle", async (req, res) => {
  console.log(req.body);
  try {
    // destructure req.body
    const { id } = req.body;

    // delete vehicle from user account
    await pool.query("DELETE FROM user_vehicle WHERE vehicle_id=$1", 
    [id]);

    // delete vehicle
    await pool.query("DELETE FROM vehicle WHERE id=$1", 
    [id]);

    res.send("success");
  } catch (err) {
    console.error(err.message);
  }
});

// ACCOUNT ROUTES //

// verify validity of token
app.get("/verify", authorize, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
  }
});

// get user id with jwt_token
app.get("/uuid", authorize, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
  }
});

// get username with jwt_token
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
    // destructure req.body 
    const { username, password, recaptcha_response } = req.body;

    const recaptcha_request = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptcha_secret}&response=${recaptcha_response}`
    );
    let recaptcha_request_data = recaptcha_request.data || {};
    if(!recaptcha_request_data.success) { throw new Error("CAPTCHA_FAIL"); }

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
    } 
    else if (err.message == "CAPTCHA_FAIL") {
      res.send(err);
    }
    else {
      console.error(err.message);
    }
  }
});

// log in to an existing account
app.post("/", async (req, res) => {
  try {
    // destructure req.body
    const { username, password, recaptcha_response } = req.body;

    const recaptcha_request = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptcha_secret}&response=${recaptcha_response}`
    );
    let recaptcha_request_data = recaptcha_request.data || {};
    if(!recaptcha_request_data.success) { throw new Error("CAPTCHA_FAIL"); }

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

// delete an account
app.post("/delete-account", async (req, res) => {
  try {
    // destructure req.body
    const { username, password } = req.body;

    // check if username exists in database
    const user = await pool.query("SELECT * FROM user_account WHERE username = $1", [username]);
    if(user.rows.length === 0) { throw new Error("UNAME_NON_EXISTING"); }

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.rows[0].userkey);
    if(!validPassword) { throw new Error("PWORD_INVALID"); }

    // delete user's vehicles
    const vehicles = await pool.query("DELETE FROM user_vehicle WHERE account_id = $1 RETURNING vehicle_id", [user.rows[0].id]);
      if(vehicles.rows.length !== 0) {
        for(i=0; i<=user.rows.length; i++) {
          await pool.query("DELETE FROM vehicle WHERE id = $1", [vehicles.rows[i].vehicle_id]);
        }
    }

    // delete account
    await pool.query("DELETE FROM user_account WHERE username = $1", [username]);
    res.send("SUCCESS");
  } catch (err) {
    if(err.message==="UNAME_NON_EXISTING") { res.send(err.message); }
    else if(err.message==="PWORD_INVALID") { res.send(err.message); }
    else console.error(err);
  }
});

// change username
app.post("/change-username", async (req, res) => {
  try {
    // destructure req.body
    const { username, new_username, password } = req.body;

    // check if username exists in database
    const user = await pool.query("SELECT * FROM user_account WHERE username = $1", [username]);
    if(user.rows.length === 0) { throw new Error("UNAME_NON_EXISTING"); }

    // check if new username already exists
    const newUser = await pool.query("SELECT * FROM user_account WHERE username = $1", [new_username]);
    if(newUser.rows.length > 0) { throw new Error("DUP"); }

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.rows[0].userkey);
    if(!validPassword) { throw new Error("PWORD_INVALID"); }

    // change username
    await pool.query("UPDATE user_account SET username = $2 WHERE username = $1 RETURNING *", [username, new_username]);
    res.send("SUCCESS");
  } catch (err) {
    if(err.message==="UNAME_NON_EXISTING") { res.send(err.message); }
    else if(err.message==="DUP") { res.send(err.message); }
    else if(err.message==="PWORD_INVALID") { res.send(err.message); }
    else console.error(err);
  }
});

// change password
app.post("/change-password", async (req, res) => {
  try {
    // destructure req.body
    const { username, password, new_password } = req.body;

    // check if username exists in database
    const user = await pool.query("SELECT * FROM user_account WHERE username = $1", [username]);
    if(user.rows.length === 0) { throw new Error("UNAME_NON_EXISTING"); }

    // check if current password is correct
    const validPassword = await bcrypt.compare(password, user.rows[0].userkey);
    if(!validPassword) { throw new Error("PWORD_INVALID"); }

    // bcrypt the user password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(new_password, salt);

    // change password
    const changePassword = await pool.query("UPDATE user_account SET userkey = $2 WHERE username = $1 RETURNING *", [username, bcryptPassword]);

    // generate jwt token
    const token = jwtGenerator(changePassword.rows[0].id);
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