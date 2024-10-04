import axios from 'axios';
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';

const API_KEY = import.meta.env.VITE_SOME_KEY;

const getCityFromOpenWeather = (city) => {
   if (!city) {
      return Promise.resolve({});
   }
   const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
   return axios.get(openWeatherUrl)
     .then(response => response.data)
     .catch(error => {
       console.error('Error fetching weather data:!!!', error);
       throw error;
     });
 };
   

const getAll = () => {
   const request = axios.get(baseUrl);
   return request.then(response => response.data);
}

export default {
   getAll, getCityFromOpenWeather
}