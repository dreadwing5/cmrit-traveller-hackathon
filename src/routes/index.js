const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

router.get("/dashboard", (req, res) => {
  if (req.session.role === 0) {
    res.render("owner-dashboard");
  } else {
    res.render("commuter-dashboard");
  }
});

router.get("/commuter", (req, res) => {
  res.render("commuter-dashboard");
});

router.get("/commuter/search-rides", (req, res) => {
  res.render("map");
});

router.get("/maps", (req, res) => {
  res.render("google-maps");
});
router.get("/mybooking", (req, res) => {
  const data = {
    srclat: "12.95337133011648",
    srclng: "77.68157958984376",
    destlat: "12.9715987",
    destlng: "77.5945627",
    ownerid: "123@test1.com",
    commuterid: "123@cmrit.ac.in",
    vehicleid: "1",
    paymentStatus: "Ok",
    feedback: "Was a great , loved every bit of it",
    date: "2022-01-08",
    paymentID: "123",
  };
  res.render("mybooking", {
    data,
  });
});
module.exports = router;
