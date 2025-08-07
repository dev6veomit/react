import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const FlightDetailsCard = ({ flight, seg }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('flight');
    const [showFareModal, setShowFareModal] = useState(false);
    const [selectedFareDetails, setSelectedFareDetails] = useState(null);

 const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tripType = searchParams.get('tripType'); // 
    return (
        <div className='flights_card'>
            <div className='card'>
                <div className='logo_side'>
                    <div>
                        <img
                            src={`/airlinesimages/${seg.Airline?.AirlineCode}.gif`}
                            alt={`${seg.Airline?.AirlineName} Logo`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/airlinesimages/default.gif'; // fallback if logo not found
                            }}
                        />

                    </div>
                    <div className='carft_det'>
                        <p className='AirlineName'>{seg.Airline?.AirlineName}</p>
                        <p className='AirlineCode'>{seg.Airline?.AirlineCode} | {seg.Airline?.FlightNumber}</p>
                        <p className='Craft'>{seg.Craft}</p>
                    </div>
                </div>
                <div>
                    <p className='CityName'>{seg.Origin?.Airport?.CityName} ({seg.Origin?.Airport?.CityCode})</p>
                    <p className='DepTime'>{new Date(seg.Origin?.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                    <p className='Depdate'>{new Date(seg.Origin?.DepTime).toLocaleDateString('en-GB')}</p>
                    <p className='Terminal'>Terminal {seg.Origin?.Airport?.Terminal}</p>
                </div>
                <div>
                    <p className='Duration'>
                        {`${String(Math.floor(seg.Duration / 60)).padStart(2, '0')}h ${String(seg.Duration % 60).padStart(2, '0')}m`}
                    </p>
                    <p className='StopOver'>{seg.StopOver === false ? 'Non Stop' : 'Stop'}</p>
                </div>
                <div>
                    <p className='CityName'>{seg.Destination?.Airport?.CityName} ({seg.Destination?.Airport?.CityCode})</p>
                    <p className='DepTime'>{new Date(seg.Destination?.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                    <p className='Depdate'>{new Date(seg.Destination?.ArrTime).toLocaleDateString('en-GB')}</p>
                    <p className='Terminal'>Terminal {seg.Destination?.Airport?.Terminal}</p>
                </div>
                <div>
                    <p className='fare'>₹ {flight.Fare?.OfferedFare?.toLocaleString('en-IN')}</p>
                    <p className='total'>Total</p>
                    <p className='FareClass'>{seg.Airline?.FareClass}</p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => {
                            setSelectedFareDetails(flight); // Pass current flight's data
                            setShowFareModal(true);
                        }}
                    >
                        More fare
                    </button>
                </div>



            </div>

            <div className='tab_flight_data'>
                <div className='view_details'>
                    <button type="button" className='btn' onClick={() => setShowDetails(!showDetails)}>
                        {showDetails ? 'Hide Details' : 'View Details'}
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className='flight_tabs_section'>
                    <div className='tab_headers'>
                        <button onClick={() => setActiveTab('flight')} className={activeTab === 'flight' ? 'active' : ''}>
                            Flight Details
                        </button>
                        <button onClick={() => setActiveTab('baggage')} className={activeTab === 'baggage' ? 'active' : ''}>
                            Baggage
                        </button>
                        <button onClick={() => setActiveTab('cancellation')} className={activeTab === 'cancellation' ? 'active' : ''}>
                            Cancellation
                        </button>
                        <button onClick={() => setActiveTab('fare')} className={activeTab === 'fare' ? 'active' : ''}>
                            Fare Summary
                        </button>
                    </div>

                    <div className='tab_content'>
                        {activeTab === 'flight' && (
                            <div className='card'>
                                <div className='logo_side'>
                                    <div>
                                        <img
                                            src={`/airlinesimages/${seg.Airline?.AirlineCode}.gif`}
                                            alt={`${seg.Airline?.AirlineName} Logo`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/airlinesimages/default.gif'; // fallback if logo not found
                                            }}
                                        />

                                    </div>
                                    <div className='carft_det'>
                                        <p className='AirlineName'>{seg.Airline?.AirlineName}</p>
                                        <p className='AirlineCode'>{seg.Airline?.AirlineCode} | {seg.Airline?.FlightNumber}</p>
                                        <p className='Craft'>{seg.Craft}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='CityName'>{seg.Origin?.Airport?.CityName} ({seg.Origin?.Airport?.CityCode})</p>
                                    <p className='DepTime'>{new Date(seg.Origin?.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                                    <p className='Depdate'>{new Date(seg.Origin?.DepTime).toLocaleDateString('en-GB')}</p>
                                    <p className='Terminal'>Terminal {seg.Origin?.Airport?.Terminal}</p>
                                </div>
                                <div>
                                    <p className='Duration'>
                                        {`${String(Math.floor(seg.Duration / 60)).padStart(2, '0')}h ${String(seg.Duration % 60).padStart(2, '0')}m`}
                                    </p>
                                    <p className='StopOver'>{seg.StopOver === false ? 'Non Stop' : 'Stop'}</p>
                                </div>
                                <div>
                                    <p className='CityName'>{seg.Destination?.Airport?.CityName} ({seg.Destination?.Airport?.CityCode})</p>
                                    <p className='DepTime'>{new Date(seg.Destination?.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                                    <p className='Depdate'>{new Date(seg.Destination?.ArrTime).toLocaleDateString('en-GB')}</p>
                                    <p className='Terminal'>Terminal {seg.Destination?.Airport?.Terminal}</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'baggage' && (
                            <div>
                                <table className="baggage-table">
                                    <thead>
                                        <tr>
                                            <th>Airline</th>
                                            <th>Check-in Baggage</th>
                                            <th>Cabin Baggage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{seg.Airline?.AirlineName || 'N/A'}</td>
                                            <td>{seg.Baggage || 'N/A'}</td>
                                            <td>{seg.CabinBaggage || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'cancellation' && (
                            <div>
                                <h4>Cancellation / Reissue Rules</h4>

                                {Array.isArray(flight?.MiniFareRules?.[0]) && flight.MiniFareRules[0].length > 0 ? (
                                    <table className="fare-table">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Journey</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Unit</th>
                                                <th>Fee</th>
                                                <th>Online Refund</th>
                                                <th>Online Reissue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {flight.MiniFareRules[0].map((rule, index) => (
                                                <tr key={index}>
                                                    <td>{rule?.Type || '-'}</td>
                                                    <td>{rule?.JourneyPoints || '-'}</td>
                                                    <td>{rule?.From || '-'}</td>
                                                    <td>{rule?.To || '-'}</td>
                                                    <td>{rule?.Unit || '-'}</td>
                                                    <td>{rule?.Details || '-'}</td>
                                                    <td>{rule?.OnlineRefundAllowed ? 'Allowed' : 'Not Allowed'}</td>
                                                    <td>{rule?.OnlineReissueAllowed ? 'Allowed' : 'Not Allowed'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No cancellation or reissue rules available.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'fare' && (
                            <div>
                                <h4>Fare Summary</h4>

                                {flight?.FareBreakdown?.length > 0 ? (
                                    <table className="fare-table">
                                        <thead>
                                            <tr>
                                                <th>Passenger Type</th>
                                                <th>Base Fare</th>
                                                <th>Tax</th>
                                                <th>PG Charges</th>
                                                <th>Additional Fees (Offered)</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {flight.FareBreakdown.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {item.PassengerType === 1
                                                            ? 'Adult'
                                                            : item.PassengerType === 2
                                                                ? 'Child'
                                                                : 'Infant'}
                                                    </td>
                                                    <td>₹{item.BaseFare?.toLocaleString('en-IN') || 0}</td>
                                                    <td>₹{item.Tax?.toLocaleString('en-IN') || 0}</td>
                                                    <td>₹{item.PGCharge?.toLocaleString('en-IN') || 0}</td>
                                                    <td>₹{item.AdditionalTxnFeeOfrd?.toLocaleString('en-IN') || 0}</td>
                                                    <td>
                                                        ₹
                                                        {(
                                                            item.BaseFare +
                                                            item.Tax +
                                                            item.PGCharge +
                                                            item.AdditionalTxnFeeOfrd
                                                        )?.toLocaleString('en-IN')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No fare breakdown available.</p>
                                )}

                                <div className="fare-total" style={{ marginTop: '1rem' }}>
                                    <strong>Total Fare:</strong>{' '}
                                    ₹{flight.Fare?.OfferedFare?.toLocaleString('en-IN') || 0}
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            )}


           {showFareModal && selectedFareDetails && (
  <div className="fare-modal-overlay" onClick={() => setShowFareModal(false)}>
    <div className="fare-modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setShowFareModal(false)}>×</button>

      {/* Flight Header */}
      <div className="flight-summary-bar">
        <div className="logo-section">
          <img
            src={`/airlinesimages/${seg.Airline?.AirlineCode}.gif`}
            alt={`${seg.Airline?.AirlineName} Logo`}
            className="airline-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/airlinesimages/default.gif';
            }}
          />
          <div className="airline-text">
            <strong>{seg.Airline?.AirlineName}</strong>
            <span className="route">
              {seg.Origin?.Airport?.CityName} → {seg.Destination?.Airport?.CityName}
            </span>
            <span className="timing">
              {new Date(seg.Origin?.DepTime).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: '2-digit'
              })}{' '}
              | Departure at {new Date(seg.Origin?.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}{' '}
              | Arrival at {new Date(seg.Destination?.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
        </div>
      </div>

      {/* Fare Cards */}
      <div className="fare-cards">
        {['SAVER', 'FARE', 'FLEXI'].map((type, idx) => (
          <div className="fare-card" key={idx}>
            <div className="fare-price">
              ₹{selectedFareDetails?.Fare?.OfferedFare?.toLocaleString('en-IN')}
              <span className="per-adult">Per Adult</span>
            </div>
            <div className="fare-type">{type}</div>
            <div className="fare-section">
              <strong>Baggage</strong>
              <p>7 Kgs Cabin Baggage</p>
              <p>15 Kgs Check-in Baggage</p>
            </div>
            <div className="fare-section">
              <strong>Seats & Meals</strong>
              <p>{type === 'FLEXI' ? 'Free Seats' : 'Chargeable Seats'}</p>
              <p>{type === 'FLEXI' ? 'Complimentary Meals' : 'Chargeable Meals'}</p>
            </div>
            <div className="fare-section">
              <strong>Change</strong>
              <p>Lorem ipsum dolor sit amet</p>
              <p>Aliquam a eros fermentum</p>
            </div>
            <div className="fare-section">
              <strong>Cancellation</strong>
              <p>Lorem ipsum dolor sit amet</p>
              <p>Aliquam a eros fermentum</p>
            </div>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
              {tripType === 'round trip' ? 'Select' : 'Book Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}


        </div>


    );
};

export default FlightDetailsCard;
