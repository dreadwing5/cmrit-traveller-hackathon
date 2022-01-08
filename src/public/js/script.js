"use strict";

const socket = io.connect("http://localhost:8000");

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

  async _fetchNearestVehicle(e) {
    e.preventDefault();
    const source = inputSource.value;
    const destination = inputDestination.value;
    const date = inputDate.value;
    const time = inputTime.value;

    const results = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: source,
          key: "AIzaSyAe93wOhrsEIVyL1IWC3LNoS0tgRVeJ2GQ",
        },
      }
    );
    const sourceCoords = results.data.results[0].geometry.location;

    const result2 = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: destination,
          key: "AIzaSyAe93wOhrsEIVyL1IWC3LNoS0tgRVeJ2GQ",
        },
      }
    );
    const destinationCoords = result2.data.results[0].geometry.location;

    const data = {
      source: sourceCoords,
      destination: destinationCoords,
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

    const coord = [12.95337133011648, 77.68157958984376];
    const coord1 = [12.9715987, 77.5945627];
    const coord2 = [12.97727, 77.5945627];

    this._renderWorkoutMarker(coord);
    // this._renderWorkoutMarker(coord1);
    // this._renderWorkoutMarker(coord2);

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

    popup.addEventListener("click", (e) => this._renderWorkout());

    // popup.forEach((pop) => {
    //   pop.addEventListener("click", (e) => this._renderWorkout());
    // });
  }

  _renderWorkout() {
    let html = `<div class="card">
    <img src="https://images.unsplash.com/photo-1566008885218-90abf9200ddb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80" class="card-img-top" alt="...">
    <div class="card-body">
      <h2 class="card-title">Honda<h2>
      <p class="card-text">Test data </p>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">PlateNumber : H1-26-54-32</li>
      <li class="list-group-item">Type : Car</li>
      <li class="list-group-item">Capacity :4</li>
      <li class="list-group-item">Owner Email : 123@test1.com </li>
      <li class="list-group-item">Cost : Rs. 1350 / KM</li>


    </ul>
    <div class="card-body">
      <button class="book-now btn btn-primary">Book</button>
    </div>
  </div>`;
    form.insertAdjacentHTML("afterend", html);
    document.querySelector(".book-now").addEventListener("click", function () {
      socket.emit("message", {
        message: "Book Now",
        vehicle_id: "H1-26-54-32",
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

socket.on("connect", function () {
  console.log("connected");
});
socket.on("disconnect", function () {
  console.log("disconnected");
});

const app = new App();
