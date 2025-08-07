
import React from 'react';
import logo from '../assets/images/logo.png';
import mail from '../assets/images/Group.png';
import card from '../assets/images/Groupimage.png';
const Header = () => {
    return (
        <header className='header'>
            <img src={logo} alt="Logo"  className='logo' />

            <div className='header_info'>
                <div className='list_info'>
                    <img src={mail} alt="mail_icon" style={{height: '35px'}}></img>
                    <div className='list_info_text'>
                        <h4>List Your Property</h4>
                        <p>Grow Your Business!</p>
                    </div>
                </div>
                <div className='list_info'>
                    <img src={card} alt="mail_icon" style={{height: '35px'}}></img>
                    <div className='list_info_text'>
                        <h4>My Trips</h4>
                        <p>Manage Your Booking</p>
                    </div>
                </div>
                <div className='list_info'>
                   <button type='button' className='headbtn'>Login or Create Account</button>
                   
                </div>
            </div>

            {/* <nav>
                <a href="/" style={styles.link}>Home</a>
                <a href="/packages" style={styles.link}>Packages</a>
                <a href="/contact" style={styles.link}>Contact</a>
                <a href="/about" style={styles.link}>About Us</a>
                
            </nav> */}
        </header>
    );
};

const styles = {
    
    title: {
        margin: 0
    },
    link: {
        color: '#fff',
        marginLeft: 20,
        textDecoration: 'none',
        fontWeight: 'bold'
    }
};

export default Header;
