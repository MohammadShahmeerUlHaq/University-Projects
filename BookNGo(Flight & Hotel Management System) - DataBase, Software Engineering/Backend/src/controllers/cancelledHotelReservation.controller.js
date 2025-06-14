import sequelize from '../config/database.js'; // Sequelize instance
import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have this

export const cancelHotelReservation = async (req, res) => {
    try {
        const { reservationId } = req.body;

        // Step 1: Fetch the reservation and related hotel details
        const [reservation] = await sequelize.query(`
            SELECT hr.id, hr.hotelId, hr.userId, hr.status, hr.bill, hr.reservationDate, hr.endDate
            FROM HotelReservation AS hr
            WHERE hr.id = :reservationId AND hr.status = 'Booked'
        `, {
            replacements: { reservationId },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found or already availed/canceled.' });
        }

        const reservationStartDate = new Date(reservation.reservationDate);
        const currentDate = new Date();
        const daysUntilReservation = Math.floor((reservationStartDate - currentDate) / (1000 * 60 * 60 * 24));

        // Step 2: Determine refund based on the cancellation time frame
        let refundPercentage = 0;
        if (daysUntilReservation > 2) {
            refundPercentage = 100;
        } else if (daysUntilReservation === 2) {
            refundPercentage = 70;
        } else {
            return res.status(400).json({ error: 'Cannot cancel a reservation a day before the reservation date.' });
        }

        const refundAmount = (reservation.bill * refundPercentage) / 100;

        // Step 3: Update reservation status to "Cancelled" and log cancellation with refund details
        await sequelize.transaction(async (transaction) => {
            // Update the reservation status to "Cancelled"
            await sequelize.query(`
                UPDATE HotelReservation
                SET status = 'Cancelled'
                WHERE id = :reservationId
            `, {
                replacements: { reservationId },
                type: sequelize.QueryTypes.UPDATE,
                transaction,
            });

            // Insert into cancelledHotelReservation table
            await sequelize.query(`
                INSERT INTO cancelledHotelReservation (id, bill)
                VALUES (:id, :billRefund)
            `, {
                replacements: {
                    id: reservationId, // Use the hotelId for the cancelled reservation
                    billRefund: reservation.bill - refundAmount,
                },
                type: sequelize.QueryTypes.INSERT,
                transaction,
            });
        });

        return res.status(200).json(new ApiResponse(200, refundAmount, 'Hotel reservation cancelled successfully.'));
    } catch (error) {
        console.error('Error cancelling hotel reservation:', error);
        return res.status(500).json({ error: 'An error occurred while cancelling the reservation.' });
    }
};
