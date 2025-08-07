// src/components/PackageCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// (optional if you want to split styling)
import {
  FaPlane, FaHotel, FaBinoculars, FaShuttleVan, FaPassport,
  FaUtensils, FaUserTie, FaUser, FaFileInvoiceDollar, FaHeartbeat
} from 'react-icons/fa';



const inclusionIcons = {
  flights: FaPlane,
  hotels: FaHotel,
  sightseeing: FaBinoculars,
  transfers: FaShuttleVan,
  visa: FaPassport,
  meals: FaUtensils,
  'tour manager': FaUserTie,
  guide: FaUser,
  taxes: FaFileInvoiceDollar,
  insurance: FaHeartbeat,
};

const PackageCard = ({ pkg }) => {
  if (!pkg) return null;

  const rating = parseFloat(pkg.customer_rating || 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let cities = pkg.city_name;
  try {
    const parsed = JSON.parse(pkg.city_name);
    cities = Array.isArray(parsed) ? parsed.join(', ') : pkg.city_name;
  } catch (e) { }

  let doublePrice = 0;
  let withFlightPrice = parseInt(pkg.with_flight_regular_price || '0', 10);
  try {
    const hotelRatings = pkg.hotel_ratings || [];
    const threeStarHotel = hotelRatings.find(h => h.rating === '3');
    const doubleRoom = threeStarHotel?.room_types?.find(rt => rt.room_type === 'Double');
    doublePrice = parseInt(doubleRoom?.adults?.replace(/[^0-9]/g, '') || '0', 10);
  } catch (e) {
    console.error('Hotel pricing parse error:', e);
  }

  const hasFlight = pkg.with_flight === true || pkg.with_flight === 'true';

  return (
    <div className='package_card'>
      {pkg.images?.length > 0 && (
        <img
          src={`https://belltechwebtools.com/funforay/storage/app/public/${pkg.images[0]}`}
          alt={pkg.title}
          className='package_image'
        />
      )}

      <div className='content_div'>
        <h3 className='title'>{pkg.title}</h3>

        <div className='card_data'>
          <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
            {[...Array(fullStars)].map((_, i) => (
              <span key={`full-${i}`} style={{ color: '#E2068C', fontSize: '22px' }}>★</span>
            ))}
            {hasHalfStar && <span style={{ color: '#E2068C', fontSize: '22px' }}>☆</span>}
            {[...Array(emptyStars)].map((_, i) => (
              <span key={`empty-${i}`} style={{ color: '#ccc', fontSize: '22px' }}>★</span>
            ))}
          </div>

          <div className='book_widgets'>
            <div className='days'>
              <p className='duration'>{pkg.duration} Nights</p>
            </div>
          </div>
        </div>

        <div className='cities_box'>
          <p className='cities' style={{ marginLeft: '8px' }}>{pkg.package_heading}</p>
        </div>

        <div className='package_details'>
          <p>Package Type<br /><span>{pkg.package_type}</span></p>
          <p>Package Format<br /><span>{pkg.package_format}</span></p>
          <p>Package Code<br /><span>{pkg.package_code}</span></p>
        </div>

        <div className="tab_titles" style={{ display: 'flex', gap: '0px' }}>
          {pkg.inclusions_option && (
            <div className="included-options mt-3">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {JSON.parse(pkg.inclusions_option).map((item, index) => {
                  const key = item.toLowerCase().trim(); // Normalize key
                  const IconComponent = inclusionIcons[key];

                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#006CB8',
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '13px',
                        textTransform: 'capitalize',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {IconComponent && <IconComponent style={{ fontSize: '14px' }} />}
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flights_button">
          {hasFlight && withFlightPrice > 0 && doublePrice > 0 && (
            <Link
              to={`/packages/${pkg.id}?flight=1`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <button className="with_btn">
                With Flight
                <span>
                  <span className="pricee">₹{withFlightPrice + doublePrice}</span><br />
                  <span className="adut">Starting per Adult</span>
                </span>
              </button>
            </Link>
          )}

          {doublePrice > 0 && (
            <Link
              to={`/packages/${pkg.id}?flight=0`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <button className="with_btn">
                Without Flight
                <span>
                  <span className="pricee">₹{doublePrice}</span><br />
                  <span className="adut">Starting per Adult</span>
                </span>
              </button>
            </Link>
          )}
        </div>


      </div>
    </div>
  );
};

export default PackageCard;
