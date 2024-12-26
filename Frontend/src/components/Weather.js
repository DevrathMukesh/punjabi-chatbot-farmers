import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/weather')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-lg text-gray-400">Loading weather data...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error loading weather data: {error.message}</p>;
  }

  if (!weather) {
    return <p className="text-center text-lg text-gray-400">No weather data available.</p>;
  }

  return (
    <div className="flex-1 p-4 bg-gray-900 text-gray-100 overflow-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Weather</h1>

      {/* Current Weather */}
      <div className="mb-6 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
        <p className="text-lg">Temperature: {weather.current.temperature_2m}°C</p>
        <p className="text-lg">Relative Humidity: {weather.current.relative_humidity_2m}%</p>
        <p className="text-lg">Apparent Temperature: {weather.current.apparent_temperature}°C</p>
        <p className="text-lg">Precipitation: {weather.current.precipitation} mm</p>
        <p className="text-lg">Rain: {weather.current.rain} mm</p>
        <p className="text-lg">Showers: {weather.current.showers} mm</p>
        <p className="text-lg">Snowfall: {weather.current.snowfall} mm</p>
        <p className="text-lg">Cloud Cover: {weather.current.cloud_cover}%</p>
        <p className="text-lg">Wind Speed: {weather.current.wind_speed_10m} km/h</p>
        <p className="text-lg">Wind Direction: {weather.current.wind_direction_10m}°</p>
        <p className="text-lg">Wind Gusts: {weather.current.wind_gusts_10m} km/h</p>
      </div>

      {/* Forecast */}
      <div className="relative">
        <h2 className="text-2xl font-semibold mb-4">Forecast</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4">
            {weather.daily.time.map((date, index) => (
              <div key={index} className="w-64 p-4 bg-gray-800 rounded-lg shadow-lg flex-shrink-0">
                <p className="text-lg font-semibold">{new Date(date).toDateString()}</p>
                <p className="text-md">Temperature: {weather.daily.temperature_2m_max[index]}°C - {weather.daily.temperature_2m_min[index]}°C</p>
                <p className="text-md">Apparent Temperature Max: {weather.daily.apparent_temperature_max[index]}°C</p>
                <p className="text-md">Apparent Temperature Min: {weather.daily.apparent_temperature_min[index]}°C</p>
                <p className="text-md">Precipitation Sum: {weather.daily.precipitation_sum[index]} mm</p>
                <p className="text-md">Rain Sum: {weather.daily.rain_sum[index]} mm</p>
                <p className="text-md">Showers Sum: {weather.daily.showers_sum[index]} mm</p>
                <p className="text-md">Snowfall Sum: {weather.daily.snowfall_sum[index]} mm</p>
                <p className="text-md">Sunrise: {weather.daily.sunrise[index]}</p>
                <p className="text-md">Sunset: {weather.daily.sunset[index]}</p>
                <p className="text-md">Daylight Duration: {(weather.daily.daylight_duration[index] / 3600).toFixed(2)} hours</p>
                <p className="text-md">Sunshine Duration: {(weather.daily.sunshine_duration[index] / 3600).toFixed(2)} hours</p>
                <p className="text-md">Wind Speed Max: {weather.daily.wind_speed_10m_max[index]} km/h</p>
                <p className="text-md">Wind Gusts Max: {weather.daily.wind_gusts_10m_max[index]} km/h</p>
                <p className="text-md">Wind Direction Dominant: {weather.daily.wind_direction_10m_dominant[index]}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
