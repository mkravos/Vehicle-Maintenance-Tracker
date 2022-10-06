const express = require("express");
const app = express();
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const axios = require('axios');
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db.js");
const jwtGenerator = require("./utils/jwtGenerator.js");
const authorize = require("./middleware/authorize.js");
const recaptcha_secret = process.env.RECAPTCHA_SECRET;

// middleware
app.use(cors());
app.use(express.json()); // req.body

// AWS S3 // https://medium.com/@lakshmanLD/upload-file-to-s3-using-lambda-the-pre-signed-url-way-158f074cda6c
// https://stackoverflow.com/questions/17930204/simple-file-upload-to-s3-using-aws-sdk-and-node-express

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

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

// SERVICE_ITEM ROUTES //

app.get("/get-service-item-list/:vehicle_id", async (req, res) => {
  try {
    // get vehicle id from request
    const vehicle_id = req.params.vehicle_id;
    var results = [];

    // get all vehicles for that user
    const maintenance_query = await pool.query("SELECT item_id FROM maintenance_record WHERE vehicle_id=$1", [vehicle_id]);

    for(var i=0; i<maintenance_query.rows.length; i++) {
      results.push((await pool.query("SELECT * FROM service_item WHERE id=$1", [maintenance_query.rows[i].item_id])).rows);
    }

    results = [].concat.apply([], results);

    res.json(results);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/get-service-item/:id", async (req, res) => {
  try {
    // get service_item id from request
    const id = req.params.id;

    result = await (await pool.query("SELECT * FROM service_item WHERE id=$1", [id])).rows[0];

    res.json(result);
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/add-service-item", upload.single('file'), async (req, res) => {
  console.log(req.body);
  try {
    // destructure req.body
    const { vehicle_id, item_name, service_date, mileage, interval_miles, interval_time, part_number, cost, receipt_image } = req.body;
    let s3_image_url = "";

    if(receipt_image) {
      try {
        const uploadImage=(file)=>{
          const fileStream = fs.createReadStream(file.path);

          const params = {
              Bucket: bucketName,
              Key: file.originalname,
              Body: fileStream
          };

          s3.upload(params, function (err, data) {
              console.log(data);
              if (err) {
                  throw err;
              }
              console.log(`File uploaded successfully. ${data.Location}`);
          });

          return s3.getSignedUrl('getItems', {Bucket: bucketName, Key: file.originalname})
        }
        s3_image_url = uploadImage(receipt_image);
        console.log(s3_image_url);
      } catch (err) {
        console.log(err.message);
      }
    }

    // create vehicle
    const service_item_query = 
    await pool.query("INSERT INTO service_item(item_name, service_date, mileage, interval_miles, interval_time, part_number, cost, receipt_image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id", 
    [item_name, service_date, mileage, interval_miles, interval_time, part_number, cost, s3_image_url != "" ? s3_image_url : null]);

    // get service item id from query result
    const service_item = service_item_query.rows[0].id;

    // associate service item with passed in user
    await pool.query("INSERT INTO maintenance_record(vehicle_id, item_id) VALUES ($1, $2)", [vehicle_id, service_item]);

    res.send("success");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/edit-service-item", async (req, res) => {
  console.log(req.body);
  try {
    // destructure req.body
    const { id, item_name, service_date, mileage, interval_miles, interval_time, part_number, cost, receipt_image } = req.body;

    // update service item
    await pool.query("UPDATE service_item SET item_name=$1, service_date=$2, mileage=$3, interval_miles=$4, interval_time=$5, part_number=$6, cost=$7, receipt_image=$8 WHERE id=$9", 
    [item_name, service_date, mileage, interval_miles, interval_time, part_number, cost, receipt_image, id]);

    res.send("success");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/update-service-item-tracking", async (req, res) => {
  console.log(req.body);
  try {
    // destructure req.body
    const { id } = req.body;

    // get current value of 'tracking' column
    const current_status = (await pool.query("SELECT tracking FROM service_item WHERE id=$1", [id])).rows[0].tracking;
    
    if(current_status === true) {
      // toggle to false
      await pool.query("UPDATE service_item SET tracking=false WHERE id=$1", [id]);
    } else {
      // toggle to true
      await pool.query("UPDATE service_item SET tracking=true WHERE id=$1", [id]);
    }

    res.send("success");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/delete-service-item", async (req, res) => {
  console.log(req.body);
  try {
    // destructure req.body
    const { id } = req.body;

    // delete service item from maintenance records
    await pool.query("DELETE FROM maintenance_record WHERE item_id=$1", 
    [id]);

    // delete service item
    await pool.query("DELETE FROM service_item WHERE id=$1", 
    [id]);

    res.send("success");
  } catch (err) {
    console.error(err.message);
  }
});

// FILE ROUTES //

app.post("add-receipt-image", upload.single('file'), async(req, res) => {
  const { id, receipt_image } = req.body;
  let s3_image_url = "";

  try {
    const uploadImage=(file)=>{
      const fileStream = fs.createReadStream(file.path);

      const params = {
          Bucket: bucketName,
          Key: file.originalname,
          Body: fileStream
      };

      s3.upload(params, function (err, data) {
          console.log(data);
          if (err) {
              throw err;
          }
          console.log(`File uploaded successfully. ${data.Location}`);
      });

      return s3.getSignedUrl('getItems', {Bucket: bucketName, Key: file.originalname})
    }
    s3_image_url = uploadImage(receipt_image);
    console.log(s3_image_url);

    // // update service item
    // await pool.query("UPDATE service_item SET receipt_image=$1 WHERE id=$2", 
    // [s3_image_url, id]);

    res.send("success");
  } catch (err) {
    console.log(err.message);
  }
});

// DASHBOARD ROUTES //

// gets all of a user's service items categorized by vehicle
app.get("/get-categorized-service-items/:uuid", async (req, res) => {
  try {
    // get user id from request
    const uuid = req.params.uuid;

    var results = [];

    // get all vehicles for that user
    const vehicle_query = await pool.query("SELECT vehicle_id FROM user_vehicle WHERE account_id=$1", [uuid]);
    for(var i=0; i<vehicle_query.rows.length; i++) {
      // get all service items for that vehicle
      const maintenance_query = await pool.query("SELECT item_id FROM maintenance_record WHERE vehicle_id=$1", [vehicle_query.rows[i].vehicle_id]);

      // add vehicle id to each service item object
      for(var j=0; j<maintenance_query.rows.length; j++) {
        const service_item = (await pool.query("SELECT * FROM service_item WHERE id=$1", [maintenance_query.rows[j].item_id])).rows;
        service_item[0]["vehicle_id"] = vehicle_query.rows[i].vehicle_id;
        results.push(service_item[0]);
      }
    }

    res.json(results);
  } catch (err) {
    console.log(err.message);
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