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
  res.render("owner-dashboard");
});

router.get("/commuter", (req, res) => {
  res.render("commuter-dashboard");
});

module.exports = router;
