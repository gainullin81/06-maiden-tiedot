import React from 'react';

const Countries = ({ filteredCountries, setCountry }) => {
  if (filteredCountries.length === 1) {
    return null;
  }

  return (
    <ul>
      {filteredCountries.map(country => (
        <li key={country.cca2}>
          {country.name.common}
          <button onClick={() => setCountry(country)}>Show</button>
        </li>
      ))}
    </ul>
  );
};

export default Countries;