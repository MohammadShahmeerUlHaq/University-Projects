import React, { useState,useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  MDBInput,
  MDBBtn,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import "../styles/ReservationModification.css";
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function ReservationModificationsPage() {
    const { user,isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    if(!isAuthenticated){
      navigate('/');
    }
    React.useEffect(() => {
      window.scrollTo(0, 0); // Scroll to the top of the page
    }, []);

    const username = user?.username;
    const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numRooms, setNumRooms] = useState("");
  const [roomType, setRoomType] = useState("Standard");
  const [numSeats, setNumSeats] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const { bookingData, type } = location.state;

  const handleUpdateReservation =async  () => {
    if (type === "hotel" && (!startDate || !endDate || !numRooms)) {
      setError("Please fill out all fields.");
      return;
    }

    if (type === "flight" && !numSeats) {
      setError("Please fill out all fields.");
      return;
    }

    setError("");

    // console.log(
    //   type === "hotel"
    //     ? {
    //         startDate,
    //         endDate,
    //         numRooms,
    //         roomType,
    //       }
    //     : {
    //         numSeats,
    //       }
    // );
    
    console.log({numSeats,seats:bookingData.reservedSeats})
    console.log({reservationId:bookingData.reservationId,reservationRooms:bookingData.reservationRooms,
        reservationStartDate:bookingData.reservationStartDate,reservationEndDate:bookingData.reservationEndDate,
        reservationType:bookingData.reservationType})

    if(type=='flight' && numSeats==bookingData.reservedSeats){
        setError(`You have already reserved ${numSeats} seat(s)`)
        console.log(error)
        return;
    }
    if(type=='hotel' && numRooms==bookingData.reservationRooms && roomType==bookingData.reservationType
        && startDate==bookingData.reservationStartDate && endDate==bookingData.reservationEndDate){
        setError(`Kindly modify anything in your reservation`)
        return;
    }
    
    if(type==='flight'){
        try{
            const response=await axios.post('http://localhost:8000/api/v1/flightReservation/updateFlightReservation',{
                seats:numSeats,
                reservationId:bookingData.reservationId
            })
            let amount=response.data.changeInBill;
            console.log('response flight modi :',response.data)
            if(response.data.changeInBill>0){
                const BookingDatav2={
                    bookingType:'Flight Modification',
                    amount,
                    bookingDetails:{
                        reservationId:bookingData.reservationId,
                        seats:numSeats
                        
                    },
                    username
                }
                navigate('/payment',{state:BookingDatav2})
            }else{
                alert(`Modification Successful.You will be refunded ${amount*-1} in next 7 business days.`)
                navigate('/')
            }
        }catch(error){
            console.log("error in flight modi :",error)
            setError(error?.response?.data?.error);
            
        }
    }
    else if(type=='hotel'){
        try{
            const response=await axios.post('http://localhost:8000/api/v1/hotelReservation/updateHotelReservation',{
                reservationId:bookingData.reservationId,
                reservationStartDate:startDate,
                reservationEndDate:endDate,
                roomType:roomType,
                rooms:numRooms
            })
            let amount=response.data.changeInBill;
            console.log('response hotel modi :',response.data)
            if(amount>0){
                const BookingDatav2={
                    bookingType:'Hotel Modification',
                    amount,
                    bookingDetails:{
                        reservationId:bookingData.reservationId,
                        reservationStartDate:startDate,
                        reservationEndDate:endDate,
                        roomType,
                        rooms:numRooms
                    },
                    username
                }
                navigate('/payment',{state:BookingDatav2})
            }else{
                alert(`Modification Successful.You will be refunded ${amount*-1} in next 7 business days.`)
                 navigate('/')
            }
        }catch(error){
          console.log("error in flight modi :",error)
            setError(error?.response?.data?.error);
        }
    }
};

  return (
    <div className="user-reservations-modifications-comp-container">
      <h2 className="user-reservations-modifications-comp-heading">
        Modify Your Reservation
      </h2>
      <p className="user-reservations-modifications-comp-description">
        {type === "hotel"
          ? "Update the start and end dates, number of rooms, and room type for your reservation."
          : "Update the number of seats for your flight reservation."}
      </p>
      <div className="user-reservations-modifications-comp-form">
        {type === "hotel" && (
          <>
            {/* Row 1: Start Date and End Date */}
            <div className="user-reservations-modifications-comp-row">
              <MDBInput
                label="Start Date"
                type="date"
                className="user-reservations-modifications-comp-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <MDBInput
                label="End Date"
                type="date"
                className="user-reservations-modifications-comp-field"
                value={endDate}
                
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Row 2: Number of Rooms and Room Type */}
            <div className="user-reservations-modifications-comp-row">
              <MDBInput
                label="Number of Rooms"
                type="number"
                className="user-reservations-modifications-comp-field"
                value={numRooms}
                onChange={(e) =>
                  setNumRooms(e.target.value.replace(/[^0-9]/g, ""))
                }
              />
              <MDBDropdown className="user-reservations-modifications-comp-dropdown">
                <MDBDropdownToggle className="user-reservations-modifications-comp-dropdown-toggle">
                  {roomType}
                </MDBDropdownToggle>
                <MDBDropdownMenu className="user-reservations-modifications-comp-dropdown-menu">
                  <MDBDropdownItem
                    className="user-reservations-modifications-comp-dropdown-item"
                    onClick={() => setRoomType("Standard")}
                  >
                    Standard
                  </MDBDropdownItem>
                  <MDBDropdownItem
                    className="user-reservations-modifications-comp-dropdown-item"
                    onClick={() => setRoomType("Deluxe")}
                  >
                    Deluxe
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </div>
          </>
        )}

        {type === "flight" && (
          <div className="user-reservations-modifications-comp-row">
            <MDBInput
              label="Number of Seats"
              type="number"
              className="user-reservations-modifications-comp-field"
              value={numSeats}
              onChange={(e) =>
                setNumSeats(e.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="user-reservations-modifications-comp-error">
            {error}
          </div>
        )}

        {/* Update Button */}
        <MDBBtn
          className="user-reservations-modifications-comp-btn"
          onClick={handleUpdateReservation}
        >
          Update Reservation
        </MDBBtn>
      </div>
    </div>
  );
}
