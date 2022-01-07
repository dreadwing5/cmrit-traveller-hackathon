const express = require("express");
const app = express();
// const connection = require("./configs/DBConnection");
const path = require("path");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const publicDirectory = path.join(__dirname, "public");
const session = require("express-session");
const passport = require("passport");
require("./configs/passport")(passport);
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
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

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/vehicle"));

const onlineClients = new Set();
const users = [];

// Join user to chat
function userJoin(id) {
  const user = { id };
  users.push(user);
  console.log("user added");
  return user;
}

function onNewWebsocketConnection(socket) {
  console.info(`Socket ${socket.id} has connected.`);
  const user = userJoin(socket.id);
  socket.join("123456");
  onlineClients.add(socket.id);

  socket.on("disconnect", () => {
    onlineClients.delete(socket.id);
    console.info(`Socket ${socket.id} has disconnected.`);
  });

  socket.on("message", (msg) => {
    console.info(`Socket ${socket.id} has sent a message.`, msg);
    io.to("123456").emit("myMessage", msg);
  });
}

io.on("connection", onNewWebsocketConnection);

// Server Running at port 4000
server.listen("8000", () => {
  console.log("Server Started ... http://localhost:8000");
});
