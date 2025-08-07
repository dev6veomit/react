import React, { useState } from 'react';
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';

const RecentGallery = () => {
    const imagePaths = [
        '/images/gallery_1_1.jpg',
        '/images/gallery_1_2.jpg',
        '/images/gallery_1_3.jpg',
        '/images/gallery_1_4.jpg',
        '/images/gallery_1_5.jpg',
        '/images/gallery_1_6.jpg',
        '/images/gallery_1_7.jpg'
    ];

    // Map image index to columns
    const columnMap = {
        0: [imagePaths[0]],
        1: [imagePaths[1], imagePaths[2]],
        2: [imagePaths[3]],
        3: [imagePaths[4], imagePaths[5]],
        4: [imagePaths[6]],
        
    };

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    // Flatten all images for lightbox navigation
    const flatImages = [...new Set(Object.values(columnMap).flat())];

    return (
        <section className='gallery'>
            <h2 className='gallery_title'>Make Your Tour More Pleasure</h2>
            <h2 className='gallery_subtitle'>Recent Gallery</h2>
            <div style={styles.galleryRow}>
                {Object.keys(columnMap).map((col, i) => (
                    <div key={i} style={styles.galleryColumn}>
                        {columnMap[col].map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Gallery ${i}-${idx}`}
                                style={styles.image}
                                onClick={() => {
                                    const flatIndex = flatImages.indexOf(img);
                                    setPhotoIndex(flatIndex);
                                    setLightboxOpen(true);
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {lightboxOpen && (
                <Lightbox
                    mainSrc={flatImages[photoIndex]}
                    nextSrc={flatImages[(photoIndex + 1) % flatImages.length]}
                    prevSrc={flatImages[(photoIndex + flatImages.length - 1) % flatImages.length]}
                    onCloseRequest={() => setLightboxOpen(false)}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + flatImages.length - 1) % flatImages.length)}
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % flatImages.length)}
                />
            )}
        </section>
    );
};

const styles = {
    section: {
        padding: '40px 20px',
        backgroundColor: '#f9f9f9',
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '28px',
    },
    galleryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems:'center'
    },
    galleryColumn: {
        flex: '1',
        minWidth: '150px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    image: {
        width: '100%',
        height: 'auto',
        cursor: 'pointer',
        borderRadius: '20px',
        objectFit: 'cover'
    }
};
export default RecentGallery;