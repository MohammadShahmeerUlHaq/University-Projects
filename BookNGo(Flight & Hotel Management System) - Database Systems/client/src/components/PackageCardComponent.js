import React,{useContext} from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import { RiStarSFill, RiStarHalfSFill, RiStarLine } from 'react-icons/ri';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/packageCardComponent.css';

// Wrap the component with React.memo
const PackageCardComponent = React.memo((props) => {
  const { user, isAuthenticated } = useContext(AuthContext); // Get authentication status from context
  const navigate = useNavigate();
  const handleBookNow = () => {
    console.log(props.packageData)
    // if (!isAuthenticated) {
    //   alert('Please log in to book a package.');
    //   navigate('/login');
    //   return;
    // }

    // Navigate to booking page with bundleId in state
    navigate('/packages/inputdata', {
      state: { pkgData: props.packageData },
    });
  };

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Calculate number of days
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const noOfDays = calculateDays(props.departureDate, props.returnDate);

  // Calculate stars for ratings
  const fullStars = Math.floor(props.Rating);
  const halfStars = props.Rating % 1 > 0 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<RiStarSFill key={`full-${i}`} className="packages-results-card-comp-ratings-stars" />);
  }
  if (halfStars) {
    stars.push(<RiStarHalfSFill key="half" className="packages-results-card-comp-ratings-stars" />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<RiStarLine key={`empty-${i}`} className="packages-results-card-comp-ratings-stars-notfilled" />);
  }

  return (
    <MDBCard className="packages-results-card-comp-card">
      <MDBCardBody>
        <MDBCardTitle className="packages-results-card-comp-title">
          {props.origin} To {props.destination}
        </MDBCardTitle>
        <MDBCardText className="packages-results-card-comp-text">
          <div className="packages-results-card-comp-section">
            <strong>Onboard Date:</strong>
            <span>{formatDate(props.departureDate)}</span>
          </div>
          <div className="packages-results-card-comp-section">
            <strong>Departure Airline:</strong>
            <span>{props.departureAirline}</span>
          </div>
          <div className="packages-results-card-comp-section">
            <strong>Hotel Name:</strong>
            <span>{props.hotelName}</span>
          </div>
          <div className="packages-results-card-comp-section">
            <strong>Return Date:</strong>
            <span>{formatDate(props.returnDate)}</span>
          </div>
          <div className="packages-results-card-comp-section">
            <strong>Return Airline:</strong>
            <span>{props.returnAirline}</span>
          </div>
          <div className="packages-results-card-comp-section">
            <strong>Duration:</strong>
            <span>{noOfDays} {noOfDays > 1 ? 'days' : 'day'}</span>
          </div>
          <div className="packages-results-card-comp-ratings-container">{stars}</div>
        </MDBCardText>
        <MDBBtn className="packages-results-card-comp-book-button" onClick={handleBookNow}>Book Now</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
});

export default PackageCardComponent;
