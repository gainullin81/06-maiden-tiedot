import React, { useState, useEffect } from 'react';
import countriesService from './services/countries';
import Countries from './components/Countries';
import Country from './components/Country';
import Weather from './components/Weather';



function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [openWeatherCity, setOpenWeatherCity] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    countriesService.getAll()
      .then(response => {
        setCountries(response);
        if (response.length === 1) {
          setOpenWeatherCity(response[0].capital.toString());
        }
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, [selectedCountry]); 


  useEffect(() => {
    if (openWeatherCity && openWeatherCity.trim() !== '') { // Проверяем, что openWeatherCity не undefined
      countriesService.getCityFromOpenWeather(openWeatherCity)
        .then(response => {
          console.log(response);
          setOpenWeatherCity(response.name);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [openWeatherCity]);

useEffect(() => {
  if (openWeatherCity && openWeatherCity.trim() !== '') {
    countriesService.getCityFromOpenWeather(openWeatherCity)
      .then(response => {
        console.log(response);
        if (selectedCountry && selectedCountry.capital === openWeatherCity) {
          setSelectedCountry(country => ({ ...country, weather: response }));
        }
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }
}, [openWeatherCity, selectedCountry]);

  const filteredCountries = countries && countries.length > 0 ?
    countries.filter(country =>
      country.name && country.name.common &&
      country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
    ) :
    [];

    useEffect(() => {
      const filteredCountries = countries.filter(country =>
        country.name && country.name.common &&
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredCountries.length === 1) {
        setSelectedCountry(filteredCountries[0]);
        setOpenWeatherCity(filteredCountries[0].capital.toString());
        setSearchQuery('');
      }
    }, [countries, searchQuery]);

    const showCountry = (country) => {
      setSelectedCountry(country);
      setSearchQuery('');
    };

  return (
    <div>
      <h1>Find Country</h1>
      <div>
        <label>Find Countries</label>
        <input onChange={handleSearchChange} value={searchQuery} />
      </div>
      {filteredCountries.length > 0 && filteredCountries.length < 10 ? (
        <Countries filteredCountries={filteredCountries} setCountry={showCountry}/>
      ) : (
        <p>{searchQuery ? 'Too many matches' : null}</p>
      )}
      <div>
        <Country country={selectedCountry} weather={openWeatherCity}/>
        <Weather weather={selectedCountry && selectedCountry.weather}/>
      </div>
      
    </div>
  );
}

export default App;
