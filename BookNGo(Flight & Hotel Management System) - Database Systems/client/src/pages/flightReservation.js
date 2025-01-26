import React, { useState,useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/flightReservationPage.css';
import { AuthContext } from '../Context/AuthContext';
export default function FlightReservationPage() {
    const { user} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const flightDetails = location.state;
    const [travellers, setTravellers] = useState('');
    const [travellerDetails, setTravellerDetails] = useState([]);
    React.useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
      }, []);

    function handleTravellersChange(e) {
        const value = e.target.value.replace(/\D/g, ''); // Ensures only numbers are input
        setTravellers(value);

        const count = parseInt(value) || 0;
        const newTravellerDetails = Array(count).fill().map((_, i) => ({
            firstName: travellerDetails[i]?.firstName || '',
            lastName: travellerDetails[i]?.lastName || '',
            passportNumber: travellerDetails[i]?.passportNumber || ''
        }));
        setTravellerDetails(newTravellerDetails);
    }

    function handleTravellerDetailChange(index, field, value) {
        const updatedDetails = [...travellerDetails];
        updatedDetails[index][field] = value;
        setTravellerDetails(updatedDetails);
    }

    function calculateTotalPrice() {
        return flightDetails.price * (parseInt(travellers) || 0);
    }
    console.log("flight reservation flight id : ",flightDetails.flightId)

    function handleReservation() {
        const bookingData = {
            bookingType: 'Flight',
            amount: calculateTotalPrice(),
            bookingDetails: {
                airlineName: flightDetails.airline,
                origin: flightDetails.origin,
                destination: flightDetails.destination,
                departureTime: flightDetails.departure,
                travellers: travellers,
                flightId:flightDetails.flightId
            },
            userName: user?.username
        };
        console.log("flight reservation booking data: ",bookingData)
        navigate('/payment', { state: bookingData });
    }

    return (
        <div className="flight-reservation-comp-page">
            <h1 className="flight-reservation-comp-title">Flight Reservation Details</h1>
            <div className="flight-reservation-comp-form">
                <div className="flight-reservation-comp-field">
                    <label>Signed In As</label>
                    <input
                        type="text"
                        value={user?.username || ""}
                        readOnly
                        className="flight-reservation-comp-input-readonly"
                    />
                </div>
                <div className="flight-reservation-comp-field">
                    <label>Airline Name</label>
                    <input
                        type="text"
                        value={flightDetails?.airline || ""}
                        readOnly
                        className="flight-reservation-comp-input-readonly"
                    />
                </div>
                <div className="flight-reservation-comp-field">
                    <label>Origin</label>
                    <input
                        type="text"
                        value={flightDetails?.origin || ""}
                        readOnly
                        className="flight-reservation-comp-input-readonly"
                    />
                </div>
                <div className="flight-reservation-comp-field">
                    <label>Destination</label>
                    <input
                        type="text"
                        value={flightDetails?.destination || ""}
                        readOnly
                        className="flight-reservation-comp-input-readonly"
                    />
                </div>
                <div className="flight-reservation-comp-field">
                    <label>Departure Time</label>
                    <input
                        type="text"
                        value={flightDetails?.departure || ""}
                        readOnly
                        className="flight-reservation-comp-input-readonly"
                    />
                </div>
                <div className="flight-reservation-comp-field">
                    <label>Number of Travellers</label>
                    <input
                        type="text"
                        value={travellers}
                        onChange={handleTravellersChange}
                        className="flight-reservation-comp-input"
                        placeholder="Enter number of travellers"
                    />
                </div>

                {travellerDetails.map((traveller, index) => (
                    <div key={index} className="flight-reservation-comp-traveller-info">
                        <label className='flight-reservation-comp-traveller-head'>Traveller {index + 1}</label>
                        <div className="flight-reservation-comp-traveller-row">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={traveller.firstName}
                                onChange={(e) => handleTravellerDetailChange(index, 'firstName', e.target.value)}
                                className="flight-reservation-comp-input-small"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={traveller.lastName}
                                onChange={(e) => handleTravellerDetailChange(index, 'lastName', e.target.value)}
                                className="flight-reservation-comp-input-small"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Passport Number"
                            value={traveller.passportNumber}
                            onChange={(e) => handleTravellerDetailChange(index, 'passportNumber', e.target.value)}
                            className="flight-reservation-comp-input"
                        />
                    </div>
                ))}

                <div className="flight-reservation-comp-field">
                    <label>Total Price</label>
                    <input
                        type="text"
                        value={calculateTotalPrice()}
                        readOnly
                        className="flight-reservation-comp-input-readonly"
                    />
                </div>

                <button onClick={handleReservation} className="flight-reservation-comp-button">
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}
