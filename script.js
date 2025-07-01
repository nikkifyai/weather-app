// Weather app logic will go here 

// Replace with your actual OpenWeatherMap API key
const apiKey = 'cf26d39d802a0f4cb3c0ca0c8d74c968';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const locationBtn = document.getElementById('current-location-btn');

// Fetch weather by city name
function fetchWeatherByCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    fetchWeather(apiUrl);
}

// Fetch weather by coordinates
function fetchWeatherByCoords(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchWeather(apiUrl);
}

// Fetch weather and update DOM with error handling
function fetchWeather(apiUrl) {
    weatherResult.textContent = 'Loading...';
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please check the city name and try again.');
                } else {
                    throw new Error('Failed to fetch weather data. Please try again later.');
                }
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            weatherResult.innerHTML = `<p style="color: #d32f2f;">${error.message}</p>`;
        });
}

// Display weather data with icon
function displayWeather(data) {
    const { name, main, weather, sys } = data;
    const temperature = main.temp;
    const humidity = main.humidity;
    const condition = weather[0].main;
    const description = weather[0].description;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherResult.innerHTML = `
        <img src="${iconUrl}" alt="${description}" class="weather-icon" />
        <div class="weather-details">
            <h2>${name}, ${sys.country}</h2>
            <p><strong>${condition}</strong> - ${description}</p>
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${humidity}%</p>
        </div>
    `;
}

// Handle form submit
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        weatherResult.innerHTML = '<p style="color: #d32f2f;">Please enter a city name.</p>';
    }
});

// Handle location button with error handling
locationBtn.addEventListener('click', function() {
    if (navigator.geolocation) {
        weatherResult.textContent = 'Getting your location...';
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                let message = '';
                if (error.code === error.PERMISSION_DENIED) {
                    message = 'Location access denied. Please allow location access or search by city name.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    message = 'Location information is unavailable.';
                } else if (error.code === error.TIMEOUT) {
                    message = 'The request to get your location timed out.';
                } else {
                    message = 'An unknown error occurred while getting your location.';
                }
                weatherResult.innerHTML = `<p style="color: #d32f2f;">${message}</p>`;
            }
        );
    } else {
        weatherResult.innerHTML = '<p style="color: #d32f2f;">Geolocation is not supported by your browser.</p>';
    }
}); 