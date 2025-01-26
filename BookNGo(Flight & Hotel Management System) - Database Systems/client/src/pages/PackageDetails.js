import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/packageDetails.css';
import { AuthContext } from '../Context/AuthContext';

export default function PackageDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const { pkgData, inputData } = location.state;
    React.useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
      }, []);

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
    const handleProceedToPayment = () => {
        const bookingData = {
            bookingType: 'Package',
            amount: inputData.price,
            bookingDetails: {
                bundleId: pkgData.bundleId,
                origin:pkgData.origin,
                destination:pkgData.destination,
                hotelName: pkgData.hotelName,
                onwardDate:convertToLocalTime(pkgData.onwardDate),
                onwardAirline:pkgData.onwardAirline,
                returnDate: convertToLocalTime(pkgData.returnDate),
                returnAirline:pkgData.returnAirline,
                roomType: inputData.roomType,
                numberOfRooms: inputData.numRooms,
                numberOfSeats: inputData.numSeats,
            },
            userName: user?.username,
        };

        navigate('/payment', { state: bookingData });
    };

    return (
        <div className="bookngo-package-final-details-container">
            <h1 className="bookngo-package-final-details-title">{pkgData.origin} To {pkgData.destination} Package</h1>
            <div className="bookngo-package-final-details-box">
                <div className="bookngo-package-final-details-row">
                    <label>Signed In As</label>
                    <input
                        type="text"
                        value={user?.username || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
                <div className="bookngo-package-final-details-row">
                    <label>Departure Flight Time</label>
                    <input
                        type="text"
                        value={convertToLocalTime(pkgData?.onwardDate) || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
                <div className="bookngo-package-final-details-row">
                    <label>Departure Airline</label>
                    <input
                        type="text"
                        value={pkgData?.onwardAirline || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
                <div className="bookngo-package-final-details-row">
                    <label>Number of Seats</label>
                    <input
                        type="number"
                        value={inputData?.numSeats || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
                <div className="bookngo-package-final-details-row">
                    <label>Hotel Name</label>
                    <input
                        type="text"
                        value={pkgData?.hotelName || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
                <div className="bookngo-package-final-details-row">
                    <label>Room Type</label>
                    <input
                        type="text"
                        value={inputData?.roomType || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
                <div className="bookngo-package-final-details-row">
                    <label>Number of Rooms</label>
                    <input
                        type="number"
                        value={inputData?.numRooms || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
                
                
                <div className="bookngo-package-final-details-row">
                    <label>Return Flight Time</label>
                    <input
                        type="text"
                        value={convertToLocalTime(pkgData?.returnDate) || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
                <div className="bookngo-package-final-details-row">
                    <label>Return Airline</label>
                    <input
                        type="text"
                        value={pkgData?.returnAirline || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
                <div className="bookngo-package-final-details-row">
                    <label>Total Price</label>
                    <input
                        type="text"
                        value={`$${inputData?.price}` || ""}
                        readOnly
                        className="bookngo-package-final-details-input-field"
                    />
                </div>
            </div>
            <button
                className="bookngo-package-final-details-proceed-button"
                onClick={handleProceedToPayment}
            >
                Proceed to Payment
            </button>
        </div>
    );
}
