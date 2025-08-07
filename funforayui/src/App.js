import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Slider from "react-slick";
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecentGallery from './components/RecentGallery';
import { fetchAirports, fetchPackages, fetchCities } from './api/apiService';
import flightIcon from './assets/images/flights.png';
import activeFlightIcon from './assets/images/active-flight.png';

import hotelIcon from './assets/images/hotels.png';
import activeHotelIcon from './assets/images/active-hotels.png';

import holidayIcon from './assets/images/holiday.png';
import activeHolidayIcon from './assets/images/active-holiday.png';

import Header from './components/PackagesHeader';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Flights from './pages/Flights';

import bgImage from './assets/images/background.png';

import { FaClock } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



function Home() {
  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState('flight');
  const [airportOptions, setAirportOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [tripType, setTripType] = useState('oneway');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [travelClass, setTravelClass] = useState('economy');
  
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const navigate = useNavigate();
  

  const dropdownRef = useRef(null);
  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <div className="custom-date-picker" onClick={onClick} ref={ref} style={{ position: 'relative', cursor: 'pointer' }}>
      <input
        className="input-design_input"
        value={value}
        readOnly
        placeholder="Departure Date"
        style={{ width: '100%' }}
      />
      <FaCalendarAlt className='calender'

      />
    </div>
  ));


const [adults, setAdults] = useState(1);
const [children, setChildren] = useState(0);
const [infants, setInfants] = useState(0);
const [directFlight, setDirectFlight] = useState(false);
const [oneStopFlight, setOneStopFlight] = useState(false);


const [multiCitySegments, setMultiCitySegments] = useState([]);
const [showTravelDropdown, setShowTravelDropdown] = useState(false); // for non-multicity
const travelClassLabel = {
  economy: 'Economy',
  premium: 'Premium Economy',
  business: 'Business',
  first: 'First Class'
};

const toggleDropdown = (index) => {
  setMultiCitySegments(prev =>
    prev.map((seg, i) => ({
      ...seg,
      showDropdown: i === index ? !seg.showDropdown : false
    }))
  );
};

const handleAddSegment = () => {
  setMultiCitySegments(prev => [
    ...prev,
    {
      from: '',
      to: '',
      departureDate: null,
      returnDate: null,
      travelers: 1,
      travelClass: 'economy',
      showDropdown: false
    }
  ]);
};

const handleRemoveSegment = (index) => {
  setMultiCitySegments(prev => prev.filter((_, i) => i !== index));
};

const formatAirportOption = (option) => (
  <div>
    <div style={{ fontWeight: 'bold', color: '#006CB8', fontSize: '24px' }}>{option.cityname}</div>
    <div style={{ fontSize: '12px', color: '#5F5F5F' }}>
      {option.airportcode} – {option.airportname}
    </div>
  </div>
);
const handleFlightSubmit = (e) => {
  e.preventDefault();

  const queryParams = new URLSearchParams();
  queryParams.append('tripType', tripType);

  if (tripType === 'multicity') {
    multiCitySegments.forEach((segment, index) => {
      queryParams.append(`from[${index}]`, segment.from);
      queryParams.append(`to[${index}]`, segment.to);

      // ✅ Format departure date in local time
      if (segment.departureDate) {
        const d = segment.departureDate;
        const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        queryParams.append(`departureDate[${index}]`, formattedDate);
      }

      // ✅ Format return date in local time (if exists)
      if (segment.returnDate) {
        const r = segment.returnDate;
        const formattedReturnDate = `${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, '0')}-${String(r.getDate()).padStart(2, '0')}`;
        queryParams.append(`returnDate[${index}]`, formattedReturnDate);
      }

      queryParams.append(`travelers[${index}]`, segment.travelers);
      queryParams.append(`travelClass[${index}]`, segment.travelClass);
    });
  } else {
    queryParams.append('from', fromCity);
    queryParams.append('to', toCity);

    if (departureDate) {
      const d = departureDate;
      const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      queryParams.append('departureDate', formattedDate);
    }

    if (tripType === 'round trip' && returnDate) {
      const r = returnDate;
      const formattedReturnDate = `${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, '0')}-${String(r.getDate()).padStart(2, '0')}`;
      queryParams.append('returnDate', formattedReturnDate);
    }

       queryParams.append('adults', adults);
    queryParams.append('children', children);
    queryParams.append('infants', infants);
    queryParams.append('travelClass', travelClass);
  }

  navigate(`/flights?${queryParams.toString()}`);
};



  // Reusable date input with calendar icon
  const CustomDateInputreturn = forwardRef(({ value, onClick, disabled }, ref) => (
    <div
      className="custom-date-picker"
      onClick={!disabled ? onClick : undefined}
      ref={ref}
      style={{
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
    >
      <input
        className="input-design_input"
        value={value}
        readOnly
        placeholder="Return Date"
        style={{ width: '100%' }}
        disabled={disabled}
      />
      <FaCalendarAlt className='calender'

      />
    </div>
  ));


  useEffect(() => {
    fetchAirports().then(setAirportOptions).catch(() => setAirportOptions([]));
    fetchPackages().then(setPackages).catch(console.error);
    fetchCities().then(setCityOptions).catch(() => setCityOptions([]));

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTravelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
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
  const bannerStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    padding: '150px 20px 50px 20px',
    color: '#000',
    textAlign: 'center'
  };

  const tabButtonStyle = (tab) => ({
    padding: '10px 20px',
    border: 'none',
    borderRadius: '15px',

    backgroundColor: activeTab === tab ? '#E2068C' : '#fff',
    color: activeTab === tab ? '#fff' : '#E2068C',
    cursor: 'pointer',
    fontFamily: 'Manrope',
    fontSize: '15px',
    fontWeight: '700',
    borderRadius: '15px',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedCity || !selectedMonth) return;

    navigate(`/packages?city=${encodeURIComponent(selectedCity)}&month=${selectedMonth}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ tripType, fromCity, toCity, departureDate, returnDate: tripType === 'round trip' ? returnDate : null, travelers, travelClass });
  };

  return (
    <main>
      <div style={bannerStyle}>
        {/* Tabs */}
        <div
          className="tabdesign"
          style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '4px' }}
        >
          {[
            { tab: 'flight', icon: flightIcon, activeIcon: activeFlightIcon, label: 'Flight' },
            { tab: 'hotel', icon: hotelIcon, activeIcon: activeHotelIcon, label: 'Hotels' },
            { tab: 'holiday', icon: holidayIcon, activeIcon: activeHolidayIcon, label: 'Holiday Packages' }
          ].map(({ tab, icon, activeIcon, label }) => (
            <button
              key={tab}
              style={tabButtonStyle(tab)}
              onClick={() => setActiveTab(tab)}
            >
              <img
                src={activeTab === tab ? activeIcon : icon}
                alt={label}
                style={{ height: '15px', marginRight: '8px', verticalAlign: 'middle' }}
              />
              <span>{label}</span>
            </button>
          ))}
        </div>



        <div className="formmain">
          {activeTab === 'flight' && (
        <form className="form-design" onSubmit={handleFlightSubmit}>
  <div className="flight_design">
    {/* Trip Type Radio Buttons */}
    <div className="mb-4 radio_design">
      {['oneway', 'round trip', 'multicity'].map((type) => (
        <label key={type} className="mr-4">
          <input
            type="radio"
            name="tripType"
            value={type}
            checked={tripType === type}
            onChange={(e) => {
              setTripType(e.target.value);
              if (e.target.value === 'multicity') {
                setMultiCitySegments([
                  {
                    from: '',
                    to: '',
                    departureDate: null,
                    returnDate: null,
                    adults: 1,
                    children: 0,
                    infants: 0,
                    travelClass: 'economy',
                    showDropdown: false
                  }
                ]);
              }
            }}
          />{" "}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      ))}
    </div>

    {/* Multicity Mode */}
    {tripType === 'multicity' ? (
      <>
        {multiCitySegments.map((segment, index) => (
          <div key={index} className="flex multicity-row" style={{ marginBottom: '25px', position: 'relative' }}>
            <div className="select_input">
              <label>From</label>
              <Select
                className="input-design"
                options={airportOptions}
                value={airportOptions.find(opt => opt.value === segment.from)}
                onChange={(selected) => {
                  const updated = [...multiCitySegments];
                  updated[index].from = selected?.value || '';
                  setMultiCitySegments(updated);
                }}
                placeholder="From"
                formatOptionLabel={formatAirportOption}
              />
            </div>

            <div className="select_input">
              <label>To</label>
              <Select
                className="input-design"
                options={airportOptions}
                value={airportOptions.find(opt => opt.value === segment.to)}
                onChange={(selected) => {
                  const updated = [...multiCitySegments];
                  updated[index].to = selected?.value || '';
                  setMultiCitySegments(updated);
                }}
                placeholder="To"
                formatOptionLabel={formatAirportOption}
              />
            </div>

            <div className="select_input">
              <label>Departure</label>
              <DatePicker
                selected={segment.departureDate}
                onChange={(date) => {
                  const updated = [...multiCitySegments];
                  updated[index].departureDate = date;
                  setMultiCitySegments(updated);
                }}
                dateFormat="dd MMM, yy"
                customInput={<CustomDateInput />}
              />
            </div>

            <div className="select_input">
              <label>Return</label>
              <DatePicker
                selected={segment.returnDate}
                onChange={(date) => {
                  const updated = [...multiCitySegments];
                  updated[index].returnDate = date;
                  setMultiCitySegments(updated);
                }}
                dateFormat="dd MMM, yy"
                customInput={<CustomDateInputreturn />}
              />
            </div>

            <div className="select_input">
              <label>Travellers & Class</label>
              <div
                className="input-design_input"
                onClick={() => toggleDropdown(index)}
                style={{ cursor: 'pointer' }}
              >
                {segment.adults} Adults, {segment.children} Children, {segment.infants} Infants, {travelClassLabel[segment.travelClass]}
              </div>

              {segment.showDropdown && (
                <div style={{
                  position: 'absolute',
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  zIndex: 10
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={segment.adults}
                      onChange={(e) => {
                        const updated = [...multiCitySegments];
                        updated[index].adults = parseInt(e.target.value);
                        setMultiCitySegments(updated);
                      }}
                      className="input-design_input"
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Children</label>
                    <input
                      type="number"
                      min="0"
                      value={segment.children}
                      onChange={(e) => {
                        const updated = [...multiCitySegments];
                        updated[index].children = parseInt(e.target.value);
                        setMultiCitySegments(updated);
                      }}
                      className="input-design_input"
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label>Infants</label>
                    <input
                      type="number"
                      min="0"
                      value={segment.infants}
                      onChange={(e) => {
                        const updated = [...multiCitySegments];
                        updated[index].infants = parseInt(e.target.value);
                        setMultiCitySegments(updated);
                      }}
                      className="input-design_input"
                    />
                  </div>
                  <div>
                    <label>Class</label>
                    <select
                      value={segment.travelClass}
                      onChange={(e) => {
                        const updated = [...multiCitySegments];
                        updated[index].travelClass = e.target.value;
                        setMultiCitySegments(updated);
                      }}
                      className="input-design_input"
                    >
                      <option value="economy">Economy</option>
                      <option value="premium">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveSegment(index)}
                style={{ position: 'absolute', right: -25, top: 5 }}
              >
                ❌
              </button>
            )}
          </div>
        ))}

        {/* Add Segment Button */}
        <div style={{ marginBottom: '20px' }}>
          <button type="button" onClick={handleAddSegment} className="add-segment-btn">
            + Add City
          </button>
        </div>
      </>
    ) : (
      // Oneway / Round-trip
      <div className="flex">
        <div className="select_input">
          <label>From</label>
          <Select
            className="input-design"
            options={airportOptions}
            value={airportOptions.find(opt => opt.value === fromCity)}
            onChange={(selected) => setFromCity(selected?.value || '')}
            placeholder="From"
            formatOptionLabel={formatAirportOption}
          />
        </div>

        <div className="select_input">
          <label>To</label>
          <Select
            className="input-design"
            options={airportOptions}
            value={airportOptions.find(opt => opt.value === toCity)}
            onChange={(selected) => setToCity(selected?.value || '')}
            placeholder="To"
            formatOptionLabel={formatAirportOption}
          />
        </div>

        <div className="select_input">
          <label>Departure</label>
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            dateFormat="dd MMM, yy"
            customInput={<CustomDateInput />}
          />
        </div>

        <div className="select_input">
          <label>Return</label>
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            dateFormat="dd MMM, yy"
            customInput={<CustomDateInputreturn disabled={tripType !== 'round trip'} />}
            disabled={tripType !== 'round trip'}
          />
        </div>

        <div className="select_input" ref={dropdownRef}>
          <label>Travellers & Class</label>
          <div
            className="input-design_input"
            onClick={() => setShowTravelDropdown(!showTravelDropdown)}
            style={{ cursor: 'pointer' }}
          >
            {adults} Adults, {children} Children, {infants} Infants, {travelClassLabel[travelClass]}
          </div>

          {showTravelDropdown && (
            <div style={{
              position: 'absolute',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              zIndex: 10
            }}>
              <div style={{ marginBottom: '10px' }}>
                <label>Adults</label>
                <input
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  className="input-design_input"
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Children</label>
                <input
                  type="number"
                  min="0"
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                  className="input-design_input"
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Infants</label>
                <input
                  type="number"
                  min="0"
                  value={infants}
                  onChange={(e) => setInfants(parseInt(e.target.value))}
                  className="input-design_input"
                />
              </div>
              <div>
                <label>Class</label>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="input-design_input"
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>

  <button type="submit" className="submit-btn-design">Search</button>
</form>


          )}

          {activeTab === 'hotel' && (
            <p style={{ textAlign: 'center', fontSize: '18px' }}>Hotel booking - Coming Soon</p>
          )}

          {activeTab === 'holiday' && (
            <div className="modify_form home_form">
              <form
                onSubmit={handleSearch}
                onReset={() => {
                  setSelectedCity('');
                  setSelectedMonth('');
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
                  <button type="submit" style={styles.submitBtn}>Search</button>
                 
                </div>
              </form>
            </div>

          )}
        </div>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee-content">
          <span>
            🚀 Welcome to FunForay! Book Flights, Hotels & Holiday Packages at the Best Price. ✈️🏖️
          </span>
          <span>
            🚀 Welcome to FunForay! Book Flights, Hotels & Holiday Packages at the Best Price. ✈️🏖️
          </span>
        </div>
      </div>





      {/* Holiday Packages Slider */}
      <div className='package_slider'>
        <h2 className='holiday'>Holiday Packages</h2>
        <Slider {...sliderSettings}>
          {packages.map(pkg => (
            <div key={pkg.id}>
              <Link to={`/packages/${pkg.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '10px', background: '#fff', boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
                  {pkg.images?.length > 0 && (
                    <img
                      src={`https://belltechwebtools.com/funforay/storage/app/public/${pkg.images[0]}`}
                      alt={pkg.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                  <h3 className='price'>{pkg.title}</h3>
                  <div className='cities_box'>
                    <img src='/images/Container.png' alt='Cities Icon' />
                    <p className='cities'>
                      {(() => {
                        try {
                          const cities = JSON.parse(pkg.city_name);
                          return Array.isArray(cities) ? cities.join(', ') : pkg.city_name;
                        } catch {
                          return pkg.city_name;
                        }
                      })()}
                    </p>
                  </div>
                  <p>₹{pkg.sale_price} / Person</p>
                  <div className='book_widgets'>
                    <div className='days'> <FaClock /> <p className='duration'>{Number(pkg.duration) + 1} Days</p></div>
                    <a href={`/packages/${pkg.id}`}>
                      <button type='button' className='btn'>Book now</button>
                    </a>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      <RecentGallery />
    </main>
  );
}

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
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/packages" element={<Packages />} />
         <Route path="/flights" element={<Flights />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route to="/api/search-flights">Search</Route> 
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
