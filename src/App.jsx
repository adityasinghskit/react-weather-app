import { useEffect, useState } from "react";


function App() {
  const API_KEY = "f56f24967aaf51182d1d4df628297c6d";
  const suggestedCities = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'];

  let [inputValue, setInputValue] = useState("");
  let [currentWeatherData, setCurrentWeatherData] = useState(null);
  let [loading, setLoading] = useState(true);

  console.log(inputValue);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCitySearch = () => {
    fetchWeather(inputValue);
  };

  const handleEnter = (event) => {
    if(event.key == 'Enter'){
      handleCitySearch();
    }
  }

  const handleSuggestedCity = (city) => {
    setInputValue(city);
    fetchWeather(city);
  }
  useEffect(() => {
    fetchWeather("Delhi");
  }, []);

  const fetchWeather = (city) => {
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      .then(response => response.json())
      .then(data => {
        setCurrentWeatherData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching weather: ", error);
        setLoading(false);
      });
  };

  const Forecast = (({ lat, lon }) => {
    let [forecastData, setForecastData] = useState(null);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!lat || !lon) return;
      setLoading(true);
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
          setForecastData(data.daily.slice(1, 4));
          setLoading(false);
        })
    }, [lat, lon]);

    return (
      <div className="forecast-wrapper">
        <h3>3 Day Forecast</h3>
        <hr/>
        <div className="forecast">
          {loading ? <div className="loading-forecast">Loading forecast...</div> : (
            forecastData.map((day, index) => (
              <div key={index} className="day">
                <span className="forecast-date">
                  {new Date(day.dt * 1000).toLocaleString("en-GB")}
                </span>
                <div className="forecast-temp-wrapper">
                  <img className="forecast-image" src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt={day.weather[0].description} />
                </div>
                <span>{day.temp.min}°C / {day.temp.max}°C</span>
              </div>
            ))
          )
          }
        </div>
      </div>
    )
  })

  return (
    <div className="weather-app">
      <div className="search-box">
        <input
          className="city-search-input"
          type="text"
          placeholder="Enter city..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleEnter}
        />
        <button>
          <span className="glass-icon" onClick={handleCitySearch}>🔍</span>
        </button>
        <div className="suggested-cities">
          {suggestedCities.map((city) => (
            <button
              key={city}
              className="city-button"
              onClick={() => handleSuggestedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
      {
        loading ? <p>loading...</p> :
          (<div>
            <div className="date-time">
              {new Date().toLocaleString("en-GB")}
            </div>
            <h1 className="city-name">{currentWeatherData.name}</h1>
            <div className="weather-info">
              <img
                className="weather-icon"
                src={`http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@4x.png`}
                alt={currentWeatherData.weather[0].description}
              />
              <p>{currentWeatherData.weather[0].description}</p>
            </div>
            <h2 className="temperature">{`${currentWeatherData.main.temp}°C`}</h2>
          </div>
          )
      }
      {!loading && currentWeatherData && (
        <Forecast
          lat={currentWeatherData.coord.lat}
          lon={currentWeatherData.coord.lon}
        />
      )}
    </div>
  );
}

export default App;
