const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const forecast_container = document.getElementById('forecast-box');


let debounceTimer;

function handleSearchInput() {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const searchTerm = searchInput.value;

    // Make the API request with the debounced search term
    fetch(`/search?q=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        // Display the search results
        displaySearchResults(data);
      })
      .catch(error => {
        console.log('Error fetching search results:', error);
      });
  }, 500); // Adjust the debounce time as needed (in milliseconds)
}

function displaySearchResults(results) {
  // Clear previous results
  searchResults.innerHTML = '';

  // Display the search results
  if (Array.isArray(results)) {
    results.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result');
      resultItem.textContent = `${result.city}, ${result.countryCode}`;
      searchResults.appendChild(resultItem);

      resultItem.addEventListener('click', () => {
        getweather(result.latitude, result.longitude);
        searchInput.value = '';
        searchResults.innerHTML = '';

      });
    });
  } else {
    console.log('Invalid search results format:', results);
  }
}

// Attach the debounce handler to the search input
searchInput.addEventListener('input', handleSearchInput);


function getweather(latitude, longitude) {
  const apiKey = '6548232590e4064ff859a7d3a6c2d044';
  const weatherapiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;


  // Make a request to the OpenWeatherMap API
  fetch(weatherapiUrl)
    .then(response => response.json())
    .then(data => {

      const city = data.name;
      const country = data.sys.country;
      const weatherDescription = data.weather[0].description;
      const icon = data.weather[0].icon;
      const temperature = Math.round(data.main.temp);
      const feelslike = Math.round(data.main.feels_like);
      const wind = data.wind.speed;
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;

      document.getElementById('weather').removeAttribute('hidden');
      document.getElementById('city').textContent = `${city} ${country}`;
      document.getElementById('weather-description').textContent = `${weatherDescription}`;
      document.getElementById('icon').src = `icons/${icon}.png`;
      document.getElementById('temperature').textContent = `${temperature} °C`;
      document.getElementById('feels').textContent = `${feelslike} °C`;
      document.getElementById('wind').textContent = `${wind} m/s`;
      document.getElementById('Humidity').textContent = `${humidity}%`;
      document.getElementById(`Pressure`).textContent = `${pressure} hPa`;

    })
    .catch(error => {
      console.log('Error:', error);
    });


  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      // Filter the forecast data for the next few days around midday
      const forecastData = data.list.filter(item => {
        const dateTime = new Date(item.dt * 1000);
        const hours = dateTime.getHours();
        const today = new Date();
        return hours >= 11 && hours <= 13 && dateTime.getDate() != today.getDate();
      });

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      forecast_container.innerHTML = "";
      // Process the forecast data as needed
      forecastData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const temp_min = Math.round(item.main.temp_min);
        const temp_max = Math.round(item.main.temp_max);
        const weatherDescription = item.weather[0].description;
        const icon = item.weather[0].icon;

        const dayrow = document.createElement('div');
        dayrow.classList.add('daily-row');

        const daylabel = document.createElement('label');
        daylabel.classList.add('day');
        daylabel.textContent = days[date.getDay()];

        const disclabel = document.createElement('label');
        disclabel.classList.add('discription');
        disclabel.textContent = `${weatherDescription}`;

        const minmaxlabel = document.createElement('label');
        minmaxlabel.classList.add('min-max');
        minmaxlabel.textContent = ` ${temp_min}°C/${temp_max}°C`;

        const imgicon = document.createElement('img');
        imgicon.classList.add('icon-small');
        imgicon.src = `icons/${icon}.png`;


        dayrow.appendChild(imgicon);
        dayrow.appendChild(daylabel);
        //dayrow.appendChild(disclabel);
        dayrow.appendChild(minmaxlabel);
        forecast_container.appendChild(dayrow);
        forecast_container.removeAttribute('hidden');

        console.log(`Date: ${date.toDateString()}`);
        console.log(`Temperature: ${temperature}°C`);
        console.log(`Weather: ${weatherDescription}`);
        console.log('-------------------------');

      });
    })
    .catch(error => {
      console.log('Error:', error);
    });

}
