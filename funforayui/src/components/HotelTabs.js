import React, { useState } from 'react';

const HotelTabs = ({ hotels = [] }) => {
  // Group hotels by rating (3, 4, 5)
  const groupedHotels = hotels.reduce((acc, hotel) => {
    const rating = parseInt(hotel.rating);
    if (!acc[rating]) acc[rating] = [];
    acc[rating].push(hotel);
    return acc;
  }, {});

  

  // Get only available rating groups
  const availableRatings = [3, 4, 5].filter(r => groupedHotels[r]);
  const [activeRating, setActiveRating] = useState(availableRatings[0]);

  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>Hotels by Rating</h3>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {availableRatings.map(rating => (
          <button
            key={rating}
            onClick={() => setActiveRating(rating)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeRating === rating ? '#007bff' : '#f0f0f0',
              color: activeRating === rating ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {rating} Star
          </button>
        ))}
      </div>

      {/* Tab Content: Hotel Table */}
      {groupedHotels[activeRating] && (
        <div>
          <h4
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              display: 'inline-block',
              marginBottom: '10px'
            }}
          >
            {activeRating} Star Hotels
          </h4>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>City</th>
                <th style={thStyle}>Rating</th>
                <th style={thStyle}>Image</th>
              </tr>
            </thead>
            <tbody>
              {groupedHotels[activeRating].map((hotel, idx) => {
                let hotelImages = [];
                try {
                  hotelImages = JSON.parse(hotel.images || '[]');
                } catch {}

                return (
                  <tr key={idx}>
                    <td style={tdStyle}>{hotel.name}</td>
                    <td style={tdStyle}>{hotel.city}</td>
                    <td style={tdStyle}>{'★'.repeat(hotel.rating)}</td>
                    <td style={tdStyle}>
                      {hotelImages[0] && (
                        <img
                          src={`https://belltechwebtools.com/funforay/storage/app/public/${hotelImages[0]}`}
                          alt={hotel.name}
                          style={{
                            width: '80px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  border: '1px solid #ccc',
  textAlign: 'center',
  padding: '10px',
  backgroundColor: '#f8f8f8'
};

const tdStyle = {
  border: '1px solid #ccc',
  textAlign: 'center',
  padding: '10px'
};

export default HotelTabs;
