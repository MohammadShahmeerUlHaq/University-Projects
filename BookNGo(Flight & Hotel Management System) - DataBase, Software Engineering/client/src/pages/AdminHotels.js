import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminHotels.css';

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if we are in edit mode
  const [editHotel, setEditHotel] = useState(null); // Store the selected hotel for editing
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    standard: '',
    deluxe: '',
    location: '',
    pricePerNightStandard: '',
    pricePerNightDeluxe: '',
  });
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  async function getHotels() {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/admins/getAllHotels');
      setHotels(response.data);
    } catch (error) {
      console.log('Error getting hotels admin:', error);
    }
  }

  useEffect(() => {
    getHotels();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddHotel = async () => {
    if(formData.pricePerNightDeluxe<=0 || formData.pricePerNightStandard<=0){
      alert('Price of rooms should be greater than 0')
      return 
    }
    if(formData.standard<=0 && formData.deluxe<=0){
      alert('No of rooms should be positive')
      return 
    }
    if(formData.standard<0 || formData.deluxe<0){
      alert('No of rooms should be positive')
      return 
    }

    try {

      const response = await axios.post('http://localhost:8000/api/v1/admins/addHotel', {
        name: formData.name,
        standard: formData.standard,
        deluxe: formData.deluxe,
        location: formData.location,
        pricePerNightStandard: formData.pricePerNightStandard,
        pricePerNightDeluxe: formData.pricePerNightDeluxe,
      });
      setShowModal(false);
      setFormData({
        name: '',
        standard: '',
        deluxe: '',
        location: '',
        pricePerNightStandard: '',
        pricePerNightDeluxe: '',
      });
      getHotels();
    } catch (error) {
      console.log('Error adding hotels admin:', error);
      alert(error?.response?.data?.error);
    }
  };

  const handleEditClick = (hotel) => {
    setIsEditing(true);
    setEditHotel(hotel); // Store the selected hotel to edit
    
    setFormData({
      id: hotel.id,
      name: hotel.name,
      standard: hotel.standard,
      deluxe: hotel.deluxe,
      location: hotel.location,
      pricePerNightStandard: hotel.pricePerNightStandard,
      pricePerNightDeluxe: hotel.pricePerNightDeluxe,
    });
    setShowModal(true);
  };

  const handleUpdateHotel = async () => {
    try {
      if(formData.pricePerNightDeluxe<=0 || formData.pricePerNightStandard<=0){
        alert('Price of rooms should be greater than 0')
        return 
      }
      if(formData.standard<=0 && formData.deluxe<=0){
        alert('No of rooms should be positive')
        return 
      }
      if(formData.standard<0 || formData.deluxe<0){
        alert('No of rooms should be positive')
        return 
      }
      const response = await axios.post('http://localhost:8000/api/v1/admins/updateHotel', {
        id: formData.id,
        standard: formData.standard,
        deluxe: formData.deluxe,
        pricePerNightStandard: formData.pricePerNightStandard,
        pricePerNightDeluxe: formData.pricePerNightDeluxe,
      });
      setShowModal(false);
      setFormData({
        name: '',
        standard: '',
        deluxe: '',
        location: '',
        pricePerNightStandard: '',
        pricePerNightDeluxe: '',
      });
      setIsEditing(false);
      getHotels();
    } catch (error) {
      console.error('Error updating hotel admin:', error);
      alert(error?.response?.data?.error)
    }
  };

  return (
    <div className="admin-hotels-comp-container">
      <h1 className="admin-hotels-comp-title">Manage Hotels</h1>
      <button
        className="admin-hotels-comp-add-btn"
        onClick={() => {
          setShowModal(true);
          setIsEditing(false);
        }}
      >
        Add New Hotel
      </button>
      <table className="admin-hotels-comp-table">
        <thead className="admin-hotels-comp-thead">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Standard Rooms</th>
            <th>Deluxe Rooms</th>
            <th>Location</th>
            <th>Price/Standard</th>
            <th>Price/Deluxe</th>
            <th>Actions</th> {/* Removed delete button */}
          </tr>
        </thead>
        <tbody className="admin-hotels-comp-tbody">
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.id}</td>
              <td>{hotel.name}</td>
              <td>{hotel.standard}</td>
              <td>{hotel.deluxe}</td>
              <td>{hotel.location}</td>
              <td>{hotel.pricePerNightStandard}</td>
              <td>{hotel.pricePerNightDeluxe}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditClick(hotel)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="admin-hotels-comp-modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? 'Edit Hotel' : 'Add New Hotel'}
                </h5>
                <button onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  name="name"
                  placeholder="Hotel Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="standard"
                  placeholder="Standard Rooms"
                  value={formData.standard}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="deluxe"
                  placeholder="Deluxe Rooms"
                  value={formData.deluxe}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="pricePerNightStandard"
                  placeholder="Price/Standard Room"
                  value={formData.pricePerNightStandard}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="pricePerNightDeluxe"
                  placeholder="Price/Deluxe Room"
                  value={formData.pricePerNightDeluxe}
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
                  onClick={isEditing ? handleUpdateHotel : handleAddHotel}
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
