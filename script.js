import key from "./config.js";

const weatherImage = document.querySelector("img.weather-icon");
const tempDiv = document.querySelector(".temp-mag");
const unitDiv = document.querySelector(".temp-unit");
const captionDiv = document.querySelector(".caption");
const unitBtn = document.querySelector("button.unit-btn");
const unitParameters = {
    C: "metric",
    F: "imperial"
}

let tempUnit = "C";

function getLocation() {
    navigator.geolocation.getCurrentPosition(getWeatherStatus, e => console.error(`ERROR${e.code}: ${e.message}`));
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
    getLocation();
} else {
    alert("Geolocation Not Available!");
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