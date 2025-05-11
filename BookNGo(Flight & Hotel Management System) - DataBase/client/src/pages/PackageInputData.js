import React, { useState, useEffect ,useContext} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MDBInput,
  MDBBtn,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';
import '../styles/packageInputData.css';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';


export default function PackageInputData() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [pkgData, setPkgData] = useState(location.state?.pkgData || null);
  const [seats, setSeats] = useState('');
  const [rooms, setRooms] = useState('');
  const [roomType, setRoomType] = useState('Standard');
  const [price, setPrice] = useState(null);
  const [error, setError] = useState('');
  const [inputData,setInputData]=useState({numSeats:null,
    numRooms:null,
    roomType:null,
    price:null});
  useEffect(() => {
    if (!pkgData) {
      alert('Invalid access. Redirecting to the home page.');
      navigate('/');
    }
  }, [pkgData, navigate]);
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);


  const handleGetPrice = async () => {
    if (!seats || !rooms) {
      setError('Please fill out all fields.');
      return;
    }
    setInputData({
      numSeats:seats,
      numRooms:rooms,
      roomType:roomType
    })

    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/v1/bundle/getBundleCost', {
        bundleId: pkgData.bundleId,
        seats,
        noOfRooms: rooms,
        roomType,
        
      });
      setPrice(response.data.data);
      setInputData((prev)=>{
        return {
          ...prev,
          price:response.data.data
        }
      })
      console.log(inputData)
    } catch (error) {
      console.error('Error fetching price:', error);
      setError('Failed to fetch price. Please try again later.');
    }
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      alert('Please log in to book a package.');
      navigate('/login');
      return;
    }

    if (!seats || !rooms) {
      setError('Please fill out all fields.');
      return;
    }
    if(inputData.price===null){
      setError('Please click on get Price first')
      return;
    }
    
    navigate('/packages/details', {
      state: { 
        pkgData: pkgData,
        inputData:inputData
       },
    });
  };

  return (
    <div className="package-details-container">
      <h2 className="package-details-heading">Plan Your Dream Package</h2>
      <p className="package-details-description">
        Customize your package by entering the number of seats, rooms, and room type. The total price will update
        automatically when all fields are entered.
      </p>
      <div className="package-details-form">
        {/* Row 1: Number of Seats and Number of Rooms */}
        <div className="package-details-row">
          <MDBInput
            label="Number of Seats"
            type="number"
            className="package-details-field"
            value={seats}
            onInput={(e) => setSeats(e.target.value.replace(/[^0-9]/g, ''))}
          />
          <MDBInput
            label="Number of Rooms"
            type="number"
            className="package-details-field"
            value={rooms}
            onInput={(e) => setRooms(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>
        <div className="package-details-row package-details-label-items-rows">
          <label className='package-details-label-items'>Room Type :</label>
          <label className='package-details-label-items'>Price :</label>
        </div>
        {/* Row 2: Room Type and Total Price */}
        <div className="package-details-row">
          <MDBDropdown className="package-details-dropdown">
            <MDBDropdownToggle className="package-details-dropdown-toggle">
              {roomType}
            </MDBDropdownToggle>
            <MDBDropdownMenu className='package-details-dropdown-list-menu'>
              <MDBDropdownItem className='package-details-dropdown-list-item' onClick={() => setRoomType('Standard')}>Standard</MDBDropdownItem>
              <MDBDropdownItem className='package-details-dropdown-list-item' onClick={() => setRoomType('Deluxe')}>Deluxe</MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
          <div className="package-details-price-box">
            {/* <span>Price: </span> */}
            <input
              type="text"
              className="package-details-price"
              value={price !== null ? `$${price}` : ''}
              readOnly
            />
          </div>
        </div>

        {/* Row 3: Error Message */}
        {error && <div className="package-details-error">{error}</div>}

        {/* Row 4: Confirm Booking */}
        <div className="package-details-row">
          <MDBBtn className="package-details-btn" onClick={handleGetPrice}>
            Get Price
          </MDBBtn>
          <MDBBtn className="package-details-btn confirm" onClick={handleSubmit}>
            Proceed
          </MDBBtn>
        </div>
      </div>
    </div>
  );
}
