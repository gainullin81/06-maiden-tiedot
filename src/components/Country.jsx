import React from 'react';

const Country = ({ country}) => {
  if (!country) return null;
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km2</p>
      <h2>Languages:</h2>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="Flag"/>
    </div>
  );
};

export default Country;
