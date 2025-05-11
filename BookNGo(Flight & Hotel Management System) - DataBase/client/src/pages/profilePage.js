import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBBtn, MDBRow, MDBCol, MDBModalBody, MDBModalFooter,MDBModalHeader } from 'mdb-react-ui-kit';
import { FaPlane, FaCalendarAlt, FaUser, FaHotel, FaDollarSign, FaRegCalendarCheck} from 'react-icons/fa';
import { RiStarSFill, RiStarHalfSFill, RiStarLine } from 'react-icons/ri'; 
import '../styles/profilePage.css';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from "react-router-dom";


export default function ProfilePage() {
  const { user,isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  if(!isAuthenticated){
    navigate('/');
  }
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const username = user?.username;

  const [hotelBookings, setHotelBookings] = useState([]);
  const [flightBookings, setFlightBookings] = useState([]);
  const [packageBookings,setPackageBookings]=useState([]);
  const [modalVisible, setModalVisible] = useState(false); 
  const [modalMessage, setModalMessage] = useState(''); 

  // State to handle ratings
  const [flightUserRating, setFlightUserRating] = useState({});
  const [hotelUserRating, setHotelUserRating] = useState({});
  const [flightHoveredRating, setFlightHoveredRating] = useState({});
  const [hotelHoveredRating, setHotelHoveredRating] = useState({});
  const [packageHoveredRating, setPackageHoveredRating] = useState({});
  const [packageUserRating, setPackageUserRating] = useState({});
  
  const [temp,setTemp]=useState(false);
  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (username) {
        try {
          const hotelResponse = await axios.post('http://localhost:8000/api/v1/users/getUserHotelReservationHistory', { username });
          setHotelBookings(hotelResponse.data.hotelReservations || []);
          
          const flightResponse = await axios.post('http://localhost:8000/api/v1/users/getUserFlightReservationHistory', { username });
          setFlightBookings(flightResponse.data.flightReservations || []);
        
          const packageResponse = await axios.post('http://localhost:8000/api/v1/users/getUserBundleReservationHistory',{username})
          setPackageBookings(packageResponse.data.bundleReservations || [])
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      }
    };

    fetchBookingHistory();
  }, [temp]);
  console.log('flight bookingws:',flightBookings);
  console.log('hotel bookings:',hotelBookings);
  const convertToLocalTime = (utcTime) => {
    const date = new Date(utcTime);
    return date.toLocaleString('default', {
        year: 'numeric',
        month: 'long',  // "November"
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true    // 12-hour format, set to false for 24-hour
    });
};
  // Function to render the stars for ratings
  const renderStars = (rating, bookingId, type) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - Math.ceil(rating);
    const halfStars = rating % 1 > 0 ? 1 : 0;
    let stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<RiStarSFill key={`full-${type}-${bookingId}-${i}`} className="view-user-profile-comp-stars" />);
    }

    if (halfStars) {
      stars.push(<RiStarHalfSFill key={`half-${type}-${bookingId}`} className="view-user-profile-comp-stars" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<RiStarLine key={`empty-${type}-${bookingId}-${i}`} className="view-user-profile-comp-stars-not-filled" />);
    }

    return stars;
  };

  // Handle hover effect for each booking (flight or hotel)
  const handleStarHover = (rating, bookingId, type) => {
    if (type === 'flight') {
      setFlightHoveredRating(prev => ({ ...prev, [bookingId]: rating }));
    } else if (type === 'hotel') {
      setHotelHoveredRating(prev => ({ ...prev, [bookingId]: rating }));
    } else if (type === 'package') {
      // Add logic for package ratings
      setPackageHoveredRating(prev => ({ ...prev, [bookingId]: rating }));
    }
    
  };
  const handleStarClickPackage=async (rating,bookingId,departureAirlineId,departureFlightReservationId,hotelId,hotelReservationId,returnAirlineId,returnFlightReservationId)=>{
    try{
      await axios.post('http://localhost:8000/api/v1/airlines/updateAirlineRating', {
        flightReservationId:departureFlightReservationId,
        airlineId: departureAirlineId,
        rating,
      });

      await axios.post('http://localhost:8000/api/v1/airlines/updateAirlineRating', {
        flightReservationId:returnFlightReservationId,
        airlineId: returnAirlineId,
        rating,
      });
      await axios.post('http://localhost:8000/api/v1/hotels/updateHotelRating', {
        hotelReservationId:hotelReservationId,
          hotelId: hotelId,
          rating,
      });
      await axios.post('http://localhost:8000/api/v1/bundle/updateBundleRating', {
        bundleReservationId:bookingId
      });
      setModalMessage('Ratings updated successfully. Thanks for your review.');
      setModalVisible(true);
      setTemp((prev)=>!prev);
    
    }catch(error){
      console.log('error in bundle rating update :',error)
      setModalMessage('Failed to submit your rating. Please try again later.');
      setModalVisible(true);
    }
  }
  // Handle rating submission for each booking (flight or hotel)
  const handleStarClick = async (rating, bookingId, type, id) => {
    try {
      console.log('rating : ',rating," type : ",type," bookingID : ",bookingId, ' id : ',id);
      if (type === 'flight') {
        setFlightUserRating(prev => ({ ...prev, [bookingId]: rating }));

        
        await axios.post('http://localhost:8000/api/v1/airlines/updateAirlineRating', {
          flightReservationId:bookingId,
          airlineId: id,
          rating,
        });
      } else if (type === 'hotel') {
        setHotelUserRating(prev => ({ ...prev, [bookingId]: rating }));

        await axios.post('http://localhost:8000/api/v1/hotels/updateHotelRating', {
          hotelReservationId:bookingId,
          hotelId: id,
          rating,
        });
      
      }
      
      setModalMessage('Ratings updated successfully. Thanks for your review.');
      setModalVisible(true);
      setTemp((prev)=>!prev);
    } catch (error) {
      console.log('error in rating update :',error)
      setModalMessage('Failed to submit your rating. Please try again later.');
      setModalVisible(true);
    }
  };
  const handleCancelation = async (bookingId, type) => {
    try {
        let apiEndpoint;
        if(type==='flight'){
          apiEndpoint='http://localhost:8000/api/v1/cancelledFlightReservation/cancelFlightReservation';
        }
        else if (type==='hotel'){
          apiEndpoint='http://localhost:8000/api/v1/cancelledHotelReservation/cancelHotelReservation';
        }
        else if(type==='package'){
          apiEndpoint='http://localhost:8000/api/v1/cancelledBundleReservation/cancelBundleReservation'
        }
        
      const response = await axios.post(apiEndpoint,
        { reservationId: bookingId,bundleReservationId:bookingId });

      if (response.data.data) {
        setModalVisible(true); 
    
        setModalMessage(`Cancellation Request Accepted. Refund amount of $${response.data.data} will be refunded in the next 7 business days.`);
      }
      console.log('checking refund amt :',response.data) 
      setTemp((prev)=>!prev);
    } catch (error) {
        console.log('cancelation error : ',error)
        setModalVisible(true); 
    
        setModalMessage(`Cancellation Request Rejected.${error?.response.data.error || 'Unknown error.'}`);
        
    }
  };
  
  const handleModalClose = () => {
    setModalVisible(false);
    setModalMessage('')
};
const handleModifyBooking = (bookingData, type) => {
  console.log("type :",type);
  console.log("Booking Data : ",bookingData);
  
  navigate('/reservation/modifications', {
    state: { bookingData,type },
  });
};
  const renderBookingCard = (booking, type) => {
    
    let bookingDate = type==='hotel'? booking.reservationStartDate : type==='flight'? convertToLocalTime(booking.flightDepartureTime) : null ;
    
    let formattedDate = bookingDate === 'Invalid Date' ? 'N/A' : bookingDate;
    let bookingId = booking.reservationId;
    if(type==='package'){
      bookingId=booking.bundleReservationId;
    }
    const isFlight = type === 'flight';
    const isHotel = type === 'hotel';
    const currentRating = type === 'package'
  ? (packageHoveredRating[bookingId] !== undefined ? packageHoveredRating[bookingId] : packageUserRating[bookingId] || 0)
  : (isFlight
    ? (flightHoveredRating[bookingId] !== undefined ? flightHoveredRating[bookingId] : flightUserRating[bookingId] || 0)
    : (hotelHoveredRating[bookingId] !== undefined ? hotelHoveredRating[bookingId] : hotelUserRating[bookingId] || 0));
    
      if (type === 'package') {
        return (
          <MDBCard className="view-user-profile-comp-card" key={`package-${bookingId}`}>
            <MDBCardBody>
              <MDBCardTitle className="view-user-profile-comp-card-title">Package Booking</MDBCardTitle>
              <MDBRow>
                <MDBCol md="6">
                  <strong>Flights:</strong>
                  <p>
                    <FaPlane className="view-user-profile-comp-icon-main" />
                    Outbound: <strong>{booking.outwardFlightOrigin}</strong> → <strong>{booking.outwardFlightDestination}</strong> via <strong>{booking.outwardAirlineName}</strong>
                  </p>
                  <p>
                    <FaPlane className="view-user-profile-comp-icon-main" />
                    Return: <strong>{booking.returnFlightOrigin}</strong> → <strong>{booking.returnFlightDestination}</strong> via <strong>{booking.returnAirlineName}</strong>
                  </p>
                  <strong>Hotel:</strong>
                  <p>
                    <FaHotel className="view-user-profile-comp-icon-main" />
                    {booking.hotelName}, {booking.hotelLocation}
                  </p>
                </MDBCol>
                <MDBCol md="3">
                  <p>
                    <FaCalendarAlt className="view-user-profile-comp-icon-main" /> Departure: {convertToLocalTime(booking.outwardFlightDepartureTime)}
                  </p>
                  <p>
                    <FaCalendarAlt className="view-user-profile-comp-icon-main" /> Return: {convertToLocalTime(booking.returnFlightDepartureTime)}
                  </p>
                  <p>
                    <FaUser className="view-user-profile-comp-icon-main" /> Seats: {booking.seats}
                  </p>
                  <p>
                    <FaRegCalendarCheck className="view-user-profile-comp-icon-main" /> {booking.hotelReservationRooms} {booking.hotelReservationType} Room(s)
                  </p>
                </MDBCol>
                <MDBCol md="3" className="text-end">
                  <FaDollarSign className="view-user-profile-comp-dollar-icon" /> {booking.bundleBill}
                </MDBCol>
              </MDBRow>
              <MDBRow className="text-center mt-3">
                <MDBCol>
                  {booking.bundleStatus === 'Booked' && (
                    <MDBBtn color="danger" size="sm" className='view-user-profile-comp-margin-above view-user-profile-comp-cancel-res-button' onClick={() => handleCancelation(bookingId, 'package')}>
                      Cancel Reservation
                    </MDBBtn>
                  )}
                  {booking.bundleStatus==='Cancelled' && (
                    <p className='view-user-profile-comp-cancelled-reservation'><strong>This reservation was cancelled by {username}.</strong></p>
                  )}
                  {booking.bundleStatus==='Availed' &&(<div className="view-user-profile-comp-rating">
                    {renderStars(currentRating || 0, bookingId, 'package').map((star, index) => (
                      <span
                        key={index}
                        className="view-user-profile-comp-star stars-filling-on-hover-class"
                        onMouseEnter={() => handleStarHover(index + 1, bookingId, 'package')}
                        onMouseLeave={() => handleStarHover(0, bookingId, 'package')}
                        onClick={() => handleStarClickPackage(index+1,bookingId,booking.outwardAirlineId,booking.outwardFlightReservationId,booking.hotelId,booking.hotelReservationId,booking.returnAirlineId,booking.returnFlightReservationId) }
                      >
                        {star}
                      </span>
                    ))}
                  </div>
                )}
                    
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        );
      }
    return (
      <MDBCard className="view-user-profile-comp-card" key={`${type}-${bookingId}`}>
        <MDBCardBody>
          {/* <MDBCardTitle className="view-user-profile-comp-card-title">{type} Booking</MDBCardTitle> */}
          <MDBRow className="align-items-center">
          <MDBCol size="10">
            <MDBCardTitle className="view-user-profile-comp-card-title">{type} Booking</MDBCardTitle>
          </MDBCol>
          <MDBCol size="2" className="text-end">
            {(isFlight || isHotel) && 
             booking.reservationStatus==='Booked' && 
            (
              <MDBBtn
                color="info"
                size="sm"
                className="view-user-profile-comp-modify-button"
                onClick={() => handleModifyBooking(booking, type)}
              >
                Modify
              </MDBBtn>
            )}
          </MDBCol>
        </MDBRow>
          <MDBRow className="view-user-profile-comp-row">
            <MDBCol size="4">
              {isFlight ? (
                <>
                  <FaPlane className="view-user-profile-comp-icon-main" />
                  <strong>{booking.airlineName}</strong> | From <strong>{booking.flightOrigin}</strong> to <strong>{booking.flightDestination}</strong>
                </>
              ) : (
                <>
                  <FaHotel className="view-user-profile-comp-icon-main" />
                  <strong>{booking.hotelName}</strong> | Location: <strong>{booking.hotelLocation}</strong>
                </>
              )}
            </MDBCol>
            <MDBCol size="4" className="align-middle">
              <FaCalendarAlt className='view-user-profile-comp-icon-text-space' /> {isFlight ? 'Departure' : 'Reservation'}: {formattedDate}
            </MDBCol>
            <MDBCol size="2" className='align-middle'>
              {isFlight ? (
                <>
                  <FaUser className='view-user-profile-comp-icon-text-space'/> Seats: {booking.reservedSeats}
                </>
              ) : (
                <>
                  <FaRegCalendarCheck className='view-user-profile-comp-icon-text-space'/>  {booking.reservationRooms + ' '+ booking.reservationType} Room 
                </>
              )}
            </MDBCol>
            <MDBCol size="2" className="text-end view-user-profile-comp-bill-container">
              <FaDollarSign className='view-user-profile-comp-dollar-icon' /> <span className='view-user-profile-comp-margin-right'>{booking.reservationBill}</span>
            </MDBCol>
          </MDBRow>

          <MDBRow className="view-user-profile-comp-row text-center">
            <MDBCol>
            {booking.reservationStatus==='Cancelled' && (
                    <p className='view-user-profile-comp-cancelled-reservation'><strong>This reservation was cancelled by {username}.</strong></p>
              )}
              {booking.reservationStatus==='Booked' && (
                <MDBBtn color="danger" size="sm" className='view-user-profile-comp-margin-above view-user-profile-comp-cancel-res-button' onClick={() => handleCancelation(bookingId, type)}>
                  Cancel Reservation
                </MDBBtn>
              )}  
              {booking.reservationStatus==='Availed' && (
                <div className="view-user-profile-comp-rating">
                  {renderStars(currentRating, bookingId, type).map((star, index) => (
                    <span
                      key={index}
                      className="view-user-profile-comp-star"
                      onMouseEnter={() => handleStarHover(index + 1, bookingId, type)}
                      onMouseLeave={() => handleStarHover(0, bookingId, type)}
                      onClick={type === 'flight'
                        ? () => handleStarClick(index + 1, bookingId, type, booking.airlineId)
                        : () => handleStarClick(index + 1, bookingId, type, booking.hotelId)
                      }
                    >
                      {star}
                    </span>
                  ))}
                </div>
              )}
              
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    );
  };

  return (
    <MDBContainer className="view-user-profile-comp-container">
      <section className="view-user-profile-comp-section">
        <h2 className="view-user-profile-comp-heading">Package Bookings</h2>
        {packageBookings.length > 0 ? (
          packageBookings.map(booking => renderBookingCard(booking, 'package'))
        ) : (
          <p>No package bookings found.</p>
        )}
      </section>

      <section className="view-user-profile-comp-section">
        <h2 className="view-user-profile-comp-heading">Flight Bookings</h2>
        {flightBookings.length > 0 ? (
          flightBookings.map(booking => renderBookingCard(booking, 'flight'))
        ) : (
          <p>No flight bookings found.</p>
        )}
      </section>

      <section className="view-user-profile-comp-section">
        <h2 className="view-user-profile-comp-heading">Hotel Bookings</h2>
        {hotelBookings.length > 0 ? (
          hotelBookings.map(booking => renderBookingCard(booking, 'hotel'))
        ) : (
          <p>No hotel bookings found.</p>
        )}
      </section>

      {modalVisible && (
        <div className="view-user-profile-comp-modal">
          <div className="modal-content">
            <MDBModalHeader toggle={handleModalClose}><strong>Confirmation</strong></MDBModalHeader>
            <MDBModalBody>
              <p>{modalMessage}</p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="primary" onClick={handleModalClose}>OK</MDBBtn>
            </MDBModalFooter>
          </div>
        </div>
      )}
    </MDBContainer>
  );
}
