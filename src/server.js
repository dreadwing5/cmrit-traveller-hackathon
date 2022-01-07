const express = require("express");
const app = express();
// const connection = require("./configs/DBConnection");
const path = require("path");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const publicDirectory = path.join(__dirname, "public");

// Setting public directory

app.use(express.static(publicDirectory));

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  console.log("Development Build");

  const liveReloadServer = livereload.createServer();

  liveReloadServer.watch([publicDirectory + "/css", __dirname + "dist"]);

  // ping browser on Express boot, once browser has reconnected and handshaker
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}
app.use("/scripts", express.static(__dirname + "/dist"));

// Set ejs template
app.set("view engine", "ejs");

app.use(express.json());

// Routes
app.use("/", require("./routes/index"));
// app.use("/user", require("./routes/user"));

// Server Running at port 4000
app.listen("8000", () => {
  console.log("Server Started ... http://localhost:8000");
});
