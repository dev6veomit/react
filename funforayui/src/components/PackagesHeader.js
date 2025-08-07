import React, { useState } from 'react';

const PackagesHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoSection}>
         <a href="/"> <img
            src="/images/logo.png"
            alt="Logo"
            style={styles.logo}
          /></a>
        </div>

        {/* Hamburger icon for mobile */}
        <div style={styles.hamburger} onClick={toggleMenu}>
          <div style={styles.bar}></div>
          <div style={styles.bar}></div>
          <div style={styles.bar}></div>
        </div>

        {/* Navigation */}
        <nav
          style={{
            ...styles.navSection,
            ...(menuOpen ? styles.navOpen : {}),
          }}
        >
          <a href="#">Flights</a>
          <a href="#">Hotels</a>
          <a href="/packages">Holiday Packages</a>
          <a href="/contact">Support</a>
        </nav>

        {/* Account Button */}
        <div style={styles.accountSection}>
          <button style={styles.accountBtn}>My Account</button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    padding: '0px 20px',
    position: 'relative',
    zIndex: 10,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  logoSection: {
    flexBasis: '20%',
    minWidth: '100px',
  },
  logo: {
    width: '194px',
    objectFit: 'contain',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    cursor: 'pointer',
    gap: '4px',
    padding: '10px',
  },
  bar: {
    width: '25px',
    height: '3px',
    backgroundColor: '#333',
    borderRadius: '2px',
  },
  navSection: {
    flexBasis: '60%',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    transition: 'all 0.3s ease',
  },
  navLink: {
    color: '#333',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '16px',
  },
  navOpen: {
    flexBasis: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
    marginTop: '10px',
    display: 'flex',
  },
  accountSection: {
    flexBasis: '20%',
    textAlign: 'right',
    minWidth: '150px',
  },
  accountBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
  },

  // Media Query-like behavior in JS
  '@media (max-width: 768px)': {
    container: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    hamburger: {
      display: 'flex',
    },
    navSection: {
      display: 'none',
    },
  },
};

export default PackagesHeader;
