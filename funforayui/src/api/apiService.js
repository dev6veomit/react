export const fetchAirports = async () => {
  const res = await fetch("https://belltechwebtools.com/funforay/api/airports");
  const data = await res.json();
  return data.map(item => ({
    value: item.airportcode || 'XXX',
    label: `${item.cityname || 'Unknown'} - ${item.airportcode || 'XXX'} - ${item.airportname || 'Unknown Airport'}`,
    cityname: item.cityname || 'Unknown',
    airportcode: item.airportcode || 'XXX',
    airportname: item.airportname || 'Unknown Airport'
  }));
};

export const fetchPackages = async () => {
  const res = await fetch("https://belltechwebtools.com/funforay/api/packages");
  const response = await res.json();
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  } else {
    throw new Error("Unexpected package format");
  }
};

export const fetchCities = async () => {
  const res = await fetch("https://belltechwebtools.com/funforay/api/cities/");
  const data = await res.json();
  const cities = [];

  data.forEach(item => {
    if (Array.isArray(item.city_name)) {
      cities.push(...item.city_name);
    }
  });

  return [...new Set(cities)];
};

export const fetchHotels = async () => {
  const res = await fetch("https://belltechwebtools.com/funforay/api/hotels");
  if (!res.ok) {
    throw new Error("Failed to fetch hotels");
  }
  const hotels = await res.json();
  return Array.isArray(hotels) ? hotels : [];
};
