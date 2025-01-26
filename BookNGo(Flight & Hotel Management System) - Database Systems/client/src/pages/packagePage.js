import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import PackageCardComponent from '../components/PackageCardComponent';
import { MDBInput } from 'mdb-react-ui-kit';
import '../styles/packagesPage.css';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  React.useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/bundle/searchValidBundles');
        setPackages(response.data.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  // Memoize filtered packages
  const filteredPackages = useMemo(() => {
    if (!searchTerm) return packages;

    const term = searchTerm.toLowerCase();

    return packages.filter((pkg) => {
      const origin = pkg.origin?.toLowerCase() || '';
      const destination = pkg.destination?.toLowerCase() || '';
      const hotelName = pkg.hotelName?.toLowerCase() || '';

      // Check for 'City1 to City2' format
      const formattedRoute = `${origin} to ${destination}`;

      // Match search term with origin, destination, hotel name, or formatted route
      return (
        origin.includes(term) ||
        destination.includes(term) ||
        hotelName.includes(term) ||
        formattedRoute.includes(term)
      );
    });
  }, [searchTerm, packages]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="bookngo-packages-page-container">
      <div className="bookngo-packages-search-container">
        <MDBInput
          label="Search Packages"
          id="search-packages"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="bookngo-packages-search-bar"
          placeholder="Search by origin, destination, hotelName or 'Karachi to Lahore'"
        />
      </div>

      <div className="bookngo-packages-card-container">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg, index) => (
            <PackageCardComponent
              key={index}
              packageData={pkg}
              returnDate={pkg.returnDate}
              departureDate={pkg.onwardDate}
              Rating={pkg.avgRating}
              origin={pkg.origin}
              destination={pkg.destination}
              hotelName={pkg.hotelName}
              departureAirline={pkg.onwardAirline}
              returnAirline={pkg.returnAirline}
            />
          ))
        ) : (
          <p className="bookngo-packages-no-results">
            No packages match your search. Please try a different term.
          </p>
        )}
      </div>
    </div>
  );
}
