import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HomePage.css";
import image1 from "../images/airlineweb-2.png";
import image2 from "../images/homeSliderImage4.jpg";
import image3 from "../images/homeSliderImage.jpg";
import image4 from "../images/homeSliderImage2.jpg";
import image5 from "../images/homeSliderImage3.jpg";
import { useNavigate } from "react-router-dom"
const images = [
  { src: image3 },
  { src: image1 },
  { src: image2 },
  { src: image4 },
  { src: image5 },
];

export default function HomePage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0);
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  React.useEffect(()=>{
    async function updateHotelReservationStatus(){
        try{
            const response=await axios.get('http://localhost:8000/api/v1/admins/updateHotelReservationStatuses');
            console.log(response.data.data)
        }catch(error){
            console.log(error?.response.data.error)
        }
    }
    async function updateFlightReservationStatus(){
        try{
            const response=await axios.get('http://localhost:8000/api/v1/admins/updateFlightReservationStatuses');
            console.log(response.data.data)
        }catch(error){
            console.log(error?.response.data.error)
        }
    }
    updateHotelReservationStatus();
    updateFlightReservationStatus();

},[])
  function navigator(link){
    navigate(link);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const visibleImages = [
    images[currentIndex],
    images[(currentIndex + 1) % images.length],
    images[(currentIndex + 2) % images.length],
  ];

  return (
    <div className="home-page-comp-container">
      {/* Hero Section */}
      <section className="home-page-comp-hero">
        <h1 className="home-page-comp-hero-title">Welcome to BOOKNGO</h1>
        <p className="home-page-comp-hero-description">
          Book Easy, Travel Happy
        </p>
      </section>

      {/* Carousel Section */}
      <div className="home-page-comp-carousel">
        <div className="home-page-comp-carousel-images-container">
          {visibleImages.map((image, index) => (
            <div key={index} className="home-page-comp-carousel-image-wrapper">
              <img
                src={image.src}
                alt={`Slide ${index + 1}`}
                className="home-page-comp-carousel-image"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section className="home-page-comp-services">
        {/* <h2 className="home-page-comp-services-title">Our Services</h2> */}
        <div className="home-page-comp-services-container">
          <div className="home-page-comp-service">
            <h3 className="home-page-comp-service-title">Affordable Flights</h3>
            <p className="home-page-comp-service-description">
              Discover unbeatable prices on flights to destinations around the globe.
            </p>
            <button className="home-page-comp-service-btn" onClick={()=> navigator('/flights')}>Explore Flights</button>
          </div>
          <div className="home-page-comp-service">
            <h3 className="home-page-comp-service-title">Luxury Hotels</h3>
            <p className="home-page-comp-service-description">
              Stay in luxury hotels with exclusive offers and packages.
            </p>
            <button className="home-page-comp-service-btn" onClick={()=> navigator('/hotels')}>Explore Hotels</button>
          </div>
          <div className="home-page-comp-service">
            <h3 className="home-page-comp-service-title">All-Inclusive Packages</h3>
            <p className="home-page-comp-service-description">
              Explore customized vacation packages tailored to your needs.
            </p>
            <button className="home-page-comp-service-btn" onClick={()=> navigator('/packages')}>Explore Packages</button>
          </div>
        </div>
      </section>
    </div>
  );
}
