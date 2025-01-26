import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaCalendarAlt, FaTimes, FaUser } from 'react-icons/fa';
import { MdFlightTakeoff, MdFlightLand, MdFlight } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/FlightPage.css';
import axios from 'axios';
import cities from 'cities.json'; 
import FlightSearchResultCard from '../components/flightSearchResultsCard.js';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';  

// Custom Date Picker Input
const CustomInput = React.forwardRef(({ onClick, value, onClear, placeholder }, ref) => (
    <div className="flight-input-container" ref={ref}>
        <FaCalendarAlt className="flight-input-icon" onClick={onClick} />
        <input
            type="text"
            className="flight-date-input"
            placeholder={value || placeholder}
            value={value}
            readOnly
            onClick={onClick}
        />
        {value && (
            <FaTimes className="flight-clear-icon" onClick={onClear} />
        )}
    </div>
));

export default function FlightPage() {
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [airlineSuggestions, setAirlineSuggestions] = useState([]);
    const [airlineSearch, setAirlineSearch] = useState([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [showAirlineSuggestions, setShowAirlineSuggestions] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(true);
    const [sortOption, setSortOption] = useState('price');

    const [searchData, setSearchData] = useState({
        origin: "",
        destination: "",
        airline: "",
        departureDate1: "",
        departureDate2: "",
        travelers: "",
    });

    const fromRef = useRef(null);
    const toRef = useRef(null);
    const airlineRef = useRef(null);

    // Indexed cities for fast lookup
    const indexedCities = {};
    cities.forEach(city => {
        const firstLetter = city.name[0].toLowerCase();
        if (!indexedCities[firstLetter]) {
            indexedCities[firstLetter] = [];
        }
        indexedCities[firstLetter].push(city.name);
    });
    React.useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
      }, []);


    // Fetch airlines from backend when the page loads
    useEffect(() => {
        async function fetchAirlines() {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/airlines/allAirlines');
                const airlineNames = response.data.data.map(airline => airline.name);
                setAirlineSearch(airlineNames);
            } catch (error) {
                console.error('Error fetching airlines:', error);
            }
        }

        fetchAirlines();
    }, []);
    function formatDepartureTime(departure) {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;  // Get the user's time zone
        const date = new Date(departure);  // Convert to Date object (UTC time)
    
        // Convert UTC time to the user's local time zone
        const zonedDate = toZonedTime(date, userTimeZone);  // Use toZonedTime instead of utcToZonedTime
    
        // Format the date in "dd/MM/yyyy HH:mm" format
        return format(zonedDate, 'HH:mm dd/MM/yyyy');
    }
    // Handle city input change for "From" and "To"
    function handleCityChange(event, type) {
        const { value } = event.target;
        setSearchData(prevState => ({
            ...prevState,
            [type]: value
        }));

        if (value.length > 0) {
            const firstLetter = value[0].toLowerCase();

            const citySuggestions = indexedCities[firstLetter]?.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            ) || [];

            const filteredSuggestions = [value, ...citySuggestions].slice(0, 5);

            if (type === 'origin') {
                setFromSuggestions(filteredSuggestions);
                setShowFromSuggestions(true);
            } else if (type === 'destination') {
                setToSuggestions(filteredSuggestions);
                setShowToSuggestions(true);
            }
        } else {
            if (type === 'origin') {
                setShowFromSuggestions(false);
            } else if (type === 'destination') {
                setShowToSuggestions(false);
            }
        }
    }

    // Handle city selection
    function handleCitySelect(name, type) {
        setSearchData(prev => ({
            ...prev,
            [type]: name
        }));

        if (type === 'origin') {
            setShowFromSuggestions(false);
        } else if (type === 'destination') {
            setShowToSuggestions(false);
        }
    }

    // Handle changes in other input fields (e.g. travelers)
    function handleChange(e) {
        const { name, value } = e.target;

        if ((name === "travelers" && (value === '' || (Number.isInteger(+value) && +value >= 0))) || name !== "travelers") {
            setSearchData(prevSearchData => ({
                ...prevSearchData,
                [name]: value
            }));
        }
    }

    // Handle changes in date selection
    function handleDateChange(date, name) {
        setSearchData(prevSearchData => ({
            ...prevSearchData,
            [name]: date
        }));
    }

    // Handle the airline input change
    function handleAirlineChange(e) {
        const value = e.target.value;
        setSearchData(prevSearchData => ({
            ...prevSearchData,
            airline: value
        }));

        if (value.length > 0) {
            const airlineSuggestions = airlineSearch.filter(airline =>
                airline.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 3);
            setAirlineSuggestions(airlineSuggestions);
            setShowAirlineSuggestions(true);
        } else {
            setShowAirlineSuggestions(false);
        }
    }

    // Handle the airline selection from the suggestions
    function handleAirlineSelect(airline) {
        setSearchData(prev => ({
            ...prev,
            airline: airline
        }));
        setShowAirlineSuggestions(false);
    }

    // Flight search
    async function handleFlightSearch() {
        try {
            if (searchData.origin === "" || searchData.destination === "") {
                setErrorMessage("Kindly Fill The 'From' and 'To' Fields!");
                return;
            }

            const response = await axios.post('http://localhost:8000/api/v1/flights/searchFlights', {
                origin: searchData.origin,
                destination: searchData.destination,
                numberOfSeats: searchData.travelers,
                fromDate: searchData.departureDate1,
                toDate: searchData.departureDate2,
                airlineName: searchData.airline
            });

            setShowErrorMessage(false);
            setSearchResults(response.data.data);
            console.log("Search responsecheck:", response.data.data);
            console.log("Airlines : ",airlineSearch);
        } catch (error) {
            setErrorMessage(error.response?.data?.error);
            setShowErrorMessage(true);
            console.error('Error searching flights!:', error.response?.data?.error);
        }
    }
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB'); // "dd/MM/yyyy" format
    };
    function sortFlights() {
        const sortedResults = [...searchResults];
    
        if (sortOption === 'price') {
            // Sort by price, then by departure time if prices are equal
            sortedResults.sort((a, b) => {
                const priceA = a.price;
                const priceB = b.price;
    
                if (priceA === priceB) {
                    const departureA = new Date(a.departure);
                    const departureB = new Date(b.departure);
                    return departureA.getTime() - departureB.getTime();
                }
    
                return priceA - priceB;
            });
        } else if (sortOption === 'departure') {
            // Sort by departure time, then by price if departure times are equal
            sortedResults.sort((a, b) => {
                const departureA = new Date(a.departure);
                const departureB = new Date(b.departure);
                const departureComparison = departureA.getTime() - departureB.getTime();
    
                if (departureComparison === 0) {
                    const priceA = a.price;
                    const priceB = b.price;
                    return priceA - priceB;
                }
    
                return departureComparison;
            });
        } else if (sortOption === 'rating') {
            // Sort by rating, then by price if ratings are equal
            sortedResults.sort((a, b) => {
                const ratingA = a.rating || 0;  // Default to 0 if no rating is available
                const ratingB = b.rating || 0;
    
                if (ratingA === ratingB) {
                    // Tie-break by price if ratings are the same
                    const priceA = a.price;
                    const priceB = b.price;
                    return priceA - priceB;
                }
    
                // Sort by rating in descending order
                return ratingB - ratingA;
            });
        }
    
        return sortedResults;
    }
    
    
    // Handle click outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                (fromRef.current && !fromRef.current.contains(event.target)) &&
                (toRef.current && !toRef.current.contains(event.target)) &&
                (airlineRef.current && !airlineRef.current.contains(event.target))
            ) {
                setShowFromSuggestions(false);
                setShowToSuggestions(false);
                setShowAirlineSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    console.log("Error msg State :",showErrorMessage)
    return (
        <div className="flight-page">
            <div className="flight-hero-section">
                <h1 className="flight-hero-heading">Soar to New Destinations!</h1>
                <div className="flight-search-container">
                    <div className="flight-input-row">
                        {/* "From" Input */}
                        <div className="flight-input-container flight-citySearch flight-from-and-to" ref={fromRef}>
                            <MdFlightTakeoff className="flight-input-icon flight-bigger-icon" />
                            <input
                                type="text"
                                className="flight-inputDropdown"
                                placeholder="From"
                                name="origin"
                                value={searchData.origin}
                                onChange={(e) => handleCityChange(e, 'origin')}
                                onFocus={() => setShowFromSuggestions(true)}
                            />
                            {showFromSuggestions && (
                                <ul className="flight-suggestions-dropdown">
                                    {fromSuggestions.map((name, index) => (
                                        <li key={index} onClick={() => handleCitySelect(name, 'origin')}>
                                            <MdFlightTakeoff className="flight-dropdown-icon" /> {name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* "To" Input */}
                        <div className="flight-input-container flight-citySearch flight-from-and-to" ref={toRef}>
                            <MdFlightLand className="flight-input-icon flight-bigger-icon" />
                            <input
                                type="text"
                                className="flight-inputDropdown"
                                placeholder="To"
                                name="destination"
                                value={searchData.destination}
                                onChange={(e) => handleCityChange(e, 'destination')}
                                onFocus={() => setShowToSuggestions(true)}
                            />
                            {showToSuggestions && (
                                <ul className="flight-suggestions-dropdown">
                                    {toSuggestions.map((name, index) => (
                                        <li key={index} onClick={() => handleCitySelect(name, 'destination')}>
                                            <MdFlightLand className="flight-dropdown-icon" /> {name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Airline Input */}
                    <div className="flight-input-row">
                        <div className="flight-input-container flight-citySearch" ref={airlineRef}>
                            <MdFlight className="flight-input-icon flight-bigger-icon" />
                            <input
                                type="text"
                                className="flight-inputDropdown"
                                placeholder="Airline"
                                value={searchData.airline}
                                onChange={handleAirlineChange}
                                onFocus={() => setShowAirlineSuggestions(true)}
                            />
                            {showAirlineSuggestions && (
                                <ul className="flight-suggestions-dropdown">
                                    {airlineSuggestions.map((airline, index) => (
                                        <li key={index} onClick={() => handleAirlineSelect(airline)}>
                                            <MdFlight className="flight-dropdown-icon" /> {airline}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    
                    {/* Departure Dates */}
                    <DatePicker
                        selected={searchData.departureDate1}
                        onChange={(date) => handleDateChange(date, "departureDate1")}
                        placeholderText="Departure Date"
                        dateFormat="dd/MM/yyyy"
                        customInput={<CustomInput onClear={() => handleDateChange(null, "departureDate1")} />}
                    />
                    <DatePicker
                        selected={searchData.departureDate2}
                        onChange={(date) => handleDateChange(date, "departureDate2")}
                        placeholderText="Departure Date"
                        dateFormat="dd/MM/yyyy"
                        customInput={<CustomInput onClear={() => handleDateChange(null, "departureDate2")} />}
                    />

                    {/* Travelers Input */}
                    <div className="flight-input-container">
                        <FaUser className="flight-input-icon" />
                        <input
                            type="number"
                            className="flight-traveler-input"
                            placeholder="Travelers"
                            name="travelers"
                            value={searchData.travelers}
                            onChange={handleChange}
                        />
                    </div>
                    </div>

                    {/* Search Button */}
                    <div className="flight-search-button-container">
                        <button className="btn btn-warning flight-search-button" onClick={handleFlightSearch}>
                            <FaSearch className="flight-search-icon" />
                        </button>
                    </div>
                </div>
            </div>
            {errorMessage && showErrorMessage && (
                <div className="error-message-hotel-search-results">
                    {errorMessage}
                </div>
            )}
            {!showErrorMessage && (
                <>
                <h2 
                    // ref={resultsRef} 
                className='flight-search-results-matched-head'>
                    {searchResults.length} Results Found
                </h2>
                    <div className="flight-search-sort-container">
                        <label htmlFor="sortBy">Sort by:</label>
                        <select
                            id="sortBy"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="flight-search-sort-dropdown"
                        >
                            <option value="price">Lowest Price</option>
                            <option value="departure">Earliest Departure</option>
                            <option value="rating">Highest Ratings</option>
                        </select>
                    </div>
                </>
            )}

            {!showErrorMessage && sortFlights().map((flight, index) => (
                <FlightSearchResultCard 
                    key={index}
                    flightId={flight.id} 
                    destination={flight.destination}
                    origin={flight.origin}
                    departure={formatDepartureTime(flight.departure)}
                    price={flight.price}
                    airline={flight.name}
                    rating={flight.rating}
                    ratingCount={flight.ratingCount} 
                />
            ))}
        </div>
    );
}
