const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const util = require("util");
const { CONNECTION_CONFIG } = require("../db/config.js");

const connection = mysql.createConnection(CONNECTION_CONFIG);
if (!connection) {
  throw new Error("Could not create connection");
}
const execQuery = util.promisify(connection.query.bind(connection));

router.post("/vehicle", async (req, res) => {
  try{
  const{ plateNumber, mailid, images, capacity, cost, time, vechicleType, brand, name, location } = req.body;
  // currentDate = new Date(); const timestamp = currentDate. getTime(); 
  const data = { 
    plateNumber, 
    mailid, 
    images, 
    capacity, 
    cost,   
    time,  
    vechicleType, 
    brand, 
    name, 
    location,
  };

  const sql = `INSERT INTO  vehicle SET ? `;
  const response = await execQuery(sql, data);
  res.status(200).send("Successfully registered");

  console.log(data);
} catch (e) {console.log(e);}//TODO Pratik -- Add vehicle details to the database
});


// Route for getting  vehicle data

router.get("/vehicle", async (req, res) => {
  const sql = `SELECT from vehicle where vehicle_id=${req.session.user}`;
  const result = await execQuery(sql); //TODO  --Display frontend
  console.log(data);
});

router.get("/nearby-vehicles", async (req, res) => {
  const sql = `SELECT * FROM vehicle`;
  const result = await execQuery(sql);

  console.log(result);
  res.send(result);
});

router.post("/confirm-booking", async (req, res) => {

//create rider details
try{
const{commuterid, ownerid, vehicleid, status, feedback, startDest, endDest, paymentID } = req.body;
const data1 = {
  commuterid, 
  ownerid, 
  vehicleid, 
  status, 
  feedback, 
  startDest, 
  endDest, 
  paymentID,
};

const sql = `INSERT INTO ride_detail SET ? `;
const response = await execQuery(sql, data1);
res.status(200).send("New Rider Created");
} catch (e) {console.log(e);}
});

router.get("/reject-booking", async (req, res) => {
const sql = `DELETE FROM ride_detail WHERE data =?`
// delete rider details
const result = await execQuery(sql);
console.log(result);
  res.send(result);
});

router.get("/confirm-payment", async (req, res) => {
  // update rider details confirm payment
const sql = `SELECT * FROM rider_detail`;
const result = await execQuery(sql);
console.log(result);
res.send(result);

});

module.exports = router;
