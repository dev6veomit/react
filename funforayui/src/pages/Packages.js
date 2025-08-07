import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPackages } from '../api/apiService';
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaWhatsapp, FaPhone, FaEnvelope, FaClock
} from 'react-icons/fa';
import { FaMapLocation } from 'react-icons/fa6';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PackageCard from '../components/PackageCard'; // adjust path if needed


const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [filters, setFilters] = useState({ flight: '', duration: [], price: [] });
  const [availableDurations, setAvailableDurations] = useState([]);
  const [flightOptions, setFlightOptions] = useState([]);
  const [priceRangeOptions, setPriceRangeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
const [sortOrder, setSortOrder] = useState('asc');
  const withFlightCount = packages.filter(pkg => pkg.with_flight === true).length;
  const withoutFlightCount = packages.filter(pkg => pkg.with_flight === false).length;

const [sortType, setSortType] = useState('');

// const getDoubleRoomPrice = (pkg) => {
//   try {
//     const hotelRatings = pkg.hotel_ratings || [];
//     const threeStarHotel = hotelRatings.find(h => h.rating === '3');
//     const doubleRoom = threeStarHotel?.room_types?.find(rt => rt.room_type === 'Double');
//     return parseInt(doubleRoom?.adults?.replace(/[^0-9]/g, '') || '0', 10);
//   } catch {
//     return 0;
//   }
// };


const sortedPackages = [...filteredPackages].sort((a, b) => {
  if (!sortType) return 0;

  let aVal, bVal;

  if (sortType === 'rating') {
    aVal = parseFloat(a.customer_rating || 0);
    bVal = parseFloat(b.customer_rating || 0);
  } else if (sortType === 'price') {
    const getPrice = (pkg) => {
      const hotel = pkg.hotel_ratings?.find(h => h.rating === '3');
      const room = hotel?.room_types?.find(r => r.room_type === 'Double');
      return parseInt(room?.adults?.replace(/[^0-9]/g, '') || '0', 10);
    };
    aVal = getPrice(a);
    bVal = getPrice(b);
  } else if (sortType === 'duration') {
    aVal = parseInt(a.duration || '0', 10);
    bVal = parseInt(b.duration || '0', 10);
  }

  return sortOrder === 'desc' ? aVal - bVal : bVal - aVal;
});

const handleSortClick = (type) => {
  if (sortType === type) {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  } else {
    setSortType(type);
    setSortOrder('asc'); // default on new selection
  }
};

  useEffect(() => {
    fetchPackages()
      .then(data => {
        setPackages(data);
        setFilteredPackages(data);

        const durations = [...new Set(data.map(pkg => parseInt(pkg.duration)).filter(Boolean))];
        setAvailableDurations(durations);

        const flights = [...new Set(data.map(pkg => pkg.with_flight))];
        setFlightOptions(flights);

        const prices = data.map(pkg => {
          const min = parseInt(pkg.price_3_star_double_adult || 0);
          const max = parseInt(pkg.sale_price || 0);
          return [min, max];
        });
        const flatPrices = prices.flat();
        const minPrice = Math.min(...flatPrices);
        const maxPrice = Math.max(...flatPrices);

        const ranges = [
          [0, 10000],
          [10001, 20000],
          [20001, 40000],
          [40001, maxPrice]
        ].filter(([min, max]) => max >= minPrice);

        setPriceRangeOptions(ranges);
      })
      .catch(err => console.error('Package fetch error:', err));
  }, []);

  useEffect(() => {
    fetch('https://belltechwebtools.com/funforay/api/cities/')
      .then(res => res.json())
      .then(data => {
        const cities = [];
        data.forEach(item => {
          if (Array.isArray(item.city_name)) {
            cities.push(...item.city_name);
          }
        });
        setCityOptions([...new Set(cities)]);
      })
      .catch(err => {
        console.error('City fetch error:', err);
        setCityOptions([]);
      });
  }, []);

  const handleFlightFilter = (type) => {
    const updated = { ...filters, flight: type };
    setFilters(updated);
    filterPackages(updated);
  };


  // Handle checkbox change
  const handleCheckboxChange = (category, value) => {
    const updated = { ...filters };

    if (category === 'flight') {
      // Toggle logic for flight (single selection)
      updated.flight = updated.flight === value ? '' : value;
    } else {
      // For duration and price (multi-select checkboxes)
      if (updated[category].includes(value)) {
        updated[category] = updated[category].filter(v => v !== value);
      } else {
        updated[category].push(value);
      }
    }

    setFilters(updated);
    filterPackages(updated);
  };


  useEffect(() => {
    if (queryCity && queryMonth && packages.length > 0) {
      setLoading(true); // Start loading
      handleSearchFilters(queryCity, queryMonth);
    }
  }, [packages]);

  // Filter packages
  const filterPackages = (filter) => {
    let filtered = [...packages];

    // Flight Filter
    if (filter.flight) {
      filtered = filtered.filter(pkg =>
        (filter.flight === 'with' && pkg.with_flight === true) ||
        (filter.flight === 'without' && pkg.with_flight === false)
      );
    }

    // Duration Filter (based on nights from pkg.duration)
    if (filter.duration.length > 0) {
      filtered = filtered.filter(pkg => {
        let dur = 0;
        try {
          dur = parseInt(pkg.duration?.toString().split(' ')[0] || '0', 10); // e.g., "3 Nights / 4 Days"
        } catch (e) {
          console.error("Duration parse error:", e);
        }

        return filter.duration.some(range => {
          if (range === 'below_4') return dur >= 1 && dur <= 3;
          if (range === '4_7') return dur >= 4 && dur <= 7;
          if (range === '7_10') return dur >= 8 && dur <= 10;
          if (range === '10_15') return dur >= 11 && dur <= 15;
          if (range === 'above_15') return dur > 15;
          return false;
        });
      });
    }

    // Price Filter (based on 3-star double adult price)
    if (filter.price.length > 0) {
      filtered = filtered.filter(pkg => {
        let doublePrice = 0;
        try {
          const threeStar = pkg.hotel_ratings?.find(h => h.rating === '3');
          const doubleRoom = threeStar?.room_types?.find(rt => rt.room_type === 'Double');
          doublePrice = parseInt(doubleRoom?.adults?.replace(/[^0-9]/g, '') || '0', 10);
        } catch (err) {
          console.error('Price parse error:', err);
        }

        return filter.price.some(range => {
          if (range === '300000+') return doublePrice > 300000;
          const [min, max] = range.split('-').map(Number);
          return doublePrice >= min && doublePrice <= max;
        });
      });
    }

    setFilteredPackages(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({ flight: '', duration: [], price: [] });
    setFilteredPackages(packages);
  };

  // Check if any filter is active
  const isFilterActive =
    filters.flight !== '' ||
    filters.duration.length > 0 ||
    filters.price.length > 0;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryCity = queryParams.get('city');
  const queryMonth = queryParams.get('month');

  const [selectedCity, setSelectedCity] = useState(queryCity || '');
const [selectedMonth, setSelectedMonth] = useState(queryMonth || '');


  useEffect(() => {
    if (queryCity && queryMonth && packages.length > 0) {
      handleSearchFilters(queryCity, queryMonth);
    }
  }, [packages]);

  const handleSearchFilters = (city, month) => {
    const monthIndex = monthNameToNumber[month];
    const filtered = packages.filter(pkg => {
      const cities = JSON.parse(pkg.city_name || '[]');
      const fromDate = new Date(pkg.available_from);
      const toDate = new Date(pkg.available_to);
      const testDate = new Date(fromDate.getFullYear(), monthIndex, 15);

      return cities.includes(city) && testDate >= fromDate && testDate <= toDate;
    });

    setFilteredPackages(filtered);
    setTimeout(() => setLoading(false), 500); // Delay for smoother UX
  };



  const monthNameToNumber = {

    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

 const handleSubmit = (e) => {
  if (e) e.preventDefault();
  if (!selectedCity || !selectedMonth) return;

  setLoading(true);

  const filtered = packages.filter(pkg => {
    let cities = [];
    try {
      cities = JSON.parse(pkg.city_name || '[]');
    } catch (err) {
      console.error('City parse error:', err);
    }

    const fromDate = new Date(pkg.available_from);
    const toDate = new Date(pkg.available_to);

    const monthIndex = monthNameToNumber[selectedMonth];
    if (monthIndex === undefined) return false;

    const testDate = new Date(fromDate.getFullYear(), monthIndex, 15);

    return (
      cities.includes(selectedCity) &&
      testDate >= fromDate &&
      testDate <= toDate
    );
  });

  setFilteredPackages(filtered);
  setTimeout(() => setLoading(false), 500);
};

// Put this below all your `useState` definitions
useEffect(() => {
  if (selectedCity && selectedMonth && packages.length > 0) {
    handleSubmit({ preventDefault: () => {} }); // Simulate event
  }
}, [selectedCity, selectedMonth, packages]);



  return (
    <div style={{ padding: '0 20px' }}>
      {/* Search Form */}
      <div className="modify_form">
        <form
          onSubmit={handleSubmit}
          onReset={() => {
  setSelectedCity('');
  setSelectedMonth('');
  setFilteredPackages(packages);
  setFilters({ flight: '', duration: [], price: [] }); // optional if using filters
  window.history.replaceState({}, document.title, window.location.pathname); // Clear URL
  alert('Form reset. Please select destination and month again.');
  window.scrollTo(0, 0); // Optional: scroll to top after reset
}}


        >
          {/* Destination Select */}
          <div className="form-group-floating">
            <select
              required
              className="form-control custom-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="" disabled hidden>Select Destination</option>
              {cityOptions.length > 0 ? (
                cityOptions.map((city, idx) => (
                  <option key={idx} value={city}>{city}</option>
                ))
              ) : (
                <option disabled>Loading cities...</option>
              )}
            </select>
            <label>Destination</label>
          </div>

          {/* Month Select */}
          <div className="form-group-floating">
            <select
              required
              className="form-control custom-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="" disabled hidden>Select Month</option>
              {Object.keys(monthNameToNumber).map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <label>Month</label>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="submit" style={styles.submitBtn}>Modify Search</button>
            <button type="reset" style={{ ...styles.submitBtn }}>Reset</button>
          </div>
        </form>
      </div>



      {/* Sidebar + Packages */}
      <div style={{ display: 'flex', gap: '30px', marginTop: '40px', marginBottom: '40px' }}>
        {/* Sidebar */}
        <div className='filter_sidebar' style={{ width: '300px' }}>

          <h4 className='fil_title'><img src='../images/filter.png'></img> Filters</h4>

          {/* Duration */}
          <div className='filter_design'>
            <p>Duration</p>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('duration', 'below_4')}
                  checked={filters.duration.includes('below_4')}
                />
                Below 4 Nights
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('duration', '4_7')}
                  checked={filters.duration.includes('4_7')}
                />
                4–7 Nights
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('duration', '7_10')}
                  checked={filters.duration.includes('7_10')}
                />
                7–10 Nights
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('duration', '10_15')}
                  checked={filters.duration.includes('10_15')}
                />
                10–15 Nights
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('duration', 'above_15')}
                  checked={filters.duration.includes('above_15')}
                />
                Above 15 Nights
              </label>
            </div>
          </div>


          {/* Flight Option */}
          <div className='filter_design'>
            <p>Flights</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                style={{
                  ...styles.flightBtn,
                  backgroundColor: filters.flight === 'with' ? '#E2068C' : '#ffffff',
                  color: filters.flight === 'with' ? '#ffffff' : '#E2068C',
                  border: '1px solid #E2068C'
                }}
                onClick={() => handleFlightFilter('with')}
              >
                With Flight ({withFlightCount})
              </button>

              <button
                style={{
                  ...styles.flightBtn,
                  backgroundColor: filters.flight === 'without' ? '#E2068C' : '#ffffff',
                  color: filters.flight === 'without' ? '#ffffff' : '#E2068C',
                  border: '1px solid #E2068C'
                }}
                onClick={() => handleFlightFilter('without')}
              >
                Without Flight ({withoutFlightCount})
              </button>
            </div>
          </div>

          {/* Price */}
          <div className='filter_design'>
            <p>Price Range</p>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('price', '0-50000')}
                  checked={filters.price.includes('0-50000')}
                />
                Below ₹50,000
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('price', '50000-100000')}
                  checked={filters.price.includes('50000-100000')}
                />
                ₹50,000 – ₹1,00,000
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('price', '100000-200000')}
                  checked={filters.price.includes('100000-200000')}
                />
                ₹1,00,000 – ₹2,00,000
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('price', '200000-300000')}
                  checked={filters.price.includes('200000-300000')}
                />
                ₹2,00,000 – ₹3,00,000
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange('price', '300000+')}
                  checked={filters.price.includes('300000+')}
                />
                Above ₹3,00,000
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            disabled={!isFilterActive}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              backgroundColor: '#E2068C',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isFilterActive ? 'pointer' : 'not-allowed',
              opacity: isFilterActive ? 1 : 0.5,
              fontSize: '14px',
              margin: '20px',
            }}
          >
            Reset Filters
          </button>
          
        </div>

        

        {/* Packages List in List Style */}
        {loading ? (
          <p className="loading">Loading...</p>
        ) : filteredPackages.length === 0 ? (
          <p>No matching packages found.</p>
        ) : (
          

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className='sortby'>
  <div><p>Sort By:</p></div>
  <div className='sorts_item'>
    {['rating', 'price', 'duration'].map((type) => (
      <p
        key={type}
        onClick={() => handleSortClick(type)}
        style={{
          fontWeight: sortType === type ? 'bold' : 'normal',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          marginRight: '12px',
        }}
      >
        {type === 'rating' && 'Customer Rating'}
        {type === 'price' && 'Price'}
        {type === 'duration' && 'Duration'}

        {sortType === type && (
          <span style={{ color: '#E2068C' }}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </p>
    ))}
  </div>
</div>


            {sortedPackages.length > 0 ? (
    sortedPackages.map(pkg => (
             

                <PackageCard pkg={pkg} />

             
           ) )) : <p>No matching packages found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  formField: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 200px',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#EA028F',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '21px',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  flightBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  packageImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px'
  }
};

export default Packages;