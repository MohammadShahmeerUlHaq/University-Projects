import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminFlights.css';

export default function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To track if we are in edit mode
  const [editFlight, setEditFlight] = useState(null); // Store the selected flight for editing
  const [formData, setFormData] = useState({
    id: '',
    airlineId: '',
    airlineName: '',
    departure: '',
    destination: '',
    origin: '',
    price: '',
    status: 'Scheduled',
    numSeats: '',
  });
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const formatDate = (utcDate) => {
    if (!utcDate) return ''; // Handle empty or undefined date
    const date = new Date(utcDate);
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  async function getFlights() {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/admins/getAllFlights');
      setFlights(response.data);
    } catch (error) {
      console.error('Error getting admin flights:', error);
    }
  }

  useEffect(() => {
    getFlights();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFlight = async () => {
    try {
        console.log({airlineName: formData.airlineName,
            departure: formData.departure,
            destination: formData.destination,
            origin: formData.origin,
            price: formData.price,
            numSeats: formData.numSeats})
      await axios.post('http://localhost:8000/api/v1/admins/addFlight', {
        airlineName: formData.airlineName,
        departure: formData.departure,
        destination: formData.destination,
        origin: formData.origin,
        price: formData.price,
        numSeats: formData.numSeats,
      });
      setShowModal(false);
      setFormData({
        id: '',
        airlineId: '',
        airlineName: '',
        departure: '',
        destination: '',
        origin: '',
        price: '',
        status: 'Scheduled',
        numSeats: '',
      });
      getFlights();
    } catch (error) {
      console.error('Error adding flight:', error);
      alert(error?.response?.data?.error)
    }
  };

  const handleEditClick = (flight) => {
    setIsEditing(true);
    setEditFlight(flight); // Store the selected flight to edit
    setFormData({
      id: flight.id,
      airlineId: flight.airlineId,
      airlineName: flight.airlineName,
      departure: flight.departure,
      destination: flight.destination,
      origin: flight.origin,
      price: flight.price,
      status: flight.status,
      numSeats: flight.numSeats,
    });
    setShowModal(true);
  };

  const handleUpdateFlight = async () => {
    try {
      await axios.post('http://localhost:8000/api/v1/admins/updateFlight', {
        id: formData.id,
        departure: formData.departure,
        numSeats: formData.numSeats,
        status: formData.status,
        price: formData.price,
      });
      setShowModal(false);
      setFormData({
        id: '',
        airlineId: '',
        airlineName: '',
        departure: '',
        destination: '',
        origin: '',
        price: '',
        status: 'Scheduled',
        numSeats: '',
      });
      setIsEditing(false); // Reset the editing state
      getFlights();
    } catch (error) {
      console.error('Error updating admin flight:', error);
      alert(error?.response?.data?.error)
    }
  };
  console.log('admin flights :',flights);
  return (
    <div className="admin-flights-comp-container">
      <h1 className="admin-flights-comp-title">Manage Flights</h1>
      <button
        className="admin-flights-comp-add-btn"
        onClick={() => { setShowModal(true); setIsEditing(false); }}
      >
        Add New Flight
      </button>
      <table className="admin-flights-comp-table">
        <thead className="admin-flights-comp-thead">
          <tr>
            <th>ID</th>
            <th>Airline Name</th>
            <th>Departure</th>
            <th>Destination</th>
            <th>Origin</th>
            <th>Price</th>
            <th>Status</th>
            <th>Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="admin-flights-comp-tbody">
          {flights.map(flight => (
            <tr key={flight.id}>
              <td>{flight.id}</td>
              <td>{flight.airlineName}</td>
              <td>{formatDate(flight.departure)}</td>
              <td>{flight.destination}</td>
              <td>{flight.origin}</td>
              <td>{flight.price}</td>
              <td>{flight.status}</td>
              <td>{flight.numSeats}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditClick(flight)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="admin-flights-comp-modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? 'Edit Flight' : 'Add New Flight'}</h5>
                <button onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
              {!isEditing && (<input
                  type="text"
                  name="airlineName"
                  placeholder="Airline Name"
                  value={formData.airlineName}
                  onChange={handleInputChange}
                />)}
                <input
                  type="datetime-local"
                  name="departure"
                  placeholder="Departure"
                  value={formData.departure}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="destination"
                  placeholder="Destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="origin"
                  placeholder="Origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="numSeats"
                  placeholder="Number of Seats"
                  value={formData.numSeats}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={isEditing ? handleUpdateFlight : handleAddFlight}
                >
                  {isEditing ? 'Update' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
