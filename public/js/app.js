const weatherApi = "/weather";
const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const weatherIcon = document.querySelector(".weatherIcon i");
const weatherCondition = document.querySelector(".weatherCondition");
const tempElement = document.querySelector(".temperature span");
const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");

// Set the current date
const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = `${currentDate.getDate()}, ${monthName}`;

// Form submit event
weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  updateUIForLoading();
  showData(search.value);
});

// Check for geolocation
if (navigator.geolocation) {
  locationElement.textContent = "Loading...";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const city = data?.address?.city;
          if (city) {
            showData(city);
          } else {
            locationElement.textContent = "City not found in location data.";
          }
        })
        .catch(error => {
          console.error("Error fetching location data:", error);
          locationElement.textContent = "Error fetching location data.";
        });
    },
    (error) => {
      console.error("Error getting location:", error.message);
      locationElement.textContent = "Error getting location.";
    }
  );
} else {
  console.error("Geolocation is not available in this browser.");
  locationElement.textContent = "Geolocation not available.";
}

// Update UI for loading state
function updateUIForLoading() {
  locationElement.textContent = "Loading...";
  weatherIcon.className = "";
  tempElement.textContent = "";
  weatherCondition.textContent = "";
}

// Fetch and show weather data
function showData(city) {
  getWeatherData(city, (result) => {
    if (result.cod == 200) {
      const description = result.weather[0].description;
      weatherIcon.className = `wi wi-day-${description.replace(" ", "-")}`;
      locationElement.textContent = result.name;
      tempElement.textContent = `${(result.main.temp - 273.15).toFixed(2)}°C`;
      weatherCondition.textContent = description.toUpperCase();
    } else {
      locationElement.textContent = "City not found.";
    }
  });
}

// Fetch weather data from API
function getWeatherData(city, callback) {
  const locationApi = `${weatherApi}?address=${city}`;
  fetch(locationApi)
    .then(response => response.json())
    .then(response => {
      callback(response);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      locationElement.textContent = "Error fetching weather data.";
    });
}
