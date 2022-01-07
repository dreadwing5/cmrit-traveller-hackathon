const mysql = require("mysql2");
const util = require("util");

const { CREATE_VEHICLE_OWNERS_TABLE, CREATE_COMMUTER_TABLE,CREATE_RIDE_DETAIL_TABLE,CREATE_PAYMENT_TABLE,CREATE_VEHICLE_TABLE } = require("../db/dbTable");

const { CONNECTION_CONFIG } = require("../db/config.js");

const seedDatabase = async () => {
  try {
    const connection = mysql.createConnection(CONNECTION_CONFIG);
    if (!connection) {
      throw new Error("Could not create connection");
    }
    const execQuery = util.promisify(connection.query.bind(connection));
    await createTable(execQuery);

    console.log("Created Tables Successfully! :)");
    connection.end();
  } catch (err) {
    console.error(err);
  }
};

const createTable = async function (execQuery) {
  try {
    await execQuery(CREATE_VEHICLE_OWNERS_TABLE);
    await execQuery(CREATE_COMMUTER_TABLE);
    await execQuery(CREATE_RIDE_DETAIL_TABLE);
    await execQuery(CREATE_PAYMENT_TABLE);
    await execQuery(CREATE_VEHICLE_TABLE);
  } catch (err) {
    throw err;
  }
};

seedDatabase();
