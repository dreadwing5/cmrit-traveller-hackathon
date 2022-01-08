const socket = io.connect("http://localhost:8000");

const renderCommuterInfo = (data) => {
  html = `
  <div class="container">
  <div class="card" style="width: 18rem;">
      <img src="https://images.unsplash.com/photo-1566008885218-90abf9200ddb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80" class="card-img-top" alt="...">
      <div class="card-body">
        <h2 class="card-title">Sedan</h2>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Price : </li>
        <li class="list-group-item">Capacity : </li>
        <li class="list-group-item">Owner Name : </li>
      </ul>
      <div class="card-body">
        <button class="accept-request btn btn-primary">Accept</button>
        <button class="reject-request btn btn-dark">Reject</button>
      </div>
    </div>
    </div>`;

  const content = document.querySelector(".my-home-content");

  content.insertAdjacentHTML("afterend", html);
  const acceptButton = document.querySelector(".accept-request");
  const rejectButton = document.querySelector(".reject-request");

  acceptButton.addEventListener("click", () => {
    console.log("accepted");
  });
  rejectButton.addEventListener("click", () => {
    console.log("rejected");
  });
};

socket.on("connect", function () {
  console.log("connected");
});
socket.on("disconnect", function () {
  console.log("disconnected");
});
socket.on("myMessage", function (data) {
  console.log("commuter-request");
  renderCommuterInfo(data);
});
