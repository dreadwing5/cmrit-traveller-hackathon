const express = require("express");
const connection = require("../configs/DBConnection");
const router = express.Router();
const util = require("util");

const execQuery = util.promisify(connection.query.bind(connection));

router.post("/register", async (req, res) => {
  try {
    const { mailid, password, name, role, phoneNumber, password2 } = req.body;

    const data = {
      mailid,
      password,
      name,
      role,
      phoneNumber,
    };

    if (password != password2) {
      res.status(400).send("Passwords do not match");
    }
    const sql = `INSERT INTO vehicle_owners SET ? `;
    const response = await execQuery(sql, data);
    req.session.user = mailid;
    req.session.role = role;
    res.status(200).send("Successfully registered");
  } catch (error) {
    console.log(error);
  }
});

//Login Handle
router.post("/login", async (req, res) => {
  console.log(req.body);

  try {
    const { mailid, password } = req.body;

    const value = `"${mailid}"`;
    const sql = `SELECT * FROM vehicle_owners WHERE mailid=${value}`;

    const rows = await execQuery(sql);
    if (!rows.length) {
      return res.status(400).json({
        message: "That email is not registered",
      });
    }
    let dbPassword = rows[0].password;

    if (!(dbPassword === password)) {
      return res.status(400).json({
        message: "Password incorrect",
      });
    }

    req.session.user = rows[0].mailid;
    req.session.role = rows[0].role;
    res.status(200).json({
      message: "Login Successful",
    });
  } catch (error) {
    console.log(error);
  }
});

//Logout Handle
router.get("/logout", (req, res) => {
  req.logOut();
  // req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

module.exports = router;
