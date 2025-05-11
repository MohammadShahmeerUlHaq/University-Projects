import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js'; // Sequelize instance
import { TIME } from "sequelize";

export const getAllAirlines = async (req, res) => {
    try {
        const airlines = await sequelize.query(
            `SELECT * FROM Airline`,
            { type: sequelize.QueryTypes.SELECT }
        );
        res.status(200).json(airlines);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error fetching airlines' });
    }
};

export const addAirline = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Airline name required.' });
    }

    try {
        await sequelize.query(
            `INSERT INTO Airline (name) VALUES (:name)`,
            {
                replacements: { name },
                type: sequelize.QueryTypes.INSERT,
            }
        );
        res.status(201).json({ message: 'Airline added successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error adding airline' });
    }
};

export const getAllHotels = async (req, res) => {
    try {
        const hotels = await sequelize.query(
            `SELECT * FROM Hotel`,
            { type: sequelize.QueryTypes.SELECT }
        );
        res.status(200).json(hotels);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error fetching hotels' });
    }
};

export const addHotel = async (req, res) => {
    const {
        name,
        standard,
        deluxe,
        location,
        pricePerNightStandard,
        pricePerNightDeluxe,
    } = req.body;

    if (
        !name ||
        standard == null ||
        deluxe == null ||
        !location ||
        pricePerNightStandard == null ||
        pricePerNightDeluxe == null
    ) {
        return res.status(400).json({ error: 'All hotel details are required.' });
    }

    try {
        await sequelize.query(
            `INSERT INTO Hotel (name, standard, deluxe, location, pricePerNightStandard, pricePerNightDeluxe)
             VALUES (:name, :standard, :deluxe, :location, :pricePerNightStandard, :pricePerNightDeluxe)`,
            {
                replacements: {
                    name,
                    standard,
                    deluxe,
                    location,
                    pricePerNightStandard,
                    pricePerNightDeluxe,
                },
                type: sequelize.QueryTypes.INSERT,
            }
        );
        res.status(201).json({ message: 'Hotel added successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error adding hotel' });
    }
};

export const updateHotel = async (req, res) => {
    const { id, standard, deluxe, pricePerNightStandard, pricePerNightDeluxe } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Hotel ID is required.' });
    }

    try {
        await sequelize.query(
            `UPDATE Hotel
             SET standard = COALESCE(:standard, standard),
                 deluxe = COALESCE(:deluxe, deluxe),
                 pricePerNightStandard = COALESCE(:pricePerNightStandard, pricePerNightStandard),
                 pricePerNightDeluxe = COALESCE(:pricePerNightDeluxe, pricePerNightDeluxe)
             WHERE id = :id`,
            {
                replacements: {
                    id,
                    standard,
                    deluxe,
                    pricePerNightStandard,
                    pricePerNightDeluxe,
                },
                type: sequelize.QueryTypes.UPDATE,
            }
        );
        res.status(200).json({ message: 'Hotel updated successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error updating hotel' });
    }
};

export const getAllFlights = async (req, res) => {
    try {
        const flights = await sequelize.query(
            `SELECT 
                f.id, f.departure, f.destination, f.origin, f.price, f.status, f.numSeats,
                a.name AS airlineName
             FROM Flight f
             JOIN Airline a ON f.airlineId = a.id`,
            { type: sequelize.QueryTypes.SELECT }
        );

        res.status(200).json(flights);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error fetching flights' });
    }
};

export const addFlight = async (req, res) => {
    const { airlineName, departure, destination, origin, price, numSeats } = req.body;

    if (!airlineName || !departure || !destination || !origin || price == null || numSeats == null) {
        return res.status(400).json({ error: 'All flight details are required.' });
    }

    try {
        // Get airlineId from airline name
        const airline = await sequelize.query(
            `SELECT id FROM Airline WHERE name = :airlineName`,
            {
                replacements: { airlineName },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!airline.length) {
            return res.status(404).json({ error: 'Airline not found.' });
        }

        const airlineId = airline[0].id;

        // Insert flight into the Flight table
        await sequelize.query(
            `INSERT INTO Flight (airlineId, departure, destination, origin, price, numSeats)
             VALUES (:airlineId, :departure, :destination, :origin, :price, :numSeats)`,
            {
                replacements: { airlineId, departure, destination, origin, price, numSeats },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        res.status(201).json({ message: 'Flight added successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error adding flight' });
    }
};

export const updateFlight = async (req, res) => {
    const { id, departure, numSeats, status, price } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Flight ID is required.' });
    }

    try {
        await sequelize.query(
            `UPDATE Flight
             SET departure = COALESCE(:departure, departure),
                 numSeats = COALESCE(:numSeats, numSeats),
                 status = COALESCE(:status, status),
                 price = COALESCE(:price, price)
             WHERE id = :id`,
            {
                replacements: { id, departure, numSeats, status, price },
                type: sequelize.QueryTypes.UPDATE,
            }
        );
        res.status(200).json({ message: 'Flight updated successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error updating flight' });
    }
};


export const updateFlightReservationStatuses = async (req, res) => {
    try {
        const currentDateTime = new Date().toISOString(); // Get the current date and time in 'yyyy-mm-ddTHH:MM:SS' format

        // Step 1: Update "Booked" to "Availed" in FlightReservation where the flight's departure is past the current date and time
        const updateToAvailedReservationQuery = `
            UPDATE FlightReservation AS fr
            JOIN Flight AS f ON fr.flightId = f.id
            SET fr.status = 'Availed'
            WHERE fr.status = 'Booked' AND f.departure <= :currentDateTime
        `;

        await sequelize.query(updateToAvailedReservationQuery, {
            replacements: { currentDateTime },
            type: sequelize.QueryTypes.UPDATE,
        });

        // Step 2: Update "Scheduled" to "Fulfilled" in Flight where the departure is past the current date and time
        const updateToFulfilledFlightQuery = `
            UPDATE Flight
            SET status = 'Fulfilled'
            WHERE status = 'Scheduled' AND departure <= :currentDateTime
        `;

        await sequelize.query(updateToFulfilledFlightQuery, {
            replacements: { currentDateTime },
            type: sequelize.QueryTypes.UPDATE,
        });

        return res.status(200).json({ message: 'Flight reservation statuses updated successfully.' });
    } catch (error) {
        console.error('Error updating flight and reservation statuses:', error);
        return res.status(500).json({ error: 'An error occurred while updating flight and reservation statuses.' });
    }
};


export const updateHotelReservationStatuses = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'yyyy-mm-dd' format

        // Step 1: Update "Booked" to "Availing" for reservations with reservationDate <= currentDate and status "Booked"
        const updateToAvailingQuery = `
            UPDATE HotelReservation
            SET status = 'Availing'
            WHERE status = 'Booked' AND reservationDate <= :currentDate
        `;

        await sequelize.query(updateToAvailingQuery, {
            replacements: { currentDate },
            type: sequelize.QueryTypes.UPDATE,
        });

        // Step 2: Update "Availing" to "Availed" for reservations with endDate < currentDate and status "Availing"
        const updateToAvailedQuery = `
            UPDATE HotelReservation
            SET status = 'Availed'
            WHERE status = 'Availing' AND endDate < :currentDate
        `;

        await sequelize.query(updateToAvailedQuery, {
            replacements: { currentDate },
            type: sequelize.QueryTypes.UPDATE,
        });

        return res.status(200).json({ message: 'Hotel reservation statuses updated successfully.' });
    } catch (error) {
        console.error('Error updating reservation statuses:', error);
        return res.status(500).json({ error: 'An error occurred while updating reservation statuses.' });
    }
};

export const updateBundleReservationStatuses = async (req, res) => {
    try {
        const currentDateTime = new Date().toISOString(); // Current timestamp in 'yyyy-mm-ddTHH:MM:SS' format
        const currentDate = currentDateTime.split('T')[0]; // Extract current date in 'yyyy-mm-dd' format

        // Step 1: Update the status of associated FlightReservation and HotelReservation
        // Flight: Update "Booked" to "Availed" for past flights
        const updateFlightReservationsQuery = `
            UPDATE FlightReservation AS fr
            JOIN Flight AS f ON fr.flightId = f.id
            SET fr.status = 'Availed'
            WHERE fr.status = 'Booked' AND f.departure <= :currentDateTime
        `;

        await sequelize.query(updateFlightReservationsQuery, {
            replacements: { currentDateTime },
            type: sequelize.QueryTypes.UPDATE,
        });

        // Hotel: Update "Booked" to "Availing" for ongoing reservations and "Availing" to "Availed" for completed ones
        const updateHotelToAvailingQuery = `
            UPDATE HotelReservation
            SET status = 'Availing'
            WHERE status = 'Booked' AND reservationDate <= :currentDate
        `;
        const updateHotelToAvailedQuery = `
            UPDATE HotelReservation
            SET status = 'Availed'
            WHERE status = 'Availing' AND endDate < :currentDate
        `;

        await sequelize.query(updateHotelToAvailingQuery, {
            replacements: { currentDate },
            type: sequelize.QueryTypes.UPDATE,
        });

        await sequelize.query(updateHotelToAvailedQuery, {
            replacements: { currentDate },
            type: sequelize.QueryTypes.UPDATE,
        });

        // Step 2: Update "BundleReservation" status based on associated reservations

        // Step 1: Update "BundleReservation" statuses based on hotel reservation start and end dates
        const updateBundleReservationQuery = `
            UPDATE BundleReservation AS br
            LEFT JOIN HotelReservation hr ON br.hotelReservationId = hr.id
            SET br.status = 
                CASE 
                    WHEN hr.reservationDate > ? THEN 'Booked'
                    WHEN hr.reservationDate <= ? AND hr.endDate >= ? THEN 'Availing'
                    WHEN hr.endDate < ? THEN 'Availed'
                    ELSE br.status
                END
        `;

        await sequelize.query(updateBundleReservationQuery, {
            replacements: [currentDate, currentDate, currentDate, currentDate],
            type: sequelize.QueryTypes.UPDATE,
        });

        return res.status(200).json({ message: 'Bundle reservation statuses updated successfully.' });
    } catch (error) {
        console.error('Error updating bundle reservation statuses:', error);
        return res.status(500).json({ error: 'An error occurred while updating bundle reservation statuses.' });
    }
};














export const loginAdmin = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { userName, password } = req.body;

        // 1. Basic validations
        if (!userName || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // 2. Build the SQL query to find the admin by userName
        const query = `
            SELECT * FROM Admin WHERE userName = :userName
        `;

        // 3. Execute the raw SQL query
        const [admins] = await sequelize.query(query, {
            replacements: {
                userName: userName, // Exact match for username
            },
            type: sequelize.QueryTypes.SELECT
        });

        // 4. Check if admin exists
        if (admins) { // Check if the result is an array with at least one entry

            // 5. Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, admins.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid password.' });
            }

            // 7. Return success response with admin data
            const loggedInAdmin = {
                id: admins.id,
                userName: admins.userName,
                name: admins.name,
                lastLogin: admins.lastLogin // Last login before update
            };

            // 6. Update the last login timestamp
            const updateQuery = `
                UPDATE Admin SET lastLogin = NOW() WHERE id = :id
            `;
            await sequelize.query(updateQuery, {
                replacements: { id: admins.id },
                type: sequelize.QueryTypes.UPDATE
            });

            return res.status(200).json(new ApiResponse(200, loggedInAdmin, 'Admin logged in successfully.'));
        } else {
            return res.status(401).json({ error: 'Invalid username.' });
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        return res.status(500).json({ error: 'Something went wrong while logging in the admin.' });
    }
};