import React, { useState,useContext } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaBed, FaTimes } from 'react-icons/fa';
import '../styles/hotelReservationPage.css';
import { AuthContext } from '../Context/AuthContext'; 
import { useLocation, useNavigate } from 'react-router-dom';

export default function HotelReservationPage() {
    const { user} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate to redirect to payment page
    const hotelDetails = location.state;
    console.log("reseve hotel user:",user);
    const [reservationData, setReservationData] = useState({
        startDate: hotelDetails.checkInDate,
        endDate: hotelDetails.checkOutDate,
        numberOfRooms: hotelDetails.rooms,
        totalPrice: 0,
    });
    React.useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
      }, []);
    
    function calculateTotalPrice() {
        if (reservationData.startDate && reservationData.endDate) {
            const timeDiff = Math.abs(reservationData.endDate - reservationData.startDate);
            const dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const pricePerNight =  hotelDetails.price;
            console.log("price per night : ",pricePerNight)
            let totalPrice = pricePerNight * dayCount * hotelDetails?.rooms;
            if(dayCount===0){
                totalPrice=pricePerNight*hotelDetails.rooms;     
            }
            setReservationData(prevState => ({
                ...prevState,
                totalPrice: totalPrice
            }));
        }
        else if(reservationData.startDate===null || reservationData.endDate===null || hotelDetails?.rooms===0){
            setReservationData(prevState => ({
                ...prevState,
                totalPrice: 0
            }));
        }
    }
    console.log("hotel details in reservation page : ",hotelDetails)
    React.useEffect(() => {
        calculateTotalPrice();
    }, []);
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB'); // "dd/MM/yyyy" format
    };
    function handleReservation() {
        const duration = Math.ceil(Math.abs(reservationData.endDate - reservationData.startDate) / (1000 * 3600 * 24));
    
        const bookingData = {
            bookingType: 'Hotel',
            amount: reservationData.totalPrice,
            bookingDetails: {
                HotelId:hotelDetails.hotelId,
                hotelName: hotelDetails.hotelName,
                location: hotelDetails.location,
                roomType: hotelDetails.roomType,
                numberOfRooms: reservationData.numberOfRooms,
                duration: duration,
                startDate:reservationData.startDate,
                endDate:reservationData.endDate
                
            },
            userName:user?.username
        };
        console.log(bookingData)
        navigate('/payment', { state: bookingData });
    }

    return (
        <div className="hotel-reservation-reservation-page-container">
            <h1 className="hotel-reservation-reservation-title">Reservation Details</h1>
            <div className="hotel-reservation-reservation-details">
                <div className="hotel-reservation-reservation-form">
                    <div className="hotel-reservation-details-column">
                        <div className="hotel-reservation-detail">
                            <label>Signed In As</label>
                            <input
                                type="text"
                                value={user?.username || ""}
                                readOnly
                                className="hotel-reservation-input-field hotel-reservation-input-field-view-only"
                            />
                        </div>
                        <div className="hotel-reservation-detail">
                            <label>Hotel Name</label>
                            <input
                                type="text"
                                value={hotelDetails?.hotelName || ""}
                                readOnly
                                className="hotel-reservation-input-field hotel-reservation-input-field-view-only"
                            />
                        </div>
                        <div className="hotel-reservation-detail">
                            <label>Location</label>
                            <input
                                type="text"
                                value={hotelDetails?.location || ""}
                                readOnly
                                className="hotel-reservation-input-field hotel-reservation-input-field-view-only"
                            />
                        </div>
                        <div className="hotel-reservation-detail">
                            <label>Room Type</label>
                            <input
                                type="text"
                                value={hotelDetails?.roomType || ""}
                                readOnly
                                className="hotel-reservation-input-field hotel-reservation-input-field-view-only"
                            />
                        </div>
                        <div className="hotel-reservation-detail">
                            <label className='date-reservations-label-hotel-reservations'>Reservation Start Date</label>
                            <input
                                type="text"
                                value={formatDate(reservationData.startDate)}
                                readOnly
                                className="hotel-reservation-input-field hotel-reservation-input-field-view-only"
                            />
                        </div>
                        <div className="hotel-reservation-detail">
                            <label className='date-reservations-label-hotel-reservationsv2'>Reservation End Date</label>
                            <input
                                type="text"
                                value={formatDate(reservationData.endDate)}
                                readOnly
                                className="hotel-reservation-input-field hotel-reservation-input-field-view-only"
                            />
                        </div>
                        <div className="hotel-reservation-detail">
                            <label>Number of Rooms</label>
                            <input
                                type="number"
                                name="numberOfRooms"
                                value={hotelDetails?.rooms || 0}
                                //onChange={handleChange}
                                readOnly
                                className="hotel-reservation-input-field hotel-reservation-input-field-view-only"
                            />
                        </div>
                        <div className="hotel-reservation-detail">
                            <label>Total Price</label>
                            <input
                                type="text"
                                value={reservationData.totalPrice}
                                readOnly
                                className="hotel-reservation-input-field hotel-reservation-input-field-view-only"
                            />
                        </div>
                        <button className="hotel-reservation-confirm-button" onClick={handleReservation}>
                            Proceed To Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
