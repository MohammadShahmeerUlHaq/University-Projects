import sequelize from '../config/database.js'; // Sequelize instance
import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have this

export const cancelFlightReservation = async (req, res) => {
    try {
        const { reservationId } = req.body;

        // Step 1: Fetch the reservation and related flight details
        const [reservation] = await sequelize.query(`
            SELECT fr.id, fr.flightId, fr.userId, fr.status, fr.bill, fr.seats, f.departure
            FROM FlightReservation AS fr
            JOIN Flight AS f ON fr.flightId = f.id
            WHERE fr.id = :reservationId AND fr.status = 'Booked'
        `, {
            replacements: { reservationId },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found or already availed/canceled.' });
        }

        const departureDate = new Date(reservation.departure);
        const currentDate = new Date();
        const daysUntilDeparture = Math.floor((departureDate - currentDate) / (1000 * 60 * 60 * 24));

        // Step 2: Determine refund based on the cancellation time frame
        let refundPercentage = 0;
        if (daysUntilDeparture > 2) {
            refundPercentage = 100;
        } else if (daysUntilDeparture === 2) {
            refundPercentage = 70;
        } else {
            return res.status(400).json({ error: 'Cannot cancel a reservation a day before the flight.' });
        }

        const refundAmount = (reservation.bill * refundPercentage) / 100;

        // Step 3: Update reservation status to "Cancelled", log cancellation, and update flight seats
        await sequelize.transaction(async (transaction) => {
            // Update the reservation status to "Cancelled"
            await sequelize.query(`
                UPDATE FlightReservation
                SET status = 'Cancelled'
                WHERE id = :reservationId
            `, {
                replacements: { reservationId },
                type: sequelize.QueryTypes.UPDATE,
                transaction,
            });

            // Insert into cancelledFlightReservation table
            await sequelize.query(`
                INSERT INTO cancelledFlightReservation (id, bill)
                VALUES (:flightId, :billRefund)
            `, {
                replacements: {
                    flightId: reservationId,
                    billRefund: reservation.bill - refundAmount,
                },
                type: sequelize.QueryTypes.INSERT,
                transaction,
            });

            // Increment the number of available seats in the flight
            await sequelize.query(`
                UPDATE Flight
                SET numSeats = numSeats + :seats
                WHERE id = :flightId
            `, {
                replacements: {
                    seats: reservation.seats,
                    flightId: reservation.flightId,
                },
                type: sequelize.QueryTypes.UPDATE,
                transaction,
            });
        });

        return res.status(200).json(new ApiResponse(200, refundAmount, 'Flight reservation cancelled successfully.'));
    } catch (error) {
        console.error('Error cancelling flight reservation:', error);
        return res.status(500).json({ error: 'An error occurred while cancelling the reservation.' });
    }
};

// export const cancelFlightReservation = async (req, res) => {
//     try {
//         const { reservationId } = req.body;

//         // Step 1: Fetch the reservation and related flight details
//         const [reservation] = await sequelize.query(`
//             SELECT fr.id, fr.flightId, fr.userId, fr.status, fr.bill, f.departure
//             FROM FlightReservation AS fr
//             JOIN Flight AS f ON fr.flightId = f.id
//             WHERE fr.id = :reservationId AND fr.status = 'Booked'
//         `, {
//             replacements: { reservationId },
//             type: sequelize.QueryTypes.SELECT,
//         });

//         if (!reservation) {
//             return res.status(404).json({ error: 'Reservation not found or already availed/canceled.' });
//         }

//         const departureDate = new Date(reservation.departure);
//         const currentDate = new Date();
//         const daysUntilDeparture = Math.floor((departureDate - currentDate) / (1000 * 60 * 60 * 24));

//         // Step 2: Determine refund based on the cancellation time frame
//         let refundPercentage = 0;
//         if (daysUntilDeparture > 2) {
//             refundPercentage = 100;
//         } else if (daysUntilDeparture === 2) {
//             refundPercentage = 70;
//         } else {
//             return res.status(400).json({ error: 'Cannot cancel a reservation a day before the flight.' });
//         }

//         const refundAmount = (reservation.bill * refundPercentage) / 100;

//         // Step 3: Update reservation status to "Cancelled" and log cancellation with refund details
//         await sequelize.transaction(async (transaction) => {
//             // Update the reservation status to "Cancelled"
//             await sequelize.query(`
//                 UPDATE FlightReservation
//                 SET status = 'Cancelled'
//                 WHERE id = :reservationId
//             `, {
//                 replacements: { reservationId },
//                 type: sequelize.QueryTypes.UPDATE,
//                 transaction,
//             });

//             // Insert into cancelledFlightReservation table
//             await sequelize.query(`
//                 INSERT INTO cancelledFlightReservation (id, bill)
//                 VALUES (:flightId, :billRefund)
//             `, {
//                 replacements: {
//                     flightId: reservationId,
//                     billRefund: reservation.bill - refundAmount,
//                 },
//                 type: sequelize.QueryTypes.INSERT,
//                 transaction,
//             });
//         });

//         return res.status(200).json(new ApiResponse(200, refundAmount, 'Flight reservation cancelled successfully.'));
//     } catch (error) {
//         console.error('Error cancelling flight reservation:', error);
//         return res.status(500).json({ error: 'An error occurred while cancelling the reservation.' });
//     }
// };
