import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
export default function Footer() {
  return (
    <MDBFooter style={{ backgroundColor: '#001f3f', color: '#ffffff',fontFamily:'Poppins' }} className='text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom' style={{ borderColor: '#17a2b8' }}>
        <div className='me-5 d-none d-lg-block'>
          <span style={{ color: '#f8f9fa' }}>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href='' className='me-4 text-reset'>
            <MDBIcon style={{ color: '#17a2b8' }} fab icon='facebook-f' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon style={{ color: '#17a2b8' }} fab icon='twitter' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon style={{ color: '#17a2b8' }} fab icon='google' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon style={{ color: '#17a2b8' }} fab icon='instagram' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon style={{ color: '#17a2b8' }} fab icon='linkedin' />
          </a>
          <a target='_blank' href='https://github.com/Armughan-Ather/BookNGo-Database-Project' className='me-4 text-reset'>
            <MDBIcon style={{ color: '#17a2b8' }} fab icon='github' />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: '#17a2b8' }}>
                <MDBIcon icon='gem' className='me-3' />
                BookNGo
              </h6>
              <p style={{ color: '#f8f9fa' }}>
              Whether you're planning your next vacation, a business trip, or a last-minute getaway, BookNGo is here to make it happen. Your journey begins with us.
              </p>
            </MDBCol>

            <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: '#17a2b8' }}>Services</h6>
              <p style={{ color: '#f8f9fa' }}>
                <a href='/packages' className='text-reset' >
                  Packages
                </a>
              </p>
              <p style={{ color: '#f8f9fa' }}>
                <a href='/flights' className='text-reset' style={{ color: '#f8f9fa' }}>
                  Flights
                </a>
              </p>
              <p style={{ color: '#f8f9fa' }}>
                <a href='/hotels' className='text-reset' style={{ color: '#f8f9fa' }}>
                  Hotels
                </a>
              </p>
              <p>
                {/* <a href='#!' className='text-reset' style={{ color: '#f8f9fa' }}>
                  Laravel
                </a> */}
              </p>
            </MDBCol>

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: '#17a2b8' }}>Useful links</h6>
              <p style={{ color: '#f8f9fa' }}>
                <a href='/' className='text-reset' style={{ color: '#f8f9fa' }}>
                  Home
                </a>
              </p>
              <p style={{ color: '#f8f9fa' }}>
                <a href='/profile' className='text-reset' style={{ color: '#ffffff' }}>
                  Reservation History
                </a>
              </p>
              <p style={{ color: '#f8f9fa' }}>
                <a href='/about' className='text-reset' style={{ color: '#f8f9fa' }}>
                  About Us
                </a>
              </p>
              
              
              <p style={{ color: '#f8f9fa' }}>
                <a href='#!' className='text-reset' style={{ color: '#f8f9fa' }}>
                  Help
                </a>
              </p>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: '#17a2b8' }}>Contact</h6>
              <p style={{ color: '#f8f9fa' }}>
                <MDBIcon icon='home' className='me-2' style={{ color: '#17a2b8' }} />
                Fast University Karachi
              </p>
              <p style={{ color: '#f8f9fa' }}>
                <MDBIcon icon='envelope' className='me-3' style={{ color: '#17a2b8' }} />
                k224416@nu.edu.pk
              </p>
              <p style={{ color: '#f8f9fa' }}>
                <MDBIcon icon='envelope' className='me-3' style={{ color: '#17a2b8' }} />
                k224611@nu.edu.pk
              </p>
              <p style={{ color: '#f8f9fa' }}>
                <MDBIcon icon='envelope' className='me-3' style={{ color: '#17a2b8' }} />
                k224643@nu.edu.pk
              </p>
              {/* <p>
                <MDBIcon icon='phone' className='me-3' style={{ color: '#17a2b8' }} /> + 01 234 567 88
              </p>
              <p>
                <MDBIcon icon='print' className='me-3' style={{ color: '#17a2b8' }} /> + 01 234 567 89
              </p> */}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: '#17a2b8', color: '#ffffff' }}>
        © 2024 Copyright : 
        
        <a className='text-reset fw-bold' href='/' style={{ color: '#ffffff',marginLeft:'0.5rem' }}>
          BOOKNGO
        </a>
      </div>
    </MDBFooter>
  );
}
