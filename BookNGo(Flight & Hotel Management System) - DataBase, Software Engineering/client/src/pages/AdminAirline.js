import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminAirlines.css';

export default function AdminAirlines() {
  const [airlines, setAirlines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });

  // Fetch airlines from the backend
  async function getAirlines() {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/admins/getAllAirlines');
      setAirlines(response.data);
    } catch (error) {
      console.error('Error fetching airlines:', error);
    }
  }
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  useEffect(() => {
    getAirlines();
  }, []);

  // Handle input change in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add new airline
  const handleAddAirline = async () => {
    try {
      await axios.post('http://localhost:8000/api/v1/admins/addAirline', {
        name: formData.name,
      });
      setShowModal(false);
      setFormData({ name: '' });
      getAirlines();
    } catch (error) {
      console.error('Error adding airline:', error);
      alert(error.response.data.error)
    }
  };

  return (
    <div className="admin-airline-comp-container">
      <h1 className="admin-airline-comp-title">Manage Airlines</h1>
      <button
        className="admin-airline-comp-add-btn"
        onClick={() => setShowModal(true)}
      >
        Add New Airline
      </button>
      <table className="admin-airline-comp-table">
        <thead className="admin-airline-comp-thead">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Rating</th>
            <th>Rating Count</th>
          </tr>
        </thead>
        <tbody className="admin-airline-comp-tbody">
          {airlines.map((airline) => (
            <tr key={airline.id}>
              <td>{airline.id}</td>
              <td>{airline.name}</td>
              <td>{airline.rating}</td>
              
              <td>{airline.ratingCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="admin-airline-comp-modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Airline</h5>
                <button onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  name="name"
                  placeholder="Airline Name"
                  value={formData.name}
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
                  onClick={handleAddAirline}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
