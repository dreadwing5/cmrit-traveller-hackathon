const express = require("express");
const connection = require("../configs/DBConnection");
const router = express.Router();
const passport = require("passport");

router.post("/register", (req, res) => {
  console.log(req.body);

  // let {
  //   id,
  //   name,
  //   mailid,
  //   password,
  //   password2,
  //   joiningDate,
  //   department,
  //   phoneNumber,
  // } = req.body;

  // if (!joiningDate) {
  //   joiningDate = null;
  // }
  // if (!department) {
  //   department = null;
  // }
  // if (!phoneNumber) {
  //   phoneNumber = null;
  // }
  // // validate required fields
  // let errors = [];
  // //validating email id
  // //Check Required Fields
  // if (!name || !mailid || !password || !password2 || !id) {
  //   errors.push({
  //     msg: "Please fill in all fields",
  //   });
  // }
  // //Check Passwords match
  // if (password !== password2) {
  //   errors.push({
  //     msg: "Passwords do not match",
  //   });
  // }
  // connection.query(
  //   "SELECT mailid FROM faculty WHERE mailid = ?",
  //   [mailid],
  //   (error, data) => {
  //     if (error) {
  //       console.log("Email id coud not be found");
  //     }
  //     if (data.length > 0) {
  //       errors.push({
  //         msg: "Email already exist",
  //       });
  //     }
  //     if (errors.length > 0) {
  //       res.render("admin/admin_addUser", {
  //         errors: errors,
  //         title: "Add User",
  //       });
  //     } else {
  //       connection.query(
  //         "INSERT INTO faculty SET ? ",
  //         {
  //           name: name,
  //           mailid: mailid,
  //           password: password,
  //           id: id,
  //           role: "user",
  //           joiningDate: joiningDate,
  //           phoneNumber: phoneNumber,
  //           department: department,
  //         },
  //         (data) => {
  //           {
  //             res.render("admin/admin_addUser", {
  //               success_msg: "User registered successfully",
  //               title: "Add User",
  //             });
  //           }
  //         }
  //       );
  //     }
  //   }
  // );
});

//Login Handle
router.post("/login", (req, res) => {
  console.log(req.body);

  const { mailid, password } = req.body;

  const value = `"${mailid}"`;
  const sql = `SELECT * FROM vehicle_owners WHERE mailid=${value}`;
  connection.query(sql, (err, rows) => {
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

    req.session.user = mailid;

    res.status(200).json({
      message: "Login Successful",
    });
  });
});

//Logout Handle
router.get("/logout", (req, res) => {
  req.logOut();
  // req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

module.exports = router;
