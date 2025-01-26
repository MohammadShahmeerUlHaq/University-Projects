import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import "./pageNotFound.css";
export default function PageNotFound() {
  return (
    <MDBContainer fluid className="error-404-comp-wrapper">
      <MDBRow className="error-404-comp-row">
        <MDBCol md="12" className="text-center">
          <h1 className="error-404-comp-title">404</h1>
          <h2 className="error-404-comp-subtitle">Page Not Found</h2>
          <p className="error-404-comp-description">
            The page you are looking for might have been removed or is temporarily unavailable.
          </p>
        </MDBCol>
      </MDBRow>
      
    </MDBContainer>
  );
}
