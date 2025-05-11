import sequelize from '../config/database.js'; // Sequelize instance
import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have this

export const cancelBundleReservation = async (req, res) => {
    const { bundleReservationId } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // 1. Validate input
        if (!bundleReservationId) {
            return res.status(400).json({ error: 'Bundle reservation ID is required.' });
        }

        // 2. Fetch bundle reservation details
        const bundleQuery = `
            SELECT hotelReservationId, flightReservationId, flightReservationIdRet
            FROM BundleReservation br
            WHERE id = :bundleReservationId AND status = 'Booked'
        `;

        const [bundleReservation] = await sequelize.query(bundleQuery, {
            replacements: { bundleReservationId },
            type: sequelize.QueryTypes.SELECT,
            transaction,
        });

        if (!bundleReservation) {
            return res.status(404).json({ error: 'No booked bundle found with the given ID.' });
        }

        console.log(bundleReservation);
        const { hotelReservationId, flightReservationId, flightReservationIdRet } = bundleReservation;

        // 3. Fetch related flight and hotel reservations
        const reservationsQuery = `
            SELECT 'Flight' AS type, fr.id AS reservationId, bill, f.departure AS reservationDate
            FROM FlightReservation fr
            join Flight f ON f.id=fr.flightId
            WHERE fr.id IN (:flightReservationId, :flightReservationIdRet) AND fr.status = 'Booked'

            UNION ALL

            SELECT 'Hotel' AS type, id AS reservationId, bill, reservationDate
            FROM HotelReservation 
            WHERE id = :hotelReservationId AND status = 'Booked'
        `;

        const reservations = await sequelize.query(reservationsQuery, {
            replacements: { flightReservationId, flightReservationIdRet, hotelReservationId },
            type: sequelize.QueryTypes.SELECT,
            transaction,
        });

        console.log(reservations);

        if (reservations.length !== 3) {
            return res.status(400).json({
                error: 'Unable to find all associated reservations (both flights and hotel) for this bundle.',
            });
        }

        // 4. Calculate refunds and update statuses
        let totalRefund = 0;
        let totalBill = 0;
        for (const reservation of reservations) {
            const { type, reservationId, bill, reservationDate } = reservation;

            // Determine refund based on cancellation policy
            totalBill += bill;
            const refund = calculateRefund(bill, reservationDate); // Assuming this helper function exists
            if (refund === 0) {
                return res.status(400).json({
                    error: 'Cannot cancel reservation 1 day before.',
                });
            }
            totalRefund += refund;
            const temp = bill - refund;

            if (type === 'Flight') {
                // Update flight reservation status
                const cancelFlightQuery = `
                    UPDATE FlightReservation 
                    SET status = 'Cancelled'
                    WHERE id = :reservationId
                `;
                await sequelize.query(cancelFlightQuery, {
                    replacements: { reservationId },
                    transaction,
                });


                // Insert into CancelledFlightReservation
                const insertCancelledFlightQuery = `
                    INSERT INTO CancelledFlightReservation (id, bill)
                    VALUES (:reservationId, :temp)
                `;
                await sequelize.query(insertCancelledFlightQuery, {
                    replacements: { reservationId, temp },
                    transaction,
                });
            } else if (type === 'Hotel') {
                // Update hotel reservation status
                const cancelHotelQuery = `
                    UPDATE HotelReservation 
                    SET status = 'Cancelled'
                    WHERE id = :reservationId
                `;
                await sequelize.query(cancelHotelQuery, {
                    replacements: { reservationId },
                    transaction,
                });

                // Insert into CancelledHotelReservation
                const insertCancelledHotelQuery = `
                    INSERT INTO CancelledHotelReservation (id, bill)
                    VALUES (:reservationId, :temp)
                `;
                await sequelize.query(insertCancelledHotelQuery, {
                    replacements: { reservationId, temp },
                    transaction,
                });
            }
        }
        const finalBill = totalBill - totalRefund;
        const insertCancelledBundleQuery = `
                    INSERT INTO CancelledBundleReservation (id, bill)
                    VALUES (:bundleReservationId, :finalBill)
                `;
        await sequelize.query(insertCancelledBundleQuery, {
            replacements: { bundleReservationId, finalBill },
            transaction,
        });
        // 5. Update the bundle reservation status
        const cancelBundleQuery = `
            UPDATE BundleReservation 
            SET status = 'Cancelled'
            WHERE id = :bundleReservationId
        `;
        await sequelize.query(cancelBundleQuery, {
            replacements: { bundleReservationId },
            transaction,
        });

        // 6. Commit transaction
        await transaction.commit();

        return res.status(200).json(new ApiResponse(200, totalRefund, 'Bundle reservation successfully cancelled.'));
    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        console.error('Error cancelling bundle:', error.message);
        return res.status(500).json({ error: 'Failed to cancel the bundle reservation.' });
    }
};

/**
 * Helper function to calculate refund amount based on the cancellation policy.
 */
const calculateRefund = (bill, reservationDate) => {
    const today = new Date();
    const reservationDay = new Date(reservationDate);
    const diffDays = Math.ceil((reservationDay - today) / (1000 * 60 * 60 * 24));

    if (diffDays > 2) return bill; // 100% refund if more than 2 days before
    if (diffDays === 2) return Math.floor(bill * 0.7); // 70% refund if exactly 2 days before
    return 0; // No refund if within 1 day
};