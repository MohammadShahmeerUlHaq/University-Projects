import React, { useState } from 'react';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRadio,
  MDBRow,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from 'mdb-react-ui-kit';
import '../styles/PaymentForm.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function PaymentForm() {
  const location = useLocation();
  const { bookingType, amount, bookingDetails, userName } = location.state;
  const [modalOpen, setModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false); // New state for response modal
  const [responseMessage, setResponseMessage] = useState(''); // Store the message for the response modal
  const [cardDetails, setCardDetails] = useState([]);
  const [selectedCard, setSelectedCard] = useState('visa');
  const [newCard, setNewCard] = useState({ type: 'visa', number: '', expiryMM: '', expiryYYYY: '', cvv: '' });
  const navigate=useNavigate();
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

 

  const handleCardSelection = (cardType) => {
    setSelectedCard(cardType);
  };

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState);
  };

  const toggleResponseModal = () => {
    setResponseModalOpen(!responseModalOpen);
    if(responseMessage=='Reservation confirmed! Thanks for choosing us!' || responseMessage=="Reservation Modified Successfully."){
      navigate('/')
    }
  };

  const handleAddCard = () => {
    const { number, expiryMM, expiryYYYY, cvv } = newCard;

    // Validation checks
    const cardNumberValid = /^\d{16}$/.test(number);
    const expiryMMValid = /^\d{1,2}$/.test(expiryMM) && parseInt(expiryMM) >= 1 && parseInt(expiryMM) <= 12;
    const expiryYYYYValid = /^\d{4}$/.test(expiryYYYY);
    const cvvValid = /^\d{3,4}$/.test(cvv);

    if (cardNumberValid && expiryMMValid && expiryYYYYValid && cvvValid) {
      setCardDetails((prev) => [...prev, newCard]);
      setNewCard({ type: 'visa', number: '', expiryMM: '', expiryYYYY: '', cvv: '' }); // Reset form
      toggleModal();
    } else {
      alert("Please fill in valid card details.\n- Card Number: 16 digits\n- Expiry Date: MM (1-12) and YYYY\n- CVV: 3 or 4 digits");
    }
  };

  const handleRemoveCard = (index) => {
    setCardDetails((prev) => prev.filter((_, i) => i !== index));
    if (selectedCard === cardDetails[index].type) {
      setSelectedCard(cardDetails[0]?.type || 'visa'); // Reset selection if removed card was selected
    }
  };

  const formatBookingDetails = (type, details) => {
    if (type === 'Hotel') {
      return (
        <>
          <p><strong>Hotel Name:</strong> {details.hotelName}</p>
          <p><strong>Location:</strong> {details.location}</p>
          <p><strong>Room Type:</strong> {details.roomType}</p>
          <p><strong>Number of Rooms:</strong> {details.numberOfRooms}</p>
          <p><strong>Duration:</strong> {details.duration} days</p>
        </>
      );
    } else if (type === 'Flight') {
      return (
        <>
          <p><strong>Airline :</strong> {details.airlineName}</p>
          <p><strong>Flight From :</strong> {details.origin}</p>
          <p><strong>Flight To :</strong> {details.destination}</p>
          <p><strong>Departure Time :</strong> {details.departureTime}</p>
          <p><strong>Travellers :</strong> {details.travellers}</p>
        </>
      );
    } else if (type === 'Package') {
      return (
        <>
          <p><strong className='payment-important-head-title'>Origin:</strong> {details.origin}
          {/* <strong className='payment-important-head-title payment-spacing-summary-details'>Destination:</strong> {details.destination} */}
          </p>
          <p><strong className='payment-important-head-title'>Destination:</strong> {details.destination}</p>
          <p><strong className='payment-important-head-title'>Departure Airline:</strong> {details.onwardAirline}</p>
          <p><strong className='payment-important-head-title'>Departure Time:</strong> {details.onwardDate}</p>
          <p><strong className='payment-important-head-title'>Return Airline:</strong> {details.returnAirline}</p>
          <p><strong className='payment-important-head-title'>Return Time:</strong> {details.returnDate}</p>
          <p><strong className='payment-important-head-title'>Hotel Name:</strong> {details.hotelName}</p>
          <p><strong className='payment-important-head-title'>Room Type:</strong> {details.roomType}</p>
          <p><strong className='payment-important-head-title'>Number of Rooms:</strong> {details.numberOfRooms}</p>
        </>
      );
    }else{
      return(<></>)
    }
    return <p>{details}</p>;
  };

  const makeReservations = async () => {
    const selectedCardDetails = cardDetails.find(card => card.type === selectedCard);

    if (!selectedCardDetails) {
      setResponseMessage("Please select a card to confirm the payment.");
      toggleResponseModal();
      return;
    }

    let reservationData;
    let apiEndpoint;

    if (bookingType === 'Hotel') {
      reservationData = {
        hotelId: bookingDetails.HotelId,
        userName: userName,
        reservationDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
        noOfRooms: bookingDetails.numberOfRooms,
        type: bookingDetails.roomType,
      };
      apiEndpoint = 'http://localhost:8000/api/v1/hotelReservation/reserveHotelRoom';
    } else if (bookingType === 'Flight') {
      reservationData = {
        flightId: bookingDetails.flightId,
        userName: userName,
        seats: bookingDetails.travellers,
      };
      apiEndpoint = 'http://localhost:8000/api/v1/flightReservation/reserveFlight';
    } else if (bookingType === 'Package') {
      reservationData = {
        bundleId: bookingDetails.bundleId,
        userName: userName,
        seats: bookingDetails.numberOfSeats,
        noOfRooms: bookingDetails.numberOfRooms,
        roomType: bookingDetails.roomType,
      };
      console.log('reservation Data : ',reservationData)
      apiEndpoint = 'http://localhost:8000/api/v1/bundleReservation/reserveBundle';
    }
    else if(bookingType==='Hotel Modification'){
      apiEndpoint='http://localhost:8000/api/v1/hotelReservation/updateHotelReservation2';
      reservationData={
        reservationId:bookingDetails.reservationId,
        rooms:bookingDetails.rooms,
        reservationStartDate:bookingDetails.reservationStartDate,
        reservationEndDate:bookingDetails.reservationEndDate,
        roomType:bookingDetails.roomType,
        amount
      }

    }
    else if(bookingType==='Flight Modification'){
      apiEndpoint='http://localhost:8000/api/v1/flightReservation/updateFlightReservation2';
      reservationData={
        reservationId:bookingDetails.reservationId,
        seats:bookingDetails.seats,
        amount
      }
    }
    

    try {
      const response = await axios.post(apiEndpoint, reservationData);
      if (response.status === 200) {
        if(bookingType=='Hotel Modification' || bookingType=='Flight Modification'){
          setResponseMessage("Reservation Modified Successfully.");
        toggleResponseModal();
        }
        else{
          setResponseMessage("Reservation confirmed! Thanks for choosing us!");
        toggleResponseModal();  
        }
        
      }
    } catch (error) {
      console.error("Error making reservation:", error.response?.data?.error);
      setResponseMessage("There was an error confirming your reservation. Please try again.");
      toggleResponseModal();
    }
  };
  
  return (
    <MDBContainer fluid className="payment-form-container">
      <MDBCard>
        <MDBCardBody>
          <MDBRow className="d-flex justify-content-center pb-5">
            <MDBCol md="7" xl="5" className="mb-4 mb-md-0">
              <h4 className="booking-type booking-head-payment">{bookingType} Payment</h4>
              <h4 className="text-success"><strong>${amount}</strong></h4>
              {bookingType!='Hotel Modification' && bookingType!='Flight Modification' && 
              <h5 className='booking-type'>Booking Summary :</h5>
              }
              {formatBookingDetails(bookingType, bookingDetails)}

              
            </MDBCol>

            <MDBCol md="5" xl="4">
              <div className="cancel-link-container">
                <a href="/">Cancel and return to website</a>
              </div>

              <div className="rounded order-recap ">
                <h4 className='booking-type'>Order Recap</h4>
                <div className="recap-row">
                  <MDBCol size="8" className='booking-type'>Booking Type</MDBCol>
                  <div className="ms-auto"><strong>{bookingType}</strong></div>
                </div>
                <div className="recap-row">
                  <MDBCol size="8" className='booking-type'>Total Amount</MDBCol>
                  <div className="ms-auto"><strong>${amount}</strong></div>
                </div>
              </div>

              <div className="d-flex flex-column pt-3">
                <p className="text-primary add-payment-option" onClick={toggleModal}>
                  <MDBIcon fas icon="plus-circle" className="text-primary pe-1" />
                  Add payment card
                </p>

                {/* Display added cards */}
                {cardDetails.map((card, index) => (
                  <div key={index} className="payment-card-option">
                    <MDBRadio
                      name="radioCard"
                      checked={selectedCard === card.type}
                      onClick={() => handleCardSelection(card.type)}
                    />
                    <div className="rounded border payment-card-details">
                      <MDBIcon fab icon={`cc-${card.type}`} size="lg" className="text-dark pe-2" />
                      <span>{`${card.type.charAt(0).toUpperCase() + card.type.slice(1)} Card`}</span>
                      <span className="ms-auto">{`************${card.number.slice(-4)}`}</span>
                      <MDBBtn
                        className="remove-card-btn"
                        onClick={() => handleRemoveCard(index)}
                      >
                        Remove
                      </MDBBtn>
                    </div>
                  </div>
                ))}

                <MDBBtn block size="lg" className="proceed-payment-btn" onClick={makeReservations}>
                  Confirm Payment
                </MDBBtn>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>

      {/* Modal for adding a new card */}
      {modalOpen && (
        <div className="custom-modal">
          <div className="modal-content">
            <MDBModalHeader toggle={toggleModal}>Add Payment Card</MDBModalHeader>
            <MDBModalBody>
              <MDBRadio
                name="cardType"
                id="visa"
                checked={newCard.type === 'visa'}
                onChange={() => setNewCard({ ...newCard, type: 'visa' })}
                label="Visa"
              />
              <MDBRadio
                name="cardType"
                id="mastercard"
                checked={newCard.type === 'mastercard'}
                onChange={() => setNewCard({ ...newCard, type: 'mastercard' })}
                label="Mastercard"
              />
              <MDBInput
                className='add-card-option-spacing'
                label="Card Number"
                type="text"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
              />
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput
                    className='add-card-option-spacing'
                    label="Expiry MM"
                    type="text"
                    value={newCard.expiryMM}
                    onChange={(e) => setNewCard({ ...newCard, expiryMM: e.target.value })}
                    placeholder="MM"
                  />
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput
                    className='add-card-option-spacing'
                    label="Expiry YYYY"
                    type="text"
                    value={newCard.expiryYYYY}
                    onChange={(e) => setNewCard({ ...newCard, expiryYYYY: e.target.value })}
                    placeholder="YYYY"
                  />
                </MDBCol>
              </MDBRow>
              <MDBInput
                className='add-card-option-spacing'
                label="CVV"
                type="text"
                value={newCard.cvv}
                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
              />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleModal}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleAddCard}>Add Card</MDBBtn>
            </MDBModalFooter>
          </div>
        </div>
      )}

      {/* Modal for reservation response */}
      {responseModalOpen && (
        <div className="custom-modal">
          <div className="modal-content">
            {/* <MDBModalHeader toggle={toggleResponseModal}>Response</MDBModalHeader> */}
            <MDBModalBody>
              <strong>{responseMessage}</strong>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn onClick={toggleResponseModal}>OK</MDBBtn>
            </MDBModalFooter>
          </div>
        </div>
      )}
    </MDBContainer>
  );
}
