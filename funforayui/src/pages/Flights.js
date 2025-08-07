import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchAirports } from '../api/apiService';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightDetailsCard from '../components/FlightDetailsCard';


const Flights = () => {
    const [selectedStops, setSelectedStops] = useState([]);
    const [form, setForm] = useState({
        journey_type: '1',
        origin: '',
        destination: '',
        departure_date: '',
        arrival_date: '',
        cabin_class: '1',
        adults: 1,
        children: 0,
        infants: 0,
        direct_flight: false,
        one_stop_flight: false,
    });
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('flight');
    const [filterTab, setFilterTab] = useState('onward'); // 'onward' or 'return'

    const [airlineOptions, setAirlineOptions] = useState([]);
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const handleAirlineChange = (e) => {
        const { value, checked } = e.target;
        setSelectedAirlines(prev =>
            checked ? [...prev, value] : prev.filter(a => a !== value)
        );
    };




    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [priceRange, setPriceRange] = useState([0, 100000]);

    const [departureTimes, setDepartureTimes] = useState([]);
    const handleDepartureTimeChange = (e) => {
        const value = e.target.value;
        setDepartureTimes(prev =>
            prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
        );
    };

    const [arrivalTimes, setArrivalTimes] = useState([]);
    const handleArrivalTimeChange = (e) => {
        const value = e.target.value;
        setArrivalTimes(prev =>
            prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
        );
    };

    const [departureAirports, setDepartureAirports] = useState([]);
    const [selectedDepartureAirports, setSelectedDepartureAirports] = useState([]);
    const handleDepartureAirportChange = (e) => {
        const value = e.target.value;
        setSelectedDepartureAirports(prev =>
            prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]
        );
    };

    const [arrivalAirports, setArrivalAirports] = useState([]);
    const [selectedArrivalAirports, setSelectedArrivalAirports] = useState([]);
    const handleArrivalAirportChange = (e) => {
        const value = e.target.value;
        setSelectedArrivalAirports(prev =>
            prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]
        );
    };




    const [airportOptions, setAirportOptions] = useState([]);
    const dropdownRef = useRef(null);
    const [showTravelDropdown, setShowTravelDropdown] = useState(false);
    const [flightResults, setFlightResults] = useState([]);
    const [returnResults, setReturnResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    let urlTripType = params.get('tripType') || 'oneway';
    if (['round+trip', 'round_trip', 'roundtrip'].includes(urlTripType)) urlTripType = 'round trip';

    const [tripType, setTripType] = useState(urlTripType);
    const [multiCitySegments, setMultiCitySegments] = useState([{
        from: '', to: '', departureDate: null, returnDate: null, travelers: 1, travelClass: 'economy', showDropdown: false
    }]);

    const travelClassLabel = {
        '1': 'Economy', '2': 'Premium Economy', '3': 'Business', '4': 'First Class',
        economy: 'Economy', premium: 'Premium Economy', business: 'Business', first: 'First Class'
    };

    const formatAirportOption = ({ label, value }) => (
        <div><strong>{label}</strong> <small>({value})</small></div>
    );

    const handleAddSegment = () => {
        setMultiCitySegments(prev => [...prev, {
            from: '', to: '', departureDate: null, returnDate: null, travelers: 1, travelClass: 'economy', showDropdown: false
        }]);
    };

    const handleRemoveSegment = (index) => {
        setMultiCitySegments(prev => prev.filter((_, i) => i !== index));
    };

    const toggleDropdown = (index) => {
        setMultiCitySegments(prev =>
            prev.map((seg, i) => ({ ...seg, showDropdown: i === index ? !seg.showDropdown : false }))
        );
    };

    const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
        <div className="input-design_input" onClick={onClick} ref={ref}>
            {value || 'Select Date'}
        </div>
    ));

    const CustomDateInputreturn = React.forwardRef(({ value, onClick }, ref) => (
        <div className="input-design_input" onClick={onClick} ref={ref}>
            {value || 'Select Return'}
        </div>
    ));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const fetchFlights = async (payload) => {
        setLoading(true);
        try {
            const response = await axios.post('https://ff.veomit.com/backend/api/search-flights', payload);
            const results = response.data?.Response?.Results || [];
            setFlightResults(results[0] || []);
            setReturnResults(results[1] || []);
            console.log('Flight search data:', results);
        } catch (err) {
            console.error('Flight search failed:', err.message);
        } finally {
            setLoading(false);
        }
    };


    const buildPayload = (data) => ({
        journey_type: parseInt(data.journey_type),
        origin: data.origin,
        destination: data.destination,
        departure_date: data.departure_date,
        arrival_date: data.arrival_date,
        cabin_class: parseInt(data.cabin_class),
        adults: parseInt(data.adults),
        children: parseInt(data.children),
        infants: parseInt(data.infants),
        direct_flight: data.direct_flight,
        one_stop_flight: data.one_stop_flight,
        preferred_airlines: '',
        sources: '',
    });


    const handleFlightSubmit = async (e) => {
        e.preventDefault();
        const payload = buildPayload(form);
        fetchFlights(payload);
    };

    //      const handleFlightSubmit = (e) => {
    //   e.preventDefault();
    //   const queryParams = new URLSearchParams({
    //     tripType: tripType,
    //     from: form.origin,
    //     to: form.destination,
    //     departureDate: form.departure_date,
    //     returnDate: form.arrival_date,
    //     travelClass: form.cabin_class,
    //     adults: form.adults,
    //     children: form.children,
    //     infants: form.infants,
    //   });

    const mapCabinClass = (type) => {
        if (!type) return '1';
        const map = {
            economy: '1', premium: '2', business: '3', first: '4'
        };
        return map[type.toLowerCase()] || '1';
    };

    const formatDuration = (min) => {
        if (!min) return 'N/A';
        const h = Math.floor(min / 60);
        const m = min % 60;
        return `${h}h ${m}m`;
    };

    const handleStopChange = (e) => {
        const { value, checked } = e.target;
        setSelectedStops(prev =>
            checked ? [...prev, value] : prev.filter(s => s !== value)
        );
    };


    useEffect(() => {
        fetchAirports().then(setAirportOptions).catch(() => setAirportOptions([]));
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTravelDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = {
            journey_type: params.get('tripType') === 'round trip' ? '2' : '1',
            origin: params.get('from') || '',
            destination: params.get('to') || '',
            departure_date: params.get('departureDate') || '',
            arrival_date: params.get('returnDate') || '',
            cabin_class: mapCabinClass(params.get('travelClass')),

            // ✅ Updated to fetch individual values
            adults: params.get('adults') || '1',
            children: params.get('children') || '0',
            infants: params.get('infants') || '0',

            direct_flight: false,
            one_stop_flight: false,
        };

        if (query.origin && query.destination && query.departure_date) {
            setForm(query);
            fetchFlights(buildPayload(query));
        }
    }, []);


    useEffect(() => {
        if (flightResults.length > 0) {
            const airlines = new Set();
            const depAirports = new Set();
            const arrAirports = new Set();
            let min = Infinity;
            let max = -Infinity;

            flightResults.forEach(f => {
                f.Segments?.flat()?.forEach(seg => {
                    airlines.add(seg.Airline?.AirlineName);
                    depAirports.add(seg.Origin?.Airport?.AirportName);
                    arrAirports.add(seg.Destination?.Airport?.AirportName);
                    const fare = f.Fare?.PublishedFare;
                    if (fare) {
                        min = Math.min(min, fare);
                        max = Math.max(max, fare);
                    }
                });
            });

            setAirlineOptions(Array.from(airlines));
            setDepartureAirports(Array.from(depAirports));
            setArrivalAirports(Array.from(arrAirports));
            setMinPrice(min);
            setMaxPrice(max);
            setPriceRange([min, max]);
        }
    }, [flightResults]);

    const filteredResults = (filterTab === 'onward' ? flightResults : returnResults)
  .filter(flight => {
    // Flatten all segments
    const allSegments = flight.Segments?.flat() ?? [];
    if (allSegments.length === 0) return false;

    // Use first segment for timing & airline checks
    const firstSeg = allSegments[0];
    const stopCount = allSegments.length - 1;
    const stopLabel = stopCount === 0 ? 'Non Stop' : `${stopCount} Stop`;

    // 1. Stops
    if (selectedStops.length > 0 && !selectedStops.includes(stopLabel)) {
      return false;
    }

    // 2. Airlines
    if (selectedAirlines.length > 0 &&
        !allSegments.some(seg => selectedAirlines.includes(seg.Airline?.AirlineName))) {
      return false;
    }

    // 3. Price
    const fare = flight.Fare?.OfferedFare;
    if (fare < priceRange[0] || fare > priceRange[1]) {
      return false;
    }

    const getTimeSlot = (hour) => {
      if (hour < 6) return 'Before 6AM';
      if (hour < 12) return '6AM to 12PM';
      if (hour < 18) return '12PM to 6PM';
      return 'After 6PM';
    };

    // 4. Departure Time
    if (departureTimes.length > 0) {
      const depHour = new Date(firstSeg.Origin.DepTime).getHours();
      if (!departureTimes.includes(getTimeSlot(depHour))) {
        return false;
      }
    }

    // 5. Arrival Time
    if (arrivalTimes.length > 0) {
      const arrHour = new Date(firstSeg.Destination.ArrTime).getHours();
      if (!arrivalTimes.includes(getTimeSlot(arrHour))) {
        return false;
      }
    }

    // 6. Departure Airport
    if (selectedDepartureAirports.length > 0 &&
        !allSegments.some(seg => selectedDepartureAirports.includes(seg.Origin.Airport.AirportName))
    ) {
      return false;
    }

    // 7. Arrival Airport
    if (selectedArrivalAirports.length > 0 &&
        !allSegments.some(seg => selectedArrivalAirports.includes(seg.Destination.Airport.AirportName))
    ) {
      return false;
    }

    return true;
  });




    return (
        <div>
            <div className="formmain">

                <form className="form-design" onSubmit={handleFlightSubmit}>
                    <div className="flight_design">
                        {/* Trip Type Radio Buttons */}
                        <div className="mb-4 radio_design">
                            {['oneway', 'round trip', 'multicity'].map((type) => (
                                <label key={type} className="mr-4">
                                    <input
                                        type="radio"
                                        name="journey_type"
                                        value={type}
                                        checked={tripType === type}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setTripType(value);
                                            if (value === 'multicity') {
                                                setMultiCitySegments([
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
                                            }
                                        }}
                                    />
                                    {' '}
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </label>
                            ))}
                        </div>

                        {/* MultiCity Mode */}
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
                                                {segment.travelers} Traveler{segment.travelers > 1 ? 's' : ''}, {travelClassLabel[segment.travelClass]}
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
                                                        <label>No. of Travelers</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={segment.travelers}
                                                            onChange={(e) => {
                                                                const updated = [...multiCitySegments];
                                                                updated[index].travelers = parseInt(e.target.value);
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

                                <div style={{ marginBottom: '20px' }}>
                                    <button type="button" onClick={handleAddSegment} className="add-segment-btn">
                                        + Add City
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Oneway / Roundtrip Mode
                            <div className="flex">
                                <div className="select_input">
                                    <label>From</label>
                                    <Select
                                        name="origin"
                                        className="input-design"
                                        options={airportOptions}
                                        value={airportOptions.find(opt => opt.value === form.origin)}
                                        onChange={(selected) => setForm((prev) => ({ ...prev, origin: selected?.value || '' }))}
                                        placeholder="From"
                                        formatOptionLabel={formatAirportOption}
                                    />
                                </div>

                                <div className="select_input">
                                    <label>To</label>
                                    <Select
                                        name="destination"
                                        className="input-design"
                                        options={airportOptions}
                                        value={airportOptions.find(opt => opt.value === form.destination)}
                                        onChange={(selected) => setForm((prev) => ({ ...prev, destination: selected?.value || '' }))}
                                        placeholder="To"
                                        formatOptionLabel={formatAirportOption}
                                    />
                                </div>

                                <div className="select_input">
                                    <label>Departure</label>
                                    <DatePicker
                                        selected={form.departure_date}
                                        onChange={(date) => setForm((prev) => ({ ...prev, departure_date: date }))}
                                        dateFormat="dd MMM, yy"
                                        customInput={<CustomDateInput />}
                                    />
                                </div>

                                <div className="select_input">
                                    <label>Return</label>
                                    <DatePicker
                                        selected={form.arrival_date}
                                        onChange={(date) => setForm((prev) => ({ ...prev, arrival_date: date }))}
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
                                        {form.adults} Traveler{form.adults > 1 ? 's' : ''}, {travelClassLabel[form.cabin_class]}
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
                                                    name="adults"
                                                    min="1"
                                                    value={form.adults}
                                                    onChange={(e) => setForm((prev) => ({ ...prev, adults: parseInt(e.target.value) }))}
                                                    className="input-design_input"
                                                />
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label>Children</label>
                                                <input
                                                    type="number"
                                                    name="children"
                                                    min="0"
                                                    value={form.children}
                                                    onChange={(e) => setForm((prev) => ({ ...prev, children: parseInt(e.target.value) }))}
                                                    className="input-design_input"
                                                />
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label>Infants</label>
                                                <input
                                                    type="number"
                                                    name="infants"
                                                    min="0"
                                                    value={form.infants}
                                                    onChange={(e) => setForm((prev) => ({ ...prev, infants: parseInt(e.target.value) }))}
                                                    className="input-design_input"
                                                />
                                            </div>
                                            <div>
                                                <label>Class</label>
                                                <select
                                                    name="cabin_class"
                                                    value={form.cabin_class}
                                                    onChange={(e) => setForm((prev) => ({ ...prev, cabin_class: e.target.value }))}
                                                    className="input-design_input"
                                                >
                                                    <option value="1">Economy</option>
                                                    <option value="2">Premium Economy</option>
                                                    <option value="3">Business</option>
                                                    <option value="4">First Class</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button type="submit" className="submit-btn-design" disabled={loading}>
                        {loading ? 'Searching...' : 'Search Flights'}
                    </button>
                </form>
            </div>


            <div className='flight_design_page'>
                {/* 25% - Filter Section */}
               <div className='filter_sidebar'>
  <h3 className='fil_title'>Filters</h3>

  {/* Show buttons only for round trip */}
  {tripType === 'round trip' && (
    <div className='filter_tabs'>
      <button
        className={filterTab === 'onward' ? 'active' : ''}
        onClick={() => setFilterTab('onward')}
      >
        Onward Filters
      </button>
      <button
        className={filterTab === 'return' ? 'active' : ''}
        onClick={() => setFilterTab('return')}
      >
        Return Filters
      </button>
    </div>
  )}

  {/* Show current filter tab title */}
  {tripType === 'round trip' && (
    <p style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333',marginLeft:'25px' }}>
     {filterTab === 'onward' ? 'Onward Filters' : 'Return Filters'}
    </p>
  )}

  {/* Show filters for oneway or active tab in round trip */}
  {(tripType === 'oneway' || filterTab === 'onward' || filterTab === 'return') && (
    <>
      {/* Stops */}
      <div className='filter_design'>
        <p>Stops</p>
        {['Non Stop', '1 Stop', '2 Stop'].map((stop, i) => (
          <div key={i}>
            <label>
              <input
                type="checkbox"
                value={stop}
                checked={selectedStops.includes(stop)}
                onChange={handleStopChange}
              />
              {stop}
            </label>
          </div>
        ))}
      </div>

      {/* Airlines */}
      <div className='filter_design'>
        <p>Airlines</p>
        {airlineOptions.slice(0, 5).map((airline, i) => (
          <div key={i}>
            <label>
              <input
                type="checkbox"
                value={airline}
                checked={selectedAirlines.includes(airline)}
                onChange={handleAirlineChange}
              />
              {airline}
            </label>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className='filter_design'>
        <p>Price Range</p>
        <div className='range_style'>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([minPrice, parseInt(e.target.value)])}
          />
          <label>₹{priceRange[0]} - ₹{priceRange[1]}</label>
        </div>
      </div>

      {/* Departure Time */}
      <div className='filter_design'>
        <p>Departure Time</p>
        {['Before 6AM', '6AM to 12PM', '12PM to 6PM', 'After 6PM'].map((slot, i) => (
          <div key={i}>
            <label>
              <input
                type="checkbox"
                value={slot}
                checked={departureTimes.includes(slot)}
                onChange={handleDepartureTimeChange}
              />
              {slot}
            </label>
          </div>
        ))}
      </div>

      {/* Arrival Time */}
      <div className='filter_design'>
        <p>Arrival Time</p>
        {['Before 6AM', '6AM to 12PM', '12PM to 6PM', 'After 6PM'].map((slot, i) => (
          <div key={i}>
            <label>
              <input
                type="checkbox"
                value={slot}
                checked={arrivalTimes.includes(slot)}
                onChange={handleArrivalTimeChange}
              />
              {slot}
            </label>
          </div>
        ))}
      </div>

      {/* Departure Airports */}
     {/* Departure Airports */}
<div className='filter_design'>
  <p>
    {tripType === 'round trip' && filterTab === 'return'
      ? 'Arrival Airports (for Return)'
      : 'Departure Airports'}
  </p>
  {(tripType === 'round trip' && filterTab === 'return'
    ? arrivalAirports
    : departureAirports
  )
    .slice(0, 3)
    .map((airport, i) => (
      <div key={i}>
        <label>
          <input
            type="checkbox"
            value={airport}
            checked={
              (tripType === 'round trip' && filterTab === 'return'
                ? selectedDepartureAirports
                : selectedDepartureAirports
              ).includes(airport)
            }
            onChange={handleDepartureAirportChange}
          />
          {airport}
        </label>
      </div>
    ))}
</div>

{/* Arrival Airports */}
<div className='filter_design'>
  <p>
    {tripType === 'round trip' && filterTab === 'return'
      ? 'Departure Airports (for Return)'
      : 'Arrival Airports'}
  </p>
  {(tripType === 'round trip' && filterTab === 'return'
    ? departureAirports
    : arrivalAirports
  )
    .slice(0, 3)
    .map((airport, i) => (
      <div key={i}>
        <label>
          <input
            type="checkbox"
            value={airport}
            checked={
              (tripType === 'round trip' && filterTab === 'return'
                ? selectedArrivalAirports
                : selectedArrivalAirports
              ).includes(airport)
            }
            onChange={handleArrivalAirportChange}
          />
          {airport}
        </label>
      </div>
    ))}
</div>

    </>
  )}
</div>



                {/* 75% - Flight Results Section */}
               <div className="flights_data">
  {loading ? (
    <p>Loading...</p>
  ) : tripType === 'oneway' ? (
    filteredResults.length > 0 ? (
      <>
        {filteredResults.map((f, i) => (
          <div key={i}>
            {f.Segments?.flat()?.map((seg, j) => (
              <FlightDetailsCard key={`${i}-${j}`} flight={f} seg={seg} />
            ))}
          </div>
        ))}
      </>
    ) : (
      <p>No flights found.</p>
    )
  ) : tripType === 'round trip' ? (
    // Always show both columns, but filter data based on filterTab
    <div className="round_trip_flights">
      {/* Onward Column */}
      <div className="onward_column">
        {/* <h4>Onward Flights</h4> */}
        {(filterTab === 'onward' ? filteredResults : flightResults)?.length > 0 ? (
          (filterTab === 'onward' ? filteredResults : flightResults).map((f, i) => (
            <div key={`onward-${i}`}>
              {f.Segments?.flat()?.map((seg, j) => (
                <FlightDetailsCard
                  key={`onward-${i}-${j}`}
                  flight={f}
                  seg={seg}
                  tripType="round trip"
                />
              ))}
            </div>
          ))
        ) : (
          <p>No onward flights found.</p>
        )}
      </div>

      {/* Return Column */}
      <div className="return_column">
        {/* <h4>Return Flights</h4> */}
        {(filterTab === 'return' ? filteredResults : returnResults)?.length > 0 ? (
          (filterTab === 'return' ? filteredResults : returnResults).map((f, i) => (
            <div key={`return-${i}`}>
              {f.Segments?.flat()?.map((seg, j) => (
                <FlightDetailsCard
                  key={`return-${i}-${j}`}
                  flight={f}
                  seg={seg}
                  tripType="round trip"
                />
              ))}
            </div>
          ))
        ) : (
          <p>No return flights found.</p>
        )}
      </div>
    </div>
  ) : (
    <p>No flights found.</p>
  )}
</div>




            </div>
        </div>

    );
};

export default Flights;
