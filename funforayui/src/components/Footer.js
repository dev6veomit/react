import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png'; // Replace with your actual logo path
import galleryImage1 from '../assets/images/gallery_1_1.jpg';
import galleryImage2 from '../assets/images/gallery_1_2.jpg';
import galleryImage3 from '../assets/images/gallery_1_3.jpg';
import galleryImage4 from '../assets/images/gallery_1_4.jpg';
import galleryImage5 from '../assets/images/gallery_1_5.jpg';
import galleryImage6 from '../assets/images/gallery_1_6.jpg';

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp, FaPhone, FaEnvelope, } from 'react-icons/fa';
import { FaMapLocation } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                {/* Column 1: Logo, Text, Social */}
                <div style={styles.column}>
                    <img src={logo} alt="FunForay" style={styles.logo} />
                    <p style={styles.text}>Rapidiously myocardinate cross-platform intellectual capital model.
                        Appropriately create interactive infrastructures</p>
                    <div style={styles.socialIcons}>
                        <a className='icon' href="#" style={styles.icon}><FaFacebookF /></a>
                        <a className='icon' href="#" style={styles.icon}><FaTwitter /></a>
                        <a className='icon' href="#" style={styles.icon}><FaInstagram /></a>
                        <a className='icon' href="#" style={styles.icon}><FaLinkedinIn /></a>
                         <a className='icon' href="#" style={styles.icon}><FaWhatsapp /></a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>Quick Links</h4>
                    <ul className='footer_links' style={styles.linkList}>
                        <li><Link to="/" style={styles.link}>About Us</Link></li>
                        <li><Link to="/about" style={styles.link}>Holiday Packages</Link></li>
                        <li><Link to="/packages" style={styles.link}>Hotels</Link></li>
                        <li><Link to="#" style={styles.link}>Flights</Link></li>
                        <li><Link to="/contact" style={styles.link}>Contact</Link></li>
                    </ul>
                </div>

                {/* Column 3: More Links */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>Get In Touch</h4>

                    {/* Phone Section */}
                    <div className='footer_contact'>
                        <div style={styles.icon}>
                           <FaPhone />
                        </div>
                        <div>
                            <p style={styles.contactText}><a href="tel:01234567890" style={styles.link}>+01 234 567 890</a></p>
                            <p style={styles.contactText}><a href="tel:09876543210" style={styles.link}>+09 876 543 210</a></p>
                        </div>
                    </div>

                    {/* Email Section */}
                    <div className='footer_contact'>
                        <div style={styles.icon}>
                            <FaEnvelope />
                        </div>
                        <div>
                            <p style={styles.contactText}><a href="mailto:mailinfo00@tourm.com" style={styles.link}>mailinfo00@tourm.com</a></p>
                            <p style={styles.contactText}><a href="mailto:support24@tourm.com" style={styles.link}>support24@tourm.com</a></p>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className='footer_contact'>
                        <div style={styles.icon}>

                            <FaMapLocation />
                        </div>
                        <div>
                            <p style={styles.contactText}>789 Inner Lane, Holy park, California, USA</p>
                        </div>
                    </div>
                </div>


                {/* Column 4: Placeholder or contact/info */}
                <div style={styles.column}>
                    <h4 style={styles.heading}>Instagram Post</h4>
                    <div style={styles.galleryGrid}>
                        {[galleryImage1, galleryImage2, galleryImage3, galleryImage4, galleryImage5, galleryImage6].map((img, index) => (
                            <img key={index} src={img} alt={`Gallery ${index + 1}`} style={styles.galleryImage} />
                        ))}
                    </div>
                </div>

            </div>

            <p style={styles.copyright}>
                &copy; {new Date().getFullYear()} FunForay. All rights reserved.
            </p>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#f1f1f1',
        padding: '40px 20px 20px',
        borderTop: '1px solid #ddd',
        textAlign: 'center'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        textAlign: 'left',
        margin: '0 auto'
    },
    column: {
        flex: '1',
        marginBottom: '20px',
        padding: '0 15px'
    },
    logo: {
        width: '200px',
    },
    heading: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    text: {
        fontSize: '14px',
        color: '#333',
        lineHeight: '1.5',
        marginBottom: '10px'
    },
    socialIcons: {
        display: 'flex',
        gap: '10px',
        marginTop: '10px'
    },
    icon: {
        fontSize: '18px',
        color: '#555',
        textDecoration: 'none'
        
    },
    linkList: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    link: {
        display: 'block',
        color: '#333',
        textDecoration: 'none',
        marginBottom: '8px'
    },
    copyright: {
        marginTop: '30px',
        fontSize: '13px',
        color: '#777'
    },
    infoBox: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '15px'
    },
    icon: {
        width: '30px',
        marginRight: '10px'
    },
    iconImg: {
        width: '100%',
        maxWidth: '30px'
    },
    contactText: {
        margin: '4px 0',
        fontSize: '14px',
        color: '#333'
    },
    galleryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginTop: '10px',
    },

    galleryImage: {
        width: '100%',
        height: 'auto',
        borderRadius: '6px',
        objectFit: 'cover',
    }


};

export default Footer;
