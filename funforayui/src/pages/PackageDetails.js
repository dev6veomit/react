import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min';
import { FaFilePdf } from 'react-icons/fa';

import { useSearchParams } from 'react-router-dom';
import HotelTabs from '../components/HotelTabs'; // Adjust path if different



function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [activeTab, setActiveTab] = useState('sightseeing');
  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');

  const [searchParams] = useSearchParams();
  const isWithFlight = searchParams.get('flight') === '1'; // true if flight=1
  const [activeRating, setActiveRating] = useState(3); // Default to 3-star


  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMessage('Please enter a valid coupon code.');
      setIsCouponApplied(false);
      return;
    }

    if (couponCode.toLowerCase() === 'discount10') {
      setIsCouponApplied(true);
      setCouponMessage('Coupon applied successfully!');
    } else {
      setIsCouponApplied(false);
      setCouponMessage('Invalid coupon code.');
    }
  };

  const groupedHotels = {
    3: [],
    4: [],
    5: [],
  };

  hotels.forEach((hotel) => {
    if (hotel.rating === 3 || hotel.rating === 4 || hotel.rating === 5) {
      groupedHotels[hotel.rating].push(hotel);
    }
  });
    
  // const InsertFlightIcon = () => {
  //   useEffect(() => {
  //     const container = document.querySelector('.maindiv');
  //     const children = container?.children;

  //     if (container && children.length >= 2) {
  //       const flightDiv = document.createElement('div');
  //       flightDiv.className = 'flight-icon-div';

  //       const img = document.createElement('img');
  //       img.src = '/images/flights.png'; // ✅ use public path
  //       img.alt = 'Flight Icon';
  //       img.style.width = '30px';
  //       img.style.height = '30px';

  //       flightDiv.appendChild(img);
  //       container.insertBefore(flightDiv, children[1]); // insert between 1st and 2nd child
  //     }
  //   }, []);
  // };

  // 👉 handlers inside the component (but above return)
  //  const handleDownload = () => {
  //   const element = document.getElementById('pdf-content');
  //   const opt = {
  //     margin: 0.5,
  //     filename: 'package-details.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: {
  //       scale: 2,
  //       useCORS: true,       // IMPORTANT
  //       allowTaint: false
  //     },
  //     jsPDF: { unit: 'px', format: 'a4', orientation: 'portrait' }
  //   };

  //   html2pdf().set(opt).from(element).save();
  // };

  const handleDownload = async () => {
    const originalTab = activeTab;

    // Show all tab content temporarily
    setActiveTab('showAll');

    // Allow DOM to update before capturing
    await new Promise(resolve => setTimeout(resolve, 500));

    const element = document.getElementById('pdf-content');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${pkg?.title || 'package-details'}.pdf`);


    // Restore original tab
    setActiveTab(originalTab);
  };


  const handleShare = async (room) => {
    const element = document.getElementById('pdf-content');
    const opt = {
      margin: 0.5,
      filename: 'package-details.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a1', orientation: 'portrait' }
    };

    try {
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
      const pdfFile = new File([pdfBlob], 'package-details.pdf', { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: 'Package Details',
          text: 'Here are the package details.',
          files: [pdfFile],
        });
      } else {
        // Fallback: Download PDF and offer share options
        const url = URL.createObjectURL(pdfBlob);

        // Trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'package-details.pdf';
        link.click();

        // Prompt user with options
        const confirmShare = window.confirm("PDF downloaded. Would you like to share it via WhatsApp or Email?");
        if (confirmShare) {
          const message = encodeURIComponent("Here are the package details.");
          const whatsappURL = `https://wa.me/?text=${message}`;
          const emailURL = `mailto:?subject=Package Details&body=${message}`;

          const choice = prompt("Type 'w' for WhatsApp, 'e' for Email:");
          if (choice?.toLowerCase() === 'w') {
            window.open(whatsappURL, '_blank');
          } else if (choice?.toLowerCase() === 'e') {
            window.location.href = emailURL;
          }
        }
      }
    } catch (error) {
      console.error('PDF share error:', error);
      alert('An error occurred while trying to share the PDF.');
    }
  };



  const tabFields = [
    { key: 'sightseeing', label: 'Sightseeing' },
    ...(pkg?.with_flight === true || pkg?.with_flight === 'true'
      ? [{ key: 'flights', label: 'Flights' }]
      : []),
    { key: 'hotels', label: 'Hotels' },
    { key: 'transfers', label: 'Transfers' },
    { key: 'meals', label: 'Meals' },
    { key: 'inclusions', label: 'Inclusions' },
    { key: 'exclusions', label: 'Exclusions' },
    { key: 'cancellation_policy', label: 'Cancellation Policy' },
    { key: 'payment_terms', label: 'Payment Terms' },
    { key: 'supplements', label: 'Supplements' },

  ];


  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const pkgRes = await fetch(`https://belltechwebtools.com/funforay/api/packages/${id}`);
        const pkgData = await pkgRes.json();
        if (pkgData.success && pkgData.data) {
          setPkg(pkgData.data);
        }

        if (pkgData.data.hotels && Array.isArray(pkgData.data.hotels)) {
          const hotelIds = pkgData.data.hotels.map(id => `ids[]=${id}`).join('&');
          const hotelsRes = await fetch(`https://belltechwebtools.com/funforay/api/hotels?${hotelIds}`);
          const hotelsData = await hotelsRes.json();
          if (hotelsData.success && hotelsData.data) {
            setHotels(hotelsData.data);
          }
        }

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }

    fetchData();
  }, [id]);

  if (!pkg) return <div>Loading...</div>;
  const images = pkg.images || [];

  // Price calculations
  let additionalPrice = 0;
  const hotelRatings = pkg.hotel_ratings;

  if (Array.isArray(hotelRatings)) {
    for (const hotel of hotelRatings) {
      if (hotel.rating === '3') {
        for (const room of hotel.room_types) {
          if (room.room_type?.toLowerCase() === 'double') {
            additionalPrice = Number(room.adults) || 0;
            break;
          }
        }
        break;
      }
    }
  }

  const withFlightBasePrice = Number(pkg.with_flight_regular_price) || 0;
  const withFlightTotalSalePrice = withFlightBasePrice + additionalPrice;

  // const filteredHotels = Array.isArray(pkg.hotels)
  //   ? hotels.filter(hotel => pkg.hotels.includes(String(hotel.id)))
  //   : [];

  // const mainSettings = {
  //   asNavFor: nav2,
  //   ref: slider1,
  //   arrows: false,
  //   infinite: true,
  //   slidesToShow: 1,
  //   swipeToSlide: true,
  //   focusOnSelect: true,
  //   autoplay: false,
  // };

  // const thumbSettings = {
  //   asNavFor: nav1,
  //   ref: slider2,
  //   slidesToShow: Math.min(pkg.images.length, 5),
  //   swipeToSlide: true,
  //   focusOnSelect: true,
  //   arrows: true,
  //   infinite: true,

  // };
  let doublePrice = null;

  if (pkg?.hotel_ratings?.length) {
    const threeStar = pkg.hotel_ratings.find(group => group.rating === "3");
    if (threeStar?.room_types?.length) {
      const doubleRoom = threeStar.room_types.find(rt => rt.room_type === "Double");
      if (doubleRoom?.adults && doubleRoom.adults !== "N/A") {
        doublePrice = Number(doubleRoom.adults);
      }
    }
  }

  return (
    <div id="pdf-content">
      <div className='package_title_section'>
        <div className='main_details_col'>
          <div className='data'>
            <h2 className='pkgtitle'>{pkg.title} (<span className="meta_item">
              {[...Array(5)].map((_, i) => (
                <span key={i} className='star' style={{ color: i < Number(pkg.customer_rating) ? '#c00579' : '#ccc' }}>★</span>
              ))}
            </span>) <span className='meta_item days_night'>
                {pkg.duration && !isNaN(pkg.duration)
                  ? `${Number(pkg.duration)} Nights`
                  : 'Duration N/A'}
              </span>
            </h2>
            <div className='package_meta_info'>


              <div className='meta_item'>
                {pkg.package_heading}
              </div>
              |
              <div className='meta_item'>

                {pkg.package_type}
              </div>
              |
              <div className='meta_item'>
                {pkg.package_format}
              </div>
              |
              <div className='meta_item'>
                {pkg.package_code}
              </div>
            </div>
          </div>
        </div>

        <div className='main_details_col'>
          <div className='price_booknow_wrapper'>
            <p className='price_tag'>
              <span>Starting From</span>

              {/* Show different <del> price based on flight selection */}
              <del>
                ₹{isWithFlight
                  ? (pkg.sale_price + (withFlightBasePrice || 0))?.toLocaleString()
                  : pkg.sale_price?.toLocaleString()}
              </del>

              {/* Final price */}
              <span className='mainprice'>
                ₹{(isWithFlight ? withFlightTotalSalePrice : doublePrice)?.toLocaleString()}
              </span>
            </p>

            <button className='book_btn'>Book Now</button>
          </div>
        </div>

      </div>

      <div className='section_design'>
        <div className='main_data'>
          <div className='slider_part'>
            {/* Main Image Slider */}
            {images.length > 0 && (
              <>
                <Slider
                  asNavFor={nav2}
                  ref={(slider1) => setNav1(slider1)}
                  dots={false}
                  arrows={false}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                >
                  {images.map((img, i) => (
                    <div key={i}>
                      <img
                        src={`https://belltechwebtools.com/funforay/storage/app/public/${img}`}
                        alt={`Slide ${i}`}
                        style={{
                          width: '100%',
                          height: '350px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                        }}
                      />
                    </div>
                  ))}
                </Slider>

                {/* Thumbnail Slider */}
                <Slider className='thumbb'
                  asNavFor={nav1}
                  ref={(slider2) => setNav2(slider2)}
                  slidesToShow={Math.min(4, images.length)}
                  swipeToSlide={true}
                  focusOnSelect={true}
                  infinite={true}
                  arrows={true}
                  style={{ marginTop: '10px' }}
                >
                  {images.map((img, i) => (
                    <div key={i}>
                      <img
                        src={`https://belltechwebtools.com/funforay/storage/app/public/${img}`}
                        alt={`Thumb ${i}`}
                        style={{
                          width: '-webkit-fill-available',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          margin: '10px',
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              </>
            )}
          </div>


        </div>
        <div className="price_details">
          {pkg.hotel_ratings && pkg.hotel_ratings.length > 0 ? (
            pkg.hotel_ratings
              .filter(ratingGroup => ratingGroup.rating === "3")
              .map((ratingGroup, index) =>
                ratingGroup.room_types
                  .filter(room => room.room_type === "Double")
                  .map((room, i) => (
                    <div key={i}>
                      {/* <div className="price_line">
                        <h4>Package Price</h4>
                        {room.adults && room.adults !== "N/A" && (
                          <p>Per Adult: <span>₹{Number(room.adults).toLocaleString()}</span></p>
                        )}
                        {room.cnb && room.cnb !== "N/A" && (
                          <p>CNB: <span>₹{Number(room.cnb).toLocaleString()}</span></p>
                        )}
                        {room.cwb && room.cwb !== "N/A" && (
                          <p>CWB: <span>₹{Number(room.cwb).toLocaleString()}</span></p>
                        )}
                        {room.infant && room.infant !== "N/A" && (
                          <p>Infant: <span>₹{Number(room.infant).toLocaleString()}</span></p>
                        )}
                      </div> */}

                      {/* PDF Buttons */}
                      <div className="pdf_buttons">
                        <h4>PDF File</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={handleDownload}>

                            Download
                            <FaFilePdf style={{ marginRight: '6px' }} />
                          </button>
                          <button className='share' onClick={() => handleShare(room)}>

                            Share
                            <FaFilePdf style={{ marginRight: '6px' }} />
                          </button>

                        </div>
                      </div>

                      {/* Coupons Section */}
                      <div className="coupans">
                        <h4>Coupons & Offers</h4>
                        <div
                          className="cop_avai"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'flex-start',
                            marginTop: '10px',
                          }}
                        >
                          <p className="couponcode">Discount10 </p>
                          <div className="flex_proper">
                            <p className="hacc">Have a Coupon Code? </p>
                            {!showCouponInput && !isCouponApplied && (
                              <p className="code" onClick={() => setShowCouponInput(true)}>
                                Enter code
                              </p>
                            )}
                          </div>

                          {showCouponInput && !isCouponApplied && (
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input
                                type="text"
                                placeholder="Enter your code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="inputdesigncoupon"
                              />
                              <button onClick={handleApplyCoupon} className="applybtn">
                                Apply
                              </button>
                            </div>
                          )}

                          {isCouponApplied && (
                            <div
                              className="couponcode"
                              style={{
                                background: 'linear-gradient(to left, #006cb87a, #006cb830)',
                                color: 'white',

                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '6px',
                              }}
                            >

                              <div style={{ display: 'grid', alignItems: 'center', gap: '10px' }}>
                                <span className='cnn'>
                                  {couponCode} <span>- ₹919</span>
                                </span>

                              </div>
                              <p className='message'>{couponMessage}<span>  <button
                                onClick={() => {
                                  setCouponCode('');
                                  setIsCouponApplied(false);
                                  setCouponMessage('');
                                  setShowCouponInput(false);
                                }}
                                style={{
                                  background: 'rgb(226 6 140)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  width: 'fit-content',
                                }}
                              >
                                Remove
                              </button></span></p>
                            </div>
                          )}

                          {!isCouponApplied && couponMessage && (
                            <p
                              style={{
                                color: 'red',
                                marginTop: '6px',
                              }}
                            >
                              {couponMessage}
                            </p>
                          )}
                        </div>
                      </div>


                    </div>
                  ))
              )
          ) : (
            <p>No 3-star double room pricing available.</p>
          )}
        </div>

      </div>

      <div className='tabdata'>
        <div className="details_tabdesign">
          {tabFields.map((tab, index) => {
            const imgName = activeTab === tab.key
              ? `tab${index + 1}-active-image.png`
              : `tab${index + 1}-image.png`;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`details_tabdesign_btn ${activeTab === tab.key ? 'active' : ''}`}
              >
                <img src={`/images/${imgName}`} className='tab_image' alt={tab.label} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="tab_content">
          {activeTab === 'showAll' ? (
            <>
              {/* Flights */}
              {pkg.flights && (
                <>
                  <h3>Flights</h3>
                  <div dangerouslySetInnerHTML={{ __html: pkg.flights }} />
                </>
              )}

              {/* Sightseeing */}
              {pkg.sightseeing && (
                <>
                  <h3>Sightseeing</h3>
                  <div dangerouslySetInnerHTML={{ __html: pkg.sightseeing }} />
                </>
              )}

              {/* Hotels */}
              {hotels.length > 0 && <HotelTabs hotels={hotels} />}



              {/* Other Sections */}
              {pkg.transfers && (
                <>
                  <h3>Transfers</h3>
                  <div dangerouslySetInnerHTML={{ __html: pkg.transfers }} />
                </>
              )}
              {pkg.meals && (
                <>
                  <h3>Meals</h3>
                  <div dangerouslySetInnerHTML={{ __html: pkg.meals }} />
                </>
              )}
              {pkg.inclusions && (
                <>
                  <h3>Inclusions</h3>
                  <div dangerouslySetInnerHTML={{ __html: pkg.inclusions }} />
                </>
              )}
              {pkg.exclusions && (
                <>
                  <h3>Exclusions</h3>
                  <div dangerouslySetInnerHTML={{ __html: pkg.exclusions }} />
                </>
              )}
              {pkg.payment_terms && (
                <>
                  <h3>Payment Terms</h3>
                  <div dangerouslySetInnerHTML={{ __html: pkg.payment_terms }} />
                </>
              )}
              {pkg.cancellation && (
                <>
                  <h3>Cancellation Policy</h3>
                  <div dangerouslySetInnerHTML={{ __html: pkg.cancellation }} />
                </>
              )}
            </>
        ) : activeTab === 'hotels' ? (
  hotels.length > 0 ? (
    <div>
      {(() => {
        const grouped = { 3: [], 4: [], 5: [] };

        hotels.forEach(hotel => {
          let rating = parseInt(hotel.rating);
          if (isNaN(rating) && typeof hotel.rating === 'string') {
            rating = hotel.rating.split('★').length - 1;
          }
          if ([3, 4, 5].includes(rating)) {
            grouped[rating].push(hotel);
          }
        });

        const availableRatings = [3, 4, 5].filter(r => grouped[r]?.length > 0);

        if (!availableRatings.includes(activeRating)) {
          setActiveRating(availableRatings[0]);
        }

        return (
          <>
            {/* Rating Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {availableRatings.map((rating) => (
                <button
                  key={rating}
                  onClick={() => setActiveRating(rating)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: activeRating === rating ? '#006CB8' : '#f0f0f0',
                    color: activeRating === rating ? '#fff' : '#000',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  {rating} Star
                </button>
              ))}
            </div>

            {/* Hotels Table */}
            <table className="hotel_desgin" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableCellStyle}>Name</th>
                  <th style={tableCellStyle}>City</th>
                 
                  <th style={tableCellStyle}>Image</th>
                </tr>
              </thead>
              <tbody>
                {grouped[activeRating]?.map(hotel => {
                  let hotelImages = [];

                  try {
                    if (Array.isArray(hotel.images)) {
                      hotelImages = hotel.images;
                    } else if (typeof hotel.images === 'string' && hotel.images.startsWith('[')) {
                      hotelImages = JSON.parse(hotel.images);
                    } else if (typeof hotel.images === 'string') {
                      hotelImages = hotel.images.split(',').map(img => img.trim());
                    }
                  } catch (e) {
                    console.warn('Could not parse hotel images:', hotel.images, e);
                  }

                  hotelImages = hotelImages.filter(img => img && img !== 'null');

                  return (
                    <tr key={hotel.id}>
                      <td style={tableCellStyle}>{hotel.name}</td>
                      <td style={tableCellStyle}>{hotel.city}</td>
                    
                      <td style={tableCellStyle}>
                        {hotelImages.length > 0 && (
                          <img
                            src={`https://belltechwebtools.com/funforay/storage/app/public/${hotelImages[0]}`}
                            alt={hotel.name}
                            style={{
                              width: '300px',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const fullImageUrls = hotelImages.map(img =>
                                `https://belltechwebtools.com/funforay/storage/app/public/${img}`
                              );
                              setLightboxImages(fullImageUrls);
                              setPhotoIndex(0);
                              setLightboxOpen(true);
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        );
      })()}
    </div>
  ) : (
    <p>No hotels available for this package.</p>
  )
) :

 pkg[activeTab] ? (
            <div dangerouslySetInnerHTML={{ __html: pkg[activeTab] }} />
          ) : (
            <p>No {activeTab.replace('_', ' ')} information available.</p>
          )}
        </div>

      </div>

      <div className='Overview_design'>
        <h4 className='main_heading'>Overview</h4>
        <div dangerouslySetInnerHTML={{ __html: pkg.overview }} />
      </div>

      <div>
        <div dangerouslySetInnerHTML={{ __html: pkg.itinerary }} />
      </div>

      {pkg.additional_info && (
        <div>
          <div dangerouslySetInnerHTML={{ __html: pkg.additional_info }} />
        </div>
      )}
      {lightboxOpen && (
        <Lightbox
          mainSrc={lightboxImages[photoIndex]}
          nextSrc={lightboxImages[(photoIndex + 1) % lightboxImages.length]}
          prevSrc={lightboxImages[(photoIndex + lightboxImages.length - 1) % lightboxImages.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + lightboxImages.length - 1) % lightboxImages.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % lightboxImages.length)
          }
        />
      )}

    </div>

  );
};


const tableCellStyle = {
  border: '1px solid #ccc',
  textAlign: 'center',
  padding: '10px'
};

export default PackageDetails;