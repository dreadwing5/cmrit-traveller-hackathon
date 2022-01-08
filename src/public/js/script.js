"use strict";

// prettier-ignore

class Workout {
  date = new Date();
  id = this.date.getTime() + '';
  clicks =0;

  constructor(coords, distance, duration) {
    this.coords = coords; //[lat,lang]
    this.distance = distance; //in km
    this.duration = duration; //in min
  }

  _setDescription() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
  }

  click(){
    this.clicks++;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.pace = this.calcPace();
    this._setDescription();
  }

  calcPace() {
    //min/km
    return this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.speed = this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    //km/h
    return this.distance / (this.duration / 60);
  }
}

// const run1 = new Running([39, -12], 5.2, 25, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);

// console.log(run1, cycling1);

//Application Architecture;

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

    // location  = [lat, lng],;
    // if (type === "running") {
    //   //Check if data is valid
    //   const cadence = +inputCadence.value;

    //   if (
    //     !validInputs(distance, duration, cadence) ||
    //     !allPositive(distance, duration, cadence)
    //   ) {
    //     return alert("Inputs have to be positive number!");
    //   }
    //   workout = new Running([lat, lng], distance, duration, cadence);
    // }

    // if (type === "cycling") {
    //   const elevationGain = +inputElevation.value;
    //   if (
    //     !validInputs(distance, duration, elevationGain) ||
    //     !allPositive(distance, duration)
    //   ) {
    //     return alert("Inputs have to be positive number!");
    //   }
    //   workout = new Cycling([lat, lng], distance, duration, elevationGain);
    // }

    // this.#workouts.push(workout);

    // //   Display Marker
    // this._renderWorkoutMarker(workout);

    // //Render workout list
    // this._renderWorkout(workout);

    // //Hide form + clear input fields

    // this._hideForm();

    // //Set local storage tp all workouts
    // this._setLocalStorage();
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

    // let html = `<li class="workout workout--${workout.type}" data-id="${
    //   workout.id
    // }">
    //   <h2 class="workout__title">${workout.description}</h2>
    //   <div class="workout__details">
    //     <span class="workout__icon">${
    //       workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
    //     } </span>
    //     <span class="workout__value">${workout.distance}</span>
    //     <span class="workout__unit">km</span>
    //   </div>
    //   <div class="workout__details">
    //     <span class="workout__icon">⏱</span>
    //     <span class="workout__value">${workout.duration}</span>
    //     <span class="workout__unit">min</span>
    //   </div>`;
    // if (workout.type === "cycling") {
    //   html += `
    //   <div class="workout__details">
    //         <span class="workout__icon">⚡️</span>
    //         <span class="workout__value">${workout.speed.toFixed(1)}</span>
    //         <span class="workout__unit">km/h</span>
    //       </div>
    //       <div class="workout__details">
    //         <span class="workout__icon">⛰</span>
    //         <span class="workout__value">${workout.elevationGain}</span>
    //         <span class="workout__unit">m</span>
    //       </div> </li>`;
    // }

    form.insertAdjacentHTML("afterend", html);
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
    //using the public interface
    // workout.click();
  }

  //   _setLocalStorage() {
  //     localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  //   }

  //   _getLocalStorage() {
  //     const data = JSON.parse(localStorage.getItem("workouts"));
  //     // console.log(data);

  //     if (!data) return;

  //     this.#workouts = data;

  //     this.#workouts.forEach((workout) => {
  //       this._renderWorkout(workout);
  //     });
  //   }

  //   reset() {
  //     localStorage.removeItem("workouts");
  //     location.reload();
  //   }
}

const app = new App();
