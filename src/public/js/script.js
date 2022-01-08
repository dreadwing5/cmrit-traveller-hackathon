"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputSource = document.querySelector(".form__input--source");
const inputDestination = document.querySelector(".form__input--destination");
const inputDate = document.querySelector(".form__input--date");
const inputTime = document.querySelector(".form__input--time");

class App {
  //private instance

  #map;
  #zoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    //get user's position
    this._getPosition();

    //get data from local storage
    // this._getLocalStorage();

    form.addEventListener("submit", this._fetchNearestVehicle.bind(this));

    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
  }

  _getPosition() {
    // console.log(this);
    navigator?.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("Sorry, can't get location");
      }
    );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, this.#zoomLevel);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));

    this.#workouts.forEach((workout) => {
      this._renderWorkoutMarker(workout);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    const { lat, lng } = this.#mapEvent.latlng;
    console.log(lat, lng);
  }

  _hideForm() {
    //Clear input fields
    inputDestination.value =
      inputSource.value =
      inputDate.value =
      inputTime.value =
        "";

    //Hide form
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _fetchNearestVehicle(e) {
    e.preventDefault();
    const source = inputSource.value;
    const destination = inputDestination.value;
    const date = inputDate.value;
    const time = inputTime.value;

    const data = {
      source,
      destination,
      date,
      time,
    };

    console.log(data);
    const result = axios.get("/nearby-vehicles", {
      params: {
        data,
      },
    });

    // const fakeLocation = [
    const coords = [12.95337133011648, 77.68157958984376];

    this._renderWorkoutMarker(coords);
    //
    // console.log(result);
  }

  _newLocation(e) {
    e.preventDefault();
    let location;

    const distance = inputSource.value; //convert to number
    const duration = inputDestination.value;
    const { lat, lng } = this.#mapEvent.latlng;
    console.log(lat, lng);
  }

  _renderWorkoutMarker(coords) {
    L.marker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "popup",
        })
      )
      // .setPopupContent(
      //   `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      // )
      .openPopup();
    const popup = document.querySelector(".popup");
    popup.addEventListener("click", (e) => {
      this._renderWorkout();
    });
  }

  _renderWorkout() {
    let html = `<div class="card">
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
      <button class="book-now btn btn-primary">Book</button>
    </div>
  </div>`;
    form.insertAdjacentHTML("afterend", html);
    document.querySelector(".book-now").addEventListener("click", function () {
      socket.emit("message", {
        message: "Book Now",
        vehicle_id: "1",
      });
    });
  }
  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");

    if (!workoutEl) return;

    const workout = this.#workouts.find((w) => w.id === workoutEl.dataset.id);

    this.#map.setView(workout.coords, this.#map.ZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
}

const app = new App();

const socket = io.connect("http://localhost:8000");
socket.on("connect", function () {
  console.log("connected");
});
socket.on("disconnect", function () {
  console.log("disconnected");
});
