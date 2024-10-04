import React from 'react';

const Weather = ({weather}) => {
   if (!weather) {
      return <div>Loading weather...</div>;
   }
   console.log(weather);
   return (
      <div>
         <h1>Hello</h1>
      </div>
   );
};

export default Weather;