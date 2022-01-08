const mysql = require("mysql2");
const util = require("util");

const CONNECTION_CONFIG = {
  host: "localhost",
  user: "root",
  // have to remove this password
  //  password: "pratik79",
  password: "",
};

const CREATE_DATABASE = `Create Database tyl_hackathon`;

const createDBConnection = async () => {
  try {
    const connection = mysql.createConnection(CONNECTION_CONFIG);
    if (!connection) {
      throw new Error("Could not create connection");
    }
    const execQuery = util.promisify(connection.query.bind(connection));

    await execQuery(CREATE_DATABASE);

    console.log("Database Created Successfully :)");
    connection.end();
  } catch (error) {
    console.error(error);
  }
};

createDBConnection();
