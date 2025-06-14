import React,{useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';
import { RiStarSFill, RiStarHalfSFill, RiStarLine } from 'react-icons/ri';
import { TbLineDotted } from "react-icons/tb";
import { IoIosPin } from "react-icons/io";
import '../styles/flightSearchResultsCard.css';
import { AuthContext } from '../Context/AuthContext';

export default function FlightSearchResultCard(props) {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(AuthContext); // Get authentication status from context

    // Calculate stars
    let fullStars = Math.floor(props.rating);
    let emptyStars = 5 - Math.ceil(props.rating);
    let halfStars = props.rating % 1 > 0 ? 1 : 0;

    let stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(<RiStarSFill key={`full-${i}`} className="flight-search-results-comp-stars" />);
    }
    if (halfStars) {
        stars.push(<RiStarHalfSFill key="half" className="flight-search-results-comp-stars" />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<RiStarLine key={`empty-${i}`} className="flight-search-results-comp-stars-not-filled" />);
    }
    

    // Handle booking navigation
    const handleBooking = () => {
        const flightDetails = {
            airline: props.airline,
            origin: props.origin,
            destination: props.destination,
            departure: props.departure,
            price: props.price,
            flightId: props.flightId
        };

        // Check if the user is authenticated
        if (isAuthenticated) {
            // If logged in, pass the flight details to the reservation page
            navigate('/flights/reservation', { state: flightDetails });
        } else {
            // If not logged in, redirect to login page and pass flight details with state
            navigate('/login', { state: { redirectTo: '/flights/reservation', flightDetails } });
        }
    };

    return (
        <MDBCard className="flight-search-results-comp-card shadow-sm">
            <MDBCardBody>
                {/* Airline Title */}
                <MDBCardTitle className="flight-search-results-comp-card-title">
                    {props.airline}
                    <MDBIcon icon="plane" className="ms-2 text-primary" />
                </MDBCardTitle>

                {/* Flight Route */}
                <MDBCardText className="flight-search-results-comp-card-route">
                    <span className="flight-search-results-comp-from">
                        <span className="flight-search-results-comp-origin-destination">{props.origin}</span>
                        <IoIosPin className="flight-search-results-comp-way-pin" />
                        <TbLineDotted className="flight-search-results-comp-way-line" />
                        <TbLineDotted className="flight-search-results-comp-way-line" />
                        <TbLineDotted className="flight-search-results-comp-way-line" />
                        <IoIosPin className="flight-search-results-comp-way-pin" />
                        <span className="flight-search-results-comp-origin-destination">{props.destination}</span>
                    </span>
                </MDBCardText>

                {/* Rating */}
                <MDBCardText className="flight-search-results-comp-rating">
                    <span className="flight-search-results-comp-stars">
                        {stars} <span className="flight-search-results-comp-ratingsCount">({props.ratingCount})</span>
                    </span>
                </MDBCardText>

                {/* Flight Information */}
                <MDBCardText className="flight-search-results-comp-card-info">
                    <span className="flight-search-results-comp-departure">
                        <MDBIcon fas icon="clock" className="me-2" /> Departure Time : {props.departure}
                    </span>
                    <span className="flight-search-results-comp-price">
                        <MDBIcon fas icon="dollar-sign" className="me-2" /> <span className='flight-search-results-comp-price-value'>{props.price}</span>
                    </span>
                </MDBCardText>

                {/* Book Button */}
                <MDBBtn color="primary" className="flight-search-results-comp-book-btn" onClick={handleBooking}>
                    Book Now
                </MDBBtn>
            </MDBCardBody>
        </MDBCard>
    );
}
