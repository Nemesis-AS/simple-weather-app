import key from "./config.js";

const weatherImage = document.querySelector("img.weather-icon");
const tempDiv = document.querySelector(".temp-mag");
const unitDiv = document.querySelector(".temp-unit");
const captionDiv = document.querySelector(".caption");
const unitBtn = document.querySelector("button.unit-btn");
const locationOverlay = document.querySelector(".location-overlay");
const openDialogBtn = document.querySelector("#openLocationDialog");
const closePopupBtn = document.querySelector("#closePopup");
const unitParameters = {
    C: "metric",
    F: "imperial"
}

let tempUnit = "C";

function showLocationPopup() {
    openDialogBtn.addEventListener("click", e => getLocation());
    closePopupBtn.addEventListener("click", e => hideLocationOverlay());
    locationOverlay.classList.remove("none");
}

function hideLocationOverlay() {
    if (!locationOverlay.classList.contains("none")) locationOverlay.classList.add("none");
}

function getLocation() {
    hideLocationOverlay();
    navigator.geolocation.getCurrentPosition(getWeatherStatus, e => {
        console.error(`ERROR${e.code}: ${e.message}`);
        captionDiv.innerText = e.message;
    });
}

async function getWeatherStatus(position) {
    let coords = position.coords;

    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}&units=${unitParameters[tempUnit]}`);
    let json = await res.json();

    let weather = json.weather[0];
    let temp = json.main.temp;
    updateElements(weather.icon, temp, weather.main);
}

function updateElements(icon, temp, title) {
    weatherImage.src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
    tempDiv.textContent = `${temp}`;
    unitDiv.textContent = `°${tempUnit}`;
    captionDiv.textContent = title;
}

if (navigator.geolocation) {
    let permState = "";
    navigator.permissions.query({ name: 'geolocation' }).then((perm) => {
        permState = perm.state;
        if(permState === "granted" || permState === "denied") {
            getLocation();
        } else {
            showLocationPopup();
        }
    });
} else {
    console.error("Geolocation Not Available!");
}

unitBtn.addEventListener("click", e => {
    if (tempUnit === "C") {
        tempUnit = "F";
        unitBtn.textContent = "°C";
    } else {
        tempUnit = "C";
        unitBtn.textContent = "°F";
    }
    getLocation();
});