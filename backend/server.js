// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Load environment variables
const PORT = process.env.PORT || 5000;
const AUTH_URL = process.env.TBO_AUTH_URL;
const SEARCH_URL = process.env.TBO_SEARCH_URL;

// 🔹 Test route
app.get('/', (req, res) => {
  res.send('✅ Flight API is running!');
});

// 🔐 Get TokenId
async function getToken(ip) {
  const authData = {
    ClientId: process.env.TBO_CLIENT_ID,
    UserName: process.env.TBO_USERNAME,
    Password: process.env.TBO_PASSWORD,
    EndUserIp: ip,
  };

  try {
    const response = await axios.post(AUTH_URL, authData, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data.TokenId;
  } catch (error) {
    console.error('❌ Auth Error:', error.message);
    return null;
  }
}

// ✈️ Flight Search Endpoint
app.post('/api/search-flights', async (req, res) => {
  const ip =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    process.env.TBO_IP ||
    '127.0.0.1';

  const token = await getToken(ip);

  if (!token) {
    return res.status(500).json({ error: 'Unable to get token from TekTravels' });
  }

  const {
    journey_type,
    origin,
    destination,
    departure_date,
    arrival_date,
    cabin_class,
    adults,
    children,
    infants,
    direct_flight,
    one_stop_flight,
    preferred_airlines,
    sources,
    multi_origin,
    multi_destination,
    multi_departure_date,
  } = req.body;

  const segments = [];

  if (parseInt(journey_type) === 3 && Array.isArray(multi_origin)) {
    for (let i = 0; i < multi_origin.length; i++) {
      segments.push({
        Origin: multi_origin[i],
        Destination: multi_destination[i],
        FlightCabinClass: parseInt(cabin_class),
        PreferredDepartureTime: `${multi_departure_date[i]}T00:00:00`,
        PreferredArrivalTime: `${multi_departure_date[i]}T00:00:00`,
      });
    }
  } else {
    segments.push({
      Origin: origin,
      Destination: destination,
      FlightCabinClass: parseInt(cabin_class),
      PreferredDepartureTime: `${departure_date}T00:00:00`,
      PreferredArrivalTime: `${departure_date}T00:00:00`,
    });

    if (parseInt(journey_type) === 2) {
      segments.push({
        Origin: destination,
        Destination: origin,
        FlightCabinClass: parseInt(cabin_class),
        PreferredDepartureTime: `${departure_date}T00:00:00`,
        PreferredArrivalTime: `${arrival_date}T00:00:00`,
      });
    }
  }

  const postData = {
    EndUserIp: ip,
    TokenId: token,
    AdultCount: parseInt(adults),
    ChildCount: parseInt(children),
    InfantCount: parseInt(infants),
    JourneyType: parseInt(journey_type),
    DirectFlight: !!direct_flight,
    OneStopFlight: !!one_stop_flight,
    PreferredAirlines: preferred_airlines ? preferred_airlines.split(',') : [],
    Segments: segments,
    Sources: sources ? sources.split(',') : [],
  };

  try {
    const response = await axios.post(SEARCH_URL, postData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('❌ Flight Search Error:', error.message);
    res.status(500).json({ error: 'Flight search failed', detail: error.message });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
