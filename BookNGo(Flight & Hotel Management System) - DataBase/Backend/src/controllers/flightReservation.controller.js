import sequelize from '../config/database.js'; // Sequelize instance
import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have this

export const updateFlightReservation = async (req, res) => {
    const { reservationId, seats } = req.body;
    const updatedSeats = parseInt(seats);
    const transaction = await sequelize.transaction();

    try {
        if (!reservationId || updatedSeats == null) {
            return res.status(400).json({ error: 'Reservation ID and updated seats are required.' });
        }

        // Fetch current reservation details
        const [reservation] = await sequelize.query(
            `SELECT r.id, r.flightId, r.seats AS currentSeats, r.bill AS currentBill, 
                    f.price AS pricePerSeat, f.numSeats AS availableSeats, f.departure
             FROM FlightReservation r
             JOIN Flight f ON r.flightId = f.id
             WHERE r.id = :reservationId AND r.status = 'Booked'`,
            {
                replacements: { reservationId },
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        const { flightId, currentSeats, currentBill, pricePerSeat, availableSeats, departure } = reservation;

        // Calculate the seat difference and change in the bill
        const seatDifference = updatedSeats - currentSeats;
        const changeInBill = seatDifference * pricePerSeat;

        // Validate seat availability for increase
        if (seatDifference > 0 && availableSeats < seatDifference) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }

        // If the bill decreases or remains the same, update the reservation
        if (changeInBill <= 0) {

            const departureDate = new Date(departure);
            const currentDate = new Date();
            const daysUntilDeparture = Math.floor((departureDate - currentDate) / (1000 * 60 * 60 * 24));

            if (daysUntilDeparture < 2) {
                return res.status(400).json({ error: 'Cannot decrease seats a day before the flight.' });
            }

            await sequelize.query(
                `UPDATE FlightReservation
                 SET seats = ?, bill = bill + ?, bookingDate = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                {
                    replacements: [updatedSeats, changeInBill, reservationId],
                    type: sequelize.QueryTypes.UPDATE,
                    transaction,
                }
            );

            // Update available seats in the Flight table
            await sequelize.query(
                `UPDATE Flight
                 SET numSeats = numSeats + ?
                 WHERE id = ?`,
                {
                    replacements: [-seatDifference, flightId],
                    type: sequelize.QueryTypes.UPDATE,
                    transaction,
                }
            );

            await transaction.commit();
            return res.status(200).json({
                message: 'Reservation updated successfully',
                changeInBill,
            });
        }

        // If the bill increases, return the change without updating
        await transaction.rollback();
        return res.status(200).json({
            message: 'Bill increase detected',
            changeInBill,
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error.message);
        res.status(500).json({ error: 'Error updating reservation' });
    }
};


// export const updateFlightReservation = async (req, res) => {
//     const { reservationId, seats } = req.body;
//     const updatedSeats = parseInt(seats);
//     const transaction = await sequelize.transaction();

//     try {
//         if (!reservationId || updatedSeats == null) {
//             return res.status(400).json({ error: 'Reservation ID and updated seats are required.' });
//         }



//         // Fetch current reservation details
//         const reservation = await sequelize.query(
//             `SELECT r.id, r.flightId, r.seats AS currentSeats, r.bill AS currentBill, 
//                     f.price AS pricePerSeat, f.numSeats AS availableSeats, f.departure 
//              FROM FlightReservation r
//              JOIN Flight f ON r.flightId = f.id
//              WHERE r.id = :reservationId AND r.status = 'Booked'`,
//             {
//                 replacements: { reservationId },
//                 type: sequelize.QueryTypes.SELECT,
//                 transaction,
//             }
//         );

//         if (!reservation) {
//             return res.status(404).json({ error: 'Reservation not found' });
//         }

//         const { flightId, currentSeats, currentBill, pricePerSeat, availableSeats, departure } = reservation;

//         // Calculate the seat difference and change in the bill
//         const seatDifference = updatedSeats - currentSeats;
//         const changeInBill = seatDifference * pricePerSeat;

//         // Validate seat availability for increase
//         if (seatDifference > 0 && availableSeats < seatDifference) {
//             return res.status(400).json({ error: 'Not enough seats available' });
//         }

//         // If the bill decreases or remains the same, update the reservation
//         if (changeInBill <= 0) {

//             const departureDate = new Date(departure);
//             const currentDate = new Date();
//             const daysUntilDeparture = Math.floor((departureDate - currentDate) / (1000 * 60 * 60 * 24));

//             if (daysUntilDeparture < 2) {
//                 return res.status(400).json({ error: 'Cannot decrease seats a day before the flight.' });
//             }

//             await sequelize.query(
//                 `UPDATE FlightReservation
//                  SET seats = ?, bill = bill + ?, bookingDate = CURRENT_TIMESTAMP
//                  WHERE id = ?`,
//                 {
//                     replacements: [updatedSeats, changeInBill, reservationId],
//                     type: sequelize.QueryTypes.UPDATE,
//                     transaction,
//                 }
//             );

//             // Update available seats in the Flight table
//             await sequelize.query(
//                 `UPDATE Flight
//                  SET numSeats = numSeats + ?
//                  WHERE id = ?`,
//                 {
//                     replacements: [-seatDifference, flightId], // Increase available seats for negative difference
//                     type: sequelize.QueryTypes.UPDATE,
//                     transaction,
//                 }
//             );

//             await transaction.commit();
//             return res.status(200).json({
//                 message: 'Reservation updated successfully',
//                 changeInBill,
//             });
//         }

//         // If the bill increases, return the change without updating
//         await transaction.rollback();
//         return res.status(200).json({
//             message: 'Bill increase detected',
//             changeInBill,
//         });
//     } catch (error) {
//         await transaction.rollback();
//         console.error(error.message);
//         res.status(500).json({ error: 'Error updating reservation' });
//     }
// };

// export const updateFlightReservation = async (req, res) => {
//     const { reservationId, seats } = req.body;
//     const updatedSeats = parseInt(seats, 10);
//     const transaction = await sequelize.transaction();

//     try {
//         if (!reservationId || updatedSeats == null) {
//             return res.status(400).json({ error: 'Reservation ID and updated seats are required.' });
//         }

//         // Fetch current reservation details
//         const reservation = await sequelize.query(
//             `SELECT r.id, r.flightId, r.seats AS currentSeats, r.bill AS currentBill, 
//                     f.price AS pricePerSeat, f.numSeats AS availableSeats, f.departure 
//              FROM FlightReservation r
//              JOIN Flight f ON r.flightId = f.id
//              WHERE r.id = :reservationId AND r.status = 'Booked'`,
//             {
//                 replacements: { reservationId },
//                 type: sequelize.QueryTypes.SELECT,
//                 transaction,
//             }
//         );

//         if (reservation.length === 0) {
//             return res.status(404).json({ error: 'Reservation not found' });
//         }

//         const { flightId, currentSeats, currentBill, pricePerSeat, availableSeats, departure } = reservation[0];

//         const seatDifference = updatedSeats - currentSeats;
//         const changeInBill = seatDifference * pricePerSeat;

//         if (seatDifference > 0 && availableSeats < seatDifference) {
//             return res.status(400).json({ error: 'Not enough seats available.' });
//         }

//         const departureDate = new Date(departure);
//         const currentDate = new Date();
//         const daysUntilDeparture = Math.floor((departureDate - currentDate) / (1000 * 60 * 60 * 24));

//         if (seatDifference < 0 && daysUntilDeparture < 2) {
//             return res.status(400).json({ error: 'Cannot decrease seats a day before the flight.' });
//         }

//         await sequelize.query(
//             `UPDATE FlightReservation
//              SET seats = :updatedSeats, bill = :newBill, bookingDate = CURRENT_TIMESTAMP
//              WHERE id = :reservationId`,
//             {
//                 replacements: {
//                     updatedSeats,
//                     newBill: currentBill + changeInBill,
//                     reservationId,
//                 },
//                 type: sequelize.QueryTypes.UPDATE,
//                 transaction,
//             }
//         );

//         await sequelize.query(
//             `UPDATE Flight
//              SET numSeats = numSeats + :seatDifference
//              WHERE id = :flightId`,
//             {
//                 replacements: {
//                     seatDifference: -seatDifference, // Adjust seats in the opposite direction
//                     flightId,
//                 },
//                 type: sequelize.QueryTypes.UPDATE,
//                 transaction,
//             }
//         );

//         await transaction.commit();
//         return res.status(200).json({
//             message: 'Reservation updated successfully.',
//             changeInBill,
//         });
//     } catch (error) {
//         await transaction.rollback();
//         console.error(error.message);
//         return res.status(500).json({ error: 'Error updating reservation.' });
//     }
// };


// export const updateFlightReservation2 = async (req, res) => {
//     const { reservationId, seats, amount } = req.body;
//     const updatedSeats = parseInt(seats);
//     const transaction = await sequelize.transaction();

//     try {
//         if (!reservationId || updatedSeats == null) {
//             return res.status(400).json({ error: 'Reservation ID and updated seats are required.' });
//         }

//         // Fetch current reservation details
//         const [reservation] = await sequelize.query(
//             `SELECT r.id, r.flightId, r.seats AS currentSeats, r.bill AS currentBill, f.price AS pricePerSeat, f.numSeats AS availableSeats, f.departure
//              FROM FlightReservation r
//              JOIN Flight f ON r.flightId = f.id
//              WHERE r.id = :reservationId AND r.status = 'Booked'`,
//             {
//                 replacements: [reservationId],
//                 type: sequelize.QueryTypes.SELECT,
//                 transaction,
//             }
//         );

//         if (!reservation) {
//             return res.status(404).json({ error: 'Reservation not found' });
//         }

//         const { flightId, currentSeats, currentBill, pricePerSeat, availableSeats, departure } = reservation;

//         // Calculate the seat difference and change in the bill
//         const seatDifference = updatedSeats - currentSeats;
//         const changeInBill = seatDifference * pricePerSeat;

//         // Validate seat availability for increase
//         if (seatDifference > 0 && availableSeats < seatDifference) {
//             return res.status(400).json({ error: 'Not enough seats available' });
//         }

//         await sequelize.query(
//             `UPDATE FlightReservation
//                  SET seats = ?, bill = bill + ?, bookingDate = CURRENT_TIMESTAMP
//                  WHERE id = ?`,
//             {
//                 replacements: [updatedSeats, amount, reservationId],
//                 type: sequelize.QueryTypes.UPDATE,
//                 transaction,
//             }
//         );

//         // Update available seats in the Flight table
//         await sequelize.query(
//             `UPDATE Flight
//                  SET numSeats = numSeats - ?
//                  WHERE id = ?`,
//             {
//                 replacements: [seatDifference, flightId], // Decrease available seats for positive difference
//                 type: sequelize.QueryTypes.UPDATE,
//                 transaction,
//             }
//         );

//         await transaction.commit();
//         return res.status(200).json({
//             message: 'Reservation updated successfully',
//             changeInBill,
//         });
//     } catch (error) {
//         await transaction.rollback();
//         console.error(error.message);
//         res.status(500).json({ error: 'Error updating reservation' });
//     }
// };

export const updateFlightReservation2 = async (req, res) => {
    const { reservationId, seats, amount } = req.body;
    const updatedSeats = parseInt(seats, 10); // Ensure seats is properly parsed as an integer
    const transaction = await sequelize.transaction();

    try {
        if (!reservationId || updatedSeats == null) {
            return res.status(400).json({ error: 'Reservation ID and updated seats are required.' });
        }

        // Fetch current reservation details
        const [reservation] = await sequelize.query(
            `SELECT r.id, r.flightId, r.seats AS currentSeats, r.bill AS currentBill, 
                    f.price AS pricePerSeat, f.numSeats AS availableSeats, f.departure
             FROM FlightReservation r
             JOIN Flight f ON r.flightId = f.id
             WHERE r.id = ? AND r.status = 'Booked'`,
            {
                replacements: [reservationId], // Use positional replacement with `?`
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found.' });
        }

        const { flightId, currentSeats, currentBill, pricePerSeat, availableSeats, departure } = reservation;

        // Calculate the seat difference and change in the bill
        const seatDifference = updatedSeats - currentSeats;
        const changeInBill = seatDifference * pricePerSeat;

        // Validate seat availability for increase
        if (seatDifference > 0 && availableSeats < seatDifference) {
            return res.status(400).json({ error: 'Not enough seats available.' });
        }

        // Update reservation
        await sequelize.query(
            `UPDATE FlightReservation
             SET seats = ?, bill = bill + ?, bookingDate = CURRENT_TIMESTAMP
             WHERE id = ?`,
            {
                replacements: [updatedSeats, amount, reservationId],
                type: sequelize.QueryTypes.UPDATE,
                transaction,
            }
        );

        // Update available seats in the Flight table
        await sequelize.query(
            `UPDATE Flight
             SET numSeats = numSeats - ?
             WHERE id = ?`,
            {
                replacements: [seatDifference, flightId], // Adjust seats in the opposite direction
                type: sequelize.QueryTypes.UPDATE,
                transaction,
            }
        );

        await transaction.commit();
        return res.status(200).json({
            message: 'Reservation updated successfully.',
            changeInBill,
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error.message);
        res.status(500).json({ error: 'Error updating reservation.' });
    }
};


export const reserveFlight = async (req, res) => {
    const { flightId, userName, seats } = req.body;
    const transaction = await sequelize.transaction();

    try {
        if (!flightId || !userName || !seats) {
            return res.status(400).json({ error: 'Flight ID, user name, and number of seats are required.' });
        }

        // Fetch available seats and price per seat from Flight table
        const [flight] = await sequelize.query(
            `SELECT numSeats, price FROM Flight WHERE id = ?`,
            {
                replacements: [flightId],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }

        const [user] = await sequelize.query(
            `SELECT id FROM User WHERE userName = ?`,
            {
                replacements: [userName],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const userId = user.id;

        // Check if enough seats are available
        if (flight.numSeats < seats) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }

        // Calculate the bill
        const bill = flight.price * seats;

        // Insert reservation data into FlightReservation table
        await sequelize.query(
            `INSERT INTO FlightReservation (flightId, userId, seats, bill)
             VALUES (?, ?, ?, ?)`,
            {
                replacements: [flightId, userId, seats, bill],
                type: sequelize.QueryTypes.INSERT,
                transaction,
            }
        );

        // Update the remaining number of seats in the Flight table
        await sequelize.query(
            `UPDATE Flight SET numSeats = numSeats - ? WHERE id = ?`,
            {
                replacements: [seats, flightId],
                type: sequelize.QueryTypes.UPDATE,
                transaction,
            }
        );

        // Commit the transaction after successful reservation
        await transaction.commit();
        return res.status(200).json(new ApiResponse(200, bill, 'Seats reserved successfully'));
    } catch (error) {
        await transaction.rollback();
        console.log(error.message);
        res.status(500).json({ error: 'Error reserving seats' });
    }
};











// export const reserveFlight = async (req, res) => {
//     const { flightId, userName, seats } = req.body;

//     // Start a transaction to ensure data consistency
//     const transaction = await sequelize.transaction();

//     try {
//         if (!flightId || !userName || !seats) {
//             return res.status(400).json({ error: 'Number of seats is required.' });
//         }

//         // Check if enough rooms of the specified type are available
//         const [flight] = await sequelize.query(
//             `SELECT numSeats FROM Flight WHERE id = ?`,
//             {
//                 replacements: [flightId],
//                 type: sequelize.QueryTypes.SELECT,
//                 transaction,
//             }
//         );

//         const [user] = await sequelize.query(
//             `SELECT id FROM user WHERE userName = ?`,
//             {
//                 replacements: [userName],
//                 type: sequelize.QueryTypes.SELECT,
//                 transaction,
//             }
//         );

//         if (!user) {
//             return res.status(400).json({ error: 'User Not Found' });
//         }

//         const userId = user.id;

//         if (!flight || flight.numSeats < seats) {
//             return res.status(400).json({ error: 'Not enough seats available' });
//         }

//         // Insert reservation data into HotelReservation table
//         const [result] = await sequelize.query(
//             `INSERT INTO FlightReservation (flightId, userId, seats)
//              VALUES (?, ?, ?)`,
//             {
//                 replacements: [flightId, userId, seats],
//                 type: sequelize.QueryTypes.INSERT,
//                 transaction,
//             }
//         );

//         // Update the remaining number of rooms in the Hotel table for the specified room type
//         await sequelize.query(
//             `UPDATE flight SET numSeats = numSeats - ? WHERE id = ?`,
//             {
//                 replacements: [seats, flightId],
//                 type: sequelize.QueryTypes.UPDATE,
//                 transaction,
//             }
//         );

//         // Commit the transaction after successful reservation
//         await transaction.commit();
//         return res.status(200).json(new ApiResponse(200, null, 'Seat(s) reserved successfully'));
//     } catch (error) {
//         // Rollback the transaction in case of errors
//         await transaction.rollback();
//         console.log(error.message);
//         res.status(500).json({ error: 'Error reserving seat(s)' });
//     }
// };