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
  console.log(req.body);

  const sql = `SELECT * FROM vehicle_owners`;
  const data = await execQuery(sql);
  console.log(data); //TODO Pratik -- Add vehicle details to the database
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

module.exports = router;
