import React, { useState, useContext, useEffect, useRef } from 'react';
import { FaHome, FaPlane, FaBed, FaSuitcase, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';  // Assuming you have this context set up
import '../styles/Navbar.css';


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext); // Use user and isAuthenticated from context

  // Reference to the profile dropdown menu for detecting clicks outside
  const profileMenuRef = useRef(null);
  const profileRef = useRef(null);  // Reference to the profile container

  // Handle logout functionality
  const handleLogout = () => {
    logout();  // Call logout to update context and clear any stored tokens
    navigate('/');  // Redirect to the login page
  };

  const handleLogin = () => {
    navigate('/login');  // Redirect to the login page if the user is not logged in
  };
  console.log("nav bar user : ",user)

  // Handle clicks outside the profile menu to close the dropdown
  useEffect(() => {
    // Function to close the dropdown if the click is outside
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && !profileRef.current.contains(event.target)) {
        setProfileOpen(false); // Close the dropdown if clicked outside
      }
    };

    // Attach event listener for clicks on the document
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-navbar-padding"> {/* Apply padding class here */}
      <nav className="custom-navbar">
        {/* First Row: Logo and Hamburger */}
        <div className="navbar-first-row">
          <div className="navbar-logo">BOOKNGO</div>
          <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
            &#9776;
          </div>
        </div>

        {/* Second Row: Navigation links on left and Profile/Login on right */}
        <div className={`navbar-second-row ${menuOpen ? 'menu-open' : ''}`}>
          <div className="navbar-links-left">
            {/* <a href="/" className="navbar-link">
              <FaHome /> &nbsp; Home
            </a> */}
            <a href="/admin/airlines" className="navbar-link">
              <FaPlane /> &nbsp; Airlines
            </a>
            
            <a href="/admin/hotels" className="navbar-link">
              <FaBed /> &nbsp; Hotels
            </a>
            <a href="/admin/flights" className="navbar-link">
              <FaPlane /> &nbsp; Flights
            </a>
            {/* <a href="/packages" className="navbar-link">
              <FaSuitcase /> &nbsp; Packages
            </a> */}
          </div>

          {/* Conditional Rendering for Profile or Login */}
          {/* <div className="navbar-profile" ref={profileRef}>
            {isAuthenticated ? (
              // If user is logged in, show Profile dropdown
              <>
                <div
                  className="profile-container"
                  onClick={() => setProfileOpen((prevState) => !prevState)}
                >
                  <FaUser /> <span className='profile-container-text-item'>{user.username}</span>
                </div>
                <div
                  className={`dropdown-menu ${profileOpen ? 'active' : ''}`}
                  ref={profileMenuRef} // Attach the ref to the dropdown menu
                >
                  <a href="/profile">View Profile</a>
                  <a href="/edit-user-profile">Edit Profile</a>
                  <a href="#" onClick={handleLogout}>Logout</a> 
                </div>
              </>
            ) : (
              <div onClick={handleLogin} className="profile-container"><FaUser /> <span className='profile-container-text-item'>Login</span></div>
            )}
          </div> */}
        </div>
      </nav>
    </div>
  );
}
