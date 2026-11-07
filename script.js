
// Get HTML Elements
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");

const cityName = document.getElementById("city-name");
const countryName = document.getElementById("country-name");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weather-condition");
const weatherIcon = document.getElementById("weather-icon");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

const weatherCard = document.getElementById("weather-card");
const errorMessage = document.getElementById("error-message");
const loadingMessage = document.getElementById("loading-message");

// Convert Weather Code into Description and Icon
function getWeatherInfo(code) {
    const weatherCodes = {
        0: ["Clear Sky", "☀️"],
        1: ["Mainly Clear", "🌤️"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Fog", "🌫️"],
        48: ["Depositing Rime Fog", "🌫️"],
        51: ["Light Drizzle", "🌦️"],
        53: ["Moderate Drizzle", "🌦️"],
        55: ["Dense Drizzle", "🌧️"],
        61: ["Slight Rain", "🌧️"],
        63: ["Moderate Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],
        71: ["Slight Snow", "🌨️"],
        73: ["Moderate Snow", "🌨️"],
        75: ["Heavy Snow", "❄️"],
        80: ["Rain Showers", "🌦️"],
        81: ["Moderate Showers", "🌧️"],
        82: ["Heavy Showers", "⛈️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with Hail", "⛈️"],
        99: ["Heavy Thunderstorm", "⛈️"]
    };

    return weatherCodes[code] || ["Unknown Weather", "🌡️"];
}

// Search City
async function getWeather(city) {
    // Reset messages
    errorMessage.textContent = "";
    loadingMessage.textContent = "Loading weather data...";
    weatherCard.classList.add("hidden");

    try {
        // Step 1: Search city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        // Check if city exists
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = geoData.results[0];

        // Step 2: Get weather information
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to retrieve weather data.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Display weather information
        const weather = getWeatherInfo(current.weather_code);

        cityName.textContent = location.name;
        countryName.textContent = location.country || "Unknown Country";

        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        weatherCondition.textContent = weather[0];
        weatherIcon.textContent = weather[1];

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        // Show weather card
        weatherCard.classList.remove("hidden");

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        loadingMessage.textContent = "";
    }
}

// Handle Search Form
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    // Check empty input
    if (city === "") {
        weatherCard.classList.add("hidden");
        errorMessage.textContent = "Please enter a city name.";
        loadingMessage.textContent = "";
        return;
    }

    // Search weather
    getWeather(city);
});

// Load default city when application starts
getWeather("Jakarta");
