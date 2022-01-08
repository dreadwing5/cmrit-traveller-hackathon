const socket = io.connect("http://localhost:8000");
socket.on("connect", function () {
  console.log("connected");
});
socket.on("disconnect", function () {
  console.log("disconnected");
});

document.querySelector(".book-now").addEventListener("click", function () {
  socket.emit("message", {
    message: "Book Now",
    vehicle_id: "1",
  });
});
