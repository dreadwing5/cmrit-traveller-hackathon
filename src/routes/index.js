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

module.exports = router;
