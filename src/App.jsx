import React, { useState, useEffect } from "react";
import countriesService from "./services/countries";
import Countries from "./components/Countries";
import Country from "./components/Country";
import Weather from "./components/Weather";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [openWeatherCity, setOpenWeatherCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    countriesService
      .getAll()
      .then((response) => {
        setCountries(response);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (openWeatherCity && openWeatherCity.trim() !== "") {
      countriesService
        .getCityFromOpenWeather(openWeatherCity)
        .then((response) => {
          console.log(response);
          if (selectedCountry && selectedCountry.capital === openWeatherCity) {
            setSelectedCountry((country) => ({
              ...country,
              weather: response,
            }));
          }
          setWeatherData(response);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [openWeatherCity, selectedCountry]);

  const filteredCountries = countries.filter(
    (country) =>
      country.name &&
      country.name.common &&
      country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setSelectedCountry(filteredCountries[0]);
      setOpenWeatherCity(filteredCountries[0].capital.toString());
    } else {
      setSelectedCountry(null);
      setOpenWeatherCity("");
    }
  }, [filteredCountries]);

  const showCountry = (country) => {
    setSelectedCountry(country);
    setOpenWeatherCity(country.capital.toString());
    setSearchQuery("");
  };

  const handleWeatherData = async (city) => {
    try {
      const data = await countriesService.getCityFromOpenWeather(city);
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div>
      <h1>Find Country</h1>
      <div>
        <label>Find Countries</label>
        <input onChange={handleSearchChange} value={searchQuery} />
      </div>
      {filteredCountries.length > 0 && filteredCountries.length < 10 ? (
        <Countries
          filteredCountries={filteredCountries}
          setCountry={showCountry}
        />
      ) : (
        <p>{searchQuery ? "Too many matches" : null}</p>
      )}
      <div>
        <Country
          country={selectedCountry}
          weather={selectedCountry && selectedCountry.weather}
        />
        {weatherData && (
          <div>
            <h3>Weather in {weatherData.name}</h3>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Feels like: {weatherData.main.feels_like}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind: {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
