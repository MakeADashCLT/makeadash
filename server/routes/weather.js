const express = require('express');

const router = express.Router();

function weatherCodeToText(code) {
  const map = {
    0: 'Clear sky',
    1: 'Mostly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return map[code] || 'Unknown';
}

router.get('/', async (req, res) => {
  try {
    const city = (req.query.city || 'Charlotte').trim();

    if (!city) {
      return res.status(400).json({ error: 'City is required.' });
    }

    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoResponse.ok) {
      return res.status(geoResponse.status).json({
        error: 'Failed to look up city.',
        details: geoData,
      });
    }

    const match = geoData.results?.[0];

    if (!match) {
      return res.status(404).json({ error: `No matching city found for "${city}".` });
    }

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${match.latitude}&longitude=${match.longitude}` +
      `&current=temperature_2m,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return res.status(weatherResponse.status).json({
        error: 'Failed to fetch weather.',
        details: weatherData,
      });
    }

    const result = {
      city: match.name,
      state: match.admin1 || '',
      country: match.country || '',
      latitude: match.latitude,
      longitude: match.longitude,
      temperature: weatherData.current?.temperature_2m ?? null,
      windSpeed: weatherData.current?.wind_speed_10m ?? null,
      weatherCode: weatherData.current?.weather_code ?? null,
      condition: weatherCodeToText(weatherData.current?.weather_code),
      high: weatherData.daily?.temperature_2m_max?.[0] ?? null,
      low: weatherData.daily?.temperature_2m_min?.[0] ?? null,
      forecast: (weatherData.daily?.time || []).slice(0, 5).map((date, index) => ({
        date,
        high: weatherData.daily?.temperature_2m_max?.[index] ?? null,
        low: weatherData.daily?.temperature_2m_min?.[index] ?? null,
        weatherCode: weatherData.daily?.weather_code?.[index] ?? null,
        condition: weatherCodeToText(weatherData.daily?.weather_code?.[index]),
      })),
    };

    res.json(result);
  } catch (error) {
    console.error('Weather route error:', error);
    res.status(500).json({ error: 'Internal server error while fetching weather.' });
  }
});

module.exports = router;