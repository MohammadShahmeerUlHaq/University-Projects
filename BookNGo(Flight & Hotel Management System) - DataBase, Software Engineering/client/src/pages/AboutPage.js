import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import "../styles/aboutPage.css";

const AboutPage = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  return (
    
    <MDBContainer fluid className="about-page-comp-wrapper">
      <MDBRow className="about-page-comp-header">
        <MDBCol>
          <h1 className="about-page-comp-title">About Us</h1>
          <p className="about-page-comp-subtitle">
            Learn more about BookNGo and our mission to make travel seamless.
            
          </p>
        </MDBCol>
      </MDBRow>

      <MDBRow className="about-page-comp-section">
        <MDBCol md="12" lg="10" className="mx-auto">
          <MDBCard className="about-page-comp-card">
            <MDBCardBody>
              <h2 className="about-page-comp-section-title">Our Mission</h2>
              <p className="about-page-comp-section-text">
                At BookNGo, we aim to revolutionize travel by providing an all-in-one platform
                for booking flights, hotels, and travel packages. Our focus is on delivering
                a user-friendly experience, competitive pricing, and exceptional customer
                support to make your travel planning stress-free and enjoyable.
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <MDBRow className="about-page-comp-section">
        <MDBCol md="12" lg="10" className="mx-auto">
          <MDBCard className="about-page-comp-card">
            <MDBCardBody>
              <h2 className="about-page-comp-section-title">Why Choose Us?</h2>
              <ul className="about-page-comp-list">
                <li>Comprehensive booking platform for hotels, flights, and packages.</li>
                <li>Transparent pricing with no hidden fees.</li>
                <li>Secure bookings.</li>
                <li>Secure and fast payment options for peace of mind.</li>
                <li>Easy Cancellations.</li>
                <li>Exclusive deals and discounts for loyal customers.</li>
              
              </ul>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <MDBRow className="about-page-comp-footer">
        <MDBCol>
          <h3 className="about-page-comp-footer-title">Experience Travel, Simplified.</h3>
          <p className="about-page-comp-footer-text">
            Whether you're planning your next vacation, a business trip, or a last-minute
            getaway, BookNGo is here to make it happen. Your journey begins with us.
          </p>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default AboutPage;
