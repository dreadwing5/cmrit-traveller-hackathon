const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    username: "test",
  });
});

// this route connect to the flask server
router.get("/get-data", (req, res) => {
  const response = await axios.get("http://127.0.0.1:5000/flask");
  const data = response.data;
  console.log(data);
});

module.exports = router;
