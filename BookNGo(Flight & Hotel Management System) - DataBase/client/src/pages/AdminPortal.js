import React, { useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "../styles/AdminPortal.css";
import axios from "axios";

export default function AdminPortal() {
  const [hotelModal, setHotelModal] = useState(false);
  const [flightModal, setFlightModal] = useState(false);

  const [hotelDetails, setHotelDetails] = useState({
    name: "",
    standard: "",
    deluxe: "",
    location: "",
    pricePerNightStandard: "",
    pricePerNightDeluxe: "",
  });

  const [flightDetails, setFlightDetails] = useState({
    airlineId: "",
    departure: "",
    destination: "",
    origin: "",
    price: "",
    numSeats: "",
  });
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const handleHotelChange = (e) => {
    setHotelDetails({ ...hotelDetails, [e.target.name]: e.target.value });
  };

  const handleFlightChange = (e) => {
    setFlightDetails({ ...flightDetails, [e.target.name]: e.target.value });
  };

  const addHotel = async () => {
    try {
      await axios.post("/api/hotels", hotelDetails);
      alert("Hotel added successfully!");
      setHotelModal(false);
      setHotelDetails({
        name: "",
        standard: "",
        deluxe: "",
        location: "",
        pricePerNightStandard: "",
        pricePerNightDeluxe: "",
      });
    } catch (error) {
      console.error("Error adding hotel:", error);
      alert("Failed to add hotel.");
    }
  };

  const addFlight = async () => {
    try {
      await axios.post("/api/flights", flightDetails);
      alert("Flight added successfully!");
      setFlightModal(false);
      setFlightDetails({
        airlineId: "",
        departure: "",
        destination: "",
        origin: "",
        price: "",
        numSeats: "",
      });
    } catch (error) {
      console.error("Error adding flight:", error);
      alert("Failed to add flight.");
    }
  };

  return (
    <div className="admin-portal-comp-container">
      <h1 className="admin-portal-comp-title">Admin Portal</h1>
      <div className="admin-portal-comp-actions">
        <button
          className="btn btn-primary"
          onClick={() => setHotelModal(true)}
        >
          Add New Hotel
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setFlightModal(true)}
        >
          Add New Flight
        </button>
      </div>

      {/* Hotel Modal */}
      {hotelModal && (
        <div className="admin-portal-comp-modal">
          <div className="admin-portal-comp-modal-content">
            <h2>Add New Hotel</h2>
            <input
              type="text"
              name="name"
              placeholder="Hotel Name"
              value={hotelDetails.name}
              onChange={handleHotelChange}
              className="form-control mb-3"
            />
            <input
              type="number"
              name="standard"
              placeholder="Standard Rooms"
              value={hotelDetails.standard}
              onChange={handleHotelChange}
              className="form-control mb-3"
            />
            <input
              type="number"
              name="deluxe"
              placeholder="Deluxe Rooms"
              value={hotelDetails.deluxe}
              onChange={handleHotelChange}
              className="form-control mb-3"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={hotelDetails.location}
              onChange={handleHotelChange}
              className="form-control mb-3"
            />
            <input
              type="number"
              name="pricePerNightStandard"
              placeholder="Price Per Night (Standard)"
              value={hotelDetails.pricePerNightStandard}
              onChange={handleHotelChange}
              className="form-control mb-3"
            />
            <input
              type="number"
              name="pricePerNightDeluxe"
              placeholder="Price Per Night (Deluxe)"
              value={hotelDetails.pricePerNightDeluxe}
              onChange={handleHotelChange}
              className="form-control mb-3"
            />
            <div className="admin-portal-comp-modal-actions">
              <button className="btn btn-success" onClick={addHotel}>
                Confirm
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setHotelModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flight Modal */}
      {flightModal && (
        <div className="admin-portal-comp-modal">
          <div className="admin-portal-comp-modal-content">
            <h2>Add New Flight</h2>
            <input
              type="number"
              name="airlineId"
              placeholder="Airline ID"
              value={flightDetails.airlineId}
              onChange={handleFlightChange}
              className="form-control mb-3"
            />
            <input
              type="datetime-local"
              name="departure"
              placeholder="Departure Time"
              value={flightDetails.departure}
              onChange={handleFlightChange}
              className="form-control mb-3"
            />
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={flightDetails.destination}
              onChange={handleFlightChange}
              className="form-control mb-3"
            />
            <input
              type="text"
              name="origin"
              placeholder="Origin"
              value={flightDetails.origin}
              onChange={handleFlightChange}
              className="form-control mb-3"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={flightDetails.price}
              onChange={handleFlightChange}
              className="form-control mb-3"
            />
            <input
              type="number"
              name="numSeats"
              placeholder="Number of Seats"
              value={flightDetails.numSeats}
              onChange={handleFlightChange}
              className="form-control mb-3"
            />
            <div className="admin-portal-comp-modal-actions">
              <button className="btn btn-success" onClick={addFlight}>
                Confirm
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setFlightModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
