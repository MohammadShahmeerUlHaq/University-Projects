import sequelize from '../config/database.js'; // Sequelize instance
import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have this

// export const reserveBundle = async (req, res) => {
//     const { bundleId, userName, seats, reservationDate, endDate, noOfRooms, roomType } = req.body;
//     const transaction = await sequelize.transaction();

//     try {
//         if (!bundleId || !userName || !seats || !reservationDate || !endDate || !noOfRooms || !roomType) {
//             return res.status(400).json({ error: 'bundleId, userName, seats, reservationDate, endDate, noOfRooms, roomType are required.' });
//         }

//         // Fetch user ID
//         const [user] = await sequelize.query(
//             `SELECT id FROM User WHERE userName = ?`,
//             { replacements: [userName], type: sequelize.QueryTypes.SELECT, transaction }
//         );
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         const userId = user.id;

//         // Fetch bundle details
//         const [bundle] = await sequelize.query(
//             `SELECT flightId, flightIdRet, hotelId, discount FROM Bundle WHERE id = ?`,
//             { replacements: [bundleId], type: sequelize.QueryTypes.SELECT, transaction }
//         );
//         if (!bundle) {
//             return res.status(404).json({ error: 'Bundle not found' });
//         }

//         const { flightId, flightIdRet, hotelId, discount } = bundle;

//         // Reserve onward flight
//         const [onwardFlight] = await sequelize.query(
//             `SELECT numSeats, price FROM Flight WHERE id = ?`,
//             { replacements: [flightId], type: sequelize.QueryTypes.SELECT, transaction }
//         );
//         if (!onwardFlight || onwardFlight.numSeats < seats) {
//             return res.status(400).json({ error: 'Not enough seats available on the onward flight.' });
//         }

//         const onwardBill = ((onwardFlight.price * seats) / 100) * (100 - discount);
//         const [flightReservationResult] = await sequelize.query(
//             `INSERT INTO FlightReservation (flightId, userId, seats, bill)
//              VALUES (?, ?, ?, ?)`,
//             { replacements: [flightId, userId, seats, onwardBill], type: sequelize.QueryTypes.INSERT, transaction }
//         );
//         const flightReservationId = flightReservationResult;

//         // Reserve return flight
//         const [returnFlight] = await sequelize.query(
//             `SELECT numSeats, price FROM Flight WHERE id = ?`,
//             { replacements: [flightIdRet], type: sequelize.QueryTypes.SELECT, transaction }
//         );
//         if (!returnFlight || returnFlight.numSeats < seats) {
//             return res.status(400).json({ error: 'Not enough seats available on the return flight.' });
//         }

//         const returnBill = ((returnFlight.price * seats) / 100) * (100 - discount);;
//         const [flightReservationRetResult] = await sequelize.query(
//             `INSERT INTO FlightReservation (flightId, userId, seats, bill)
//              VALUES (?, ?, ?, ?)`,
//             { replacements: [flightIdRet, userId, seats, returnBill], type: sequelize.QueryTypes.INSERT, transaction }
//         );
//         const flightReservationIdRet = flightReservationRetResult;

//         // Reserve hotel
//         const roomTypeField = roomType === 'Standard' ? 'standard' : 'deluxe';
//         const priceField = roomType === 'Standard' ? 'pricePerNightStandard' : 'pricePerNightDeluxe';

//         const [hotel] = await sequelize.query(
//             `SELECT ${roomTypeField} AS totalRooms, ${priceField} AS pricePerNight FROM Hotel WHERE id = ?`,
//             { replacements: [hotelId], type: sequelize.QueryTypes.SELECT, transaction }
//         );

//         const [usedRoomsResult] = await sequelize.query(
//             `SELECT COALESCE(SUM(noOfRooms), 0) AS usedRooms
//              FROM HotelReservation
//              WHERE hotelId = ? AND type = ? AND 
//                    ((reservationDate BETWEEN ? AND ?) OR (endDate BETWEEN ? AND ?))`,
//             {
//                 replacements: [hotelId, roomType, reservationDate, endDate, reservationDate, endDate],
//                 type: sequelize.QueryTypes.SELECT,
//                 transaction,
//             }
//         );
//         const usedRooms = usedRoomsResult.usedRooms;
//         const availableRooms = hotel.totalRooms - usedRooms;

//         if (availableRooms < noOfRooms) {
//             return res.status(400).json({ error: 'Not enough rooms available' });
//         }

//         const [daysResult] = await sequelize.query(
//             'SELECT DATEDIFF(?, ?) AS noOfDays',
//             {
//                 replacements: [endDate, reservationDate],
//                 type: sequelize.QueryTypes.SELECT,
//                 transaction,
//             }
//         );
//         const noOfDays = daysResult.noOfDays + 1;

//         // Calculate bill based on price per night and number of days
//         const totalBill = ((hotel.pricePerNight * noOfRooms * noOfDays) / 100) * (100 - discount);

//         const [hotelReservationResult] = await sequelize.query(
//             `INSERT INTO HotelReservation (hotelId, userId, reservationDate, endDate, noOfRooms, type, bill)
//                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             {
//                 replacements: [hotelId, userId, reservationDate, endDate, noOfRooms, roomType, totalBill],
//                 type: sequelize.QueryTypes.INSERT,
//                 transaction,
//             }
//         );
//         const hotelReservationId = hotelReservationResult;

//         // Calculate total bundle cost with discount
//         const discountedCost = onwardBill + returnBill + totalBill;

//         // Insert bundle reservation
//         await sequelize.query(
//             `INSERT INTO BundleReservation (userId, bundleId, flightReservationId, flightReservationIdRet, hotelReservationId, bill)
//              VALUES (?, ?, ?, ?, ?, ?)`,
//             {
//                 replacements: [userId, bundleId, flightReservationId, flightReservationIdRet, hotelReservationId, discountedCost],
//                 type: sequelize.QueryTypes.INSERT,
//                 transaction,
//             }
//         );

//         // Commit transaction
//         await transaction.commit();
//         return res.status(200).json(new ApiResponse(200, discountedCost, 'Bundle reserved successfully.'));
//     } catch (error) {
//         await transaction.rollback();
//         console.error(error);
//         return res.status(500).json({ error: 'Failed to reserve bundle.' });
//     }
// };

export const reserveBundle = async (req, res) => {
    const { bundleId, userName, seats, noOfRooms, roomType } = req.body;
    const transaction = await sequelize.transaction();

    try {
        if (!bundleId || !userName || !seats || !noOfRooms || !roomType) {
            return res.status(400).json({ error: 'bundleId, userName, seats, noOfRooms, roomType are required.' });
        }

        // Fetch user ID
        const [user] = await sequelize.query(
            `SELECT id FROM User WHERE userName = ?`,
            { replacements: [userName], type: sequelize.QueryTypes.SELECT, transaction }
        );
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userId = user.id;

        // Fetch bundle details
        const [bundle] = await sequelize.query(
            `SELECT flightId, flightIdRet, hotelId, discount FROM Bundle WHERE id = ?`,
            { replacements: [bundleId], type: sequelize.QueryTypes.SELECT, transaction }
        );
        if (!bundle) {
            return res.status(404).json({ error: 'Bundle not found' });
        }

        const { flightId, flightIdRet, hotelId, discount } = bundle;

        // Fetch onward flight details
        const [onwardFlight] = await sequelize.query(
            `SELECT numSeats, price, departure FROM Flight WHERE id = ?`,
            { replacements: [flightId], type: sequelize.QueryTypes.SELECT, transaction }
        );
        if (!onwardFlight || onwardFlight.numSeats < seats) {
            return res.status(400).json({ error: 'Not enough seats available on the onward flight.' });
        }

        // Fetch return flight details
        const [returnFlight] = await sequelize.query(
            `SELECT numSeats, price, departure FROM Flight WHERE id = ?`,
            { replacements: [flightIdRet], type: sequelize.QueryTypes.SELECT, transaction }
        );
        if (!returnFlight || returnFlight.numSeats < seats) {
            return res.status(400).json({ error: 'Not enough seats available on the return flight.' });
        }

        // Calculate reservationDate and endDate
        const reservationDate = onwardFlight.departure;
        const endDate = returnFlight.departure;

        // Reserve onward flight
        const onwardBill = ((onwardFlight.price * seats) / 100) * (100 - discount);
        const [flightReservationResult] = await sequelize.query(
            `INSERT INTO FlightReservation (flightId, userId, seats, bill)
             VALUES (?, ?, ?, ?)`,
            { replacements: [flightId, userId, seats, onwardBill], type: sequelize.QueryTypes.INSERT, transaction }
        );
        const flightReservationId = flightReservationResult;

        // Reserve return flight
        const returnBill = ((returnFlight.price * seats) / 100) * (100 - discount);
        const [flightReservationRetResult] = await sequelize.query(
            `INSERT INTO FlightReservation (flightId, userId, seats, bill)
             VALUES (?, ?, ?, ?)`,
            { replacements: [flightIdRet, userId, seats, returnBill], type: sequelize.QueryTypes.INSERT, transaction }
        );
        const flightReservationIdRet = flightReservationRetResult;

        // Reserve hotel
        const roomTypeField = roomType === 'Standard' ? 'standard' : 'deluxe';
        const priceField = roomType === 'Standard' ? 'pricePerNightStandard' : 'pricePerNightDeluxe';

        const [hotel] = await sequelize.query(
            `SELECT ${roomTypeField} AS totalRooms, ${priceField} AS pricePerNight FROM Hotel WHERE id = ?`,
            { replacements: [hotelId], type: sequelize.QueryTypes.SELECT, transaction }
        );

        const [usedRoomsResult] = await sequelize.query(
            `SELECT COALESCE(SUM(noOfRooms), 0) AS usedRooms
             FROM HotelReservation
             WHERE hotelId = ? AND type = ? AND 
                   ((reservationDate BETWEEN ? AND ?) OR (endDate BETWEEN ? AND ?))`,
            {
                replacements: [hotelId, roomType, reservationDate, endDate, reservationDate, endDate],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );
        const usedRooms = usedRoomsResult.usedRooms;
        const availableRooms = hotel.totalRooms - usedRooms;

        if (availableRooms < noOfRooms) {
            return res.status(400).json({ error: 'Not enough rooms available' });
        }

        const [daysResult] = await sequelize.query(
            'SELECT DATEDIFF(?, ?) AS noOfDays',
            {
                replacements: [endDate, reservationDate],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );
        const noOfDays = daysResult.noOfDays + 1;

        // Calculate bill based on price per night and number of days
        const totalBill = ((hotel.pricePerNight * noOfRooms * noOfDays) / 100) * (100 - discount);

        const [hotelReservationResult] = await sequelize.query(
            `INSERT INTO HotelReservation (hotelId, userId, reservationDate, endDate, noOfRooms, type, bill)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
            {
                replacements: [hotelId, userId, reservationDate, endDate, noOfRooms, roomType, totalBill],
                type: sequelize.QueryTypes.INSERT,
                transaction,
            }
        );
        const hotelReservationId = hotelReservationResult;

        // Calculate total bundle cost with discount
        const discountedCost = onwardBill + returnBill + totalBill;

        // Insert bundle reservation
        await sequelize.query(
            `INSERT INTO BundleReservation (userId, bundleId, flightReservationId, flightReservationIdRet, hotelReservationId, bill)
             VALUES (?, ?, ?, ?, ?, ?)`,
            {
                replacements: [userId, bundleId, flightReservationId, flightReservationIdRet, hotelReservationId, discountedCost],
                type: sequelize.QueryTypes.INSERT,
                transaction,
            }
        );

        // Commit transaction
        await transaction.commit();
        return res.status(200).json(new ApiResponse(200, discountedCost, 'Bundle reserved successfully.'));
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ error: 'Failed to reserve bundle.' });
    }
};
