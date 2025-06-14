// import sequelize from '../config/database.js'; // Sequelize instance
// import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have this

// export const reserveHotelRoom = async (req, res) => {
//     const { hotelId, userName, reservationDate, endDate, noOfRooms, type } = req.body;

//     // Start a transaction to ensure data consistency
//     const transaction = await sequelize.transaction();

//     try {
//         if (!hotelId || !userName || !reservationDate || !endDate || !noOfRooms || !type) {
//             return res.status(400).json({ error: 'ReservationDate, endDate, room type, and number of rooms are required.' });
//         }
//         // Determine which room type to check and update (standard or deluxe)
//         const roomTypeField = type === 'Standard' ? 'standard' : 'deluxe';

//         // Check if enough rooms of the specified type are available
//         const [hotel] = await sequelize.query(
//             `SELECT ${roomTypeField} FROM Hotel WHERE id = ?`,
//             {
//                 replacements: [hotelId],
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

//         if (!hotel || hotel[roomTypeField] < noOfRooms) {
//             return res.status(400).json({ error: 'Not enough rooms available' });
//         }

//         // Calculate number of days
//         const [daysResult] = await sequelize.query(
//             'SELECT DATEDIFF(?, ?) AS noOfDays',
//             {
//                 replacements: [endDate, reservationDate],
//                 type: sequelize.QueryTypes.SELECT,
//                 transaction,
//             }
//         );
//         const noOfDays = daysResult.noOfDays;

//         // Insert reservation data into HotelReservation table
//         const [result] = await sequelize.query(
//             `INSERT INTO HotelReservation (hotelId, userId, reservationDate, endDate, noOfDays, noOfRooms, type)
//              VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             {
//                 replacements: [hotelId, userId, reservationDate, endDate, noOfDays, noOfRooms, type],
//                 type: sequelize.QueryTypes.INSERT,
//                 transaction,
//             }
//         );

//         // Update the remaining number of rooms in the Hotel table for the specified room type
//         await sequelize.query(
//             `UPDATE Hotel SET ${roomTypeField} = ${roomTypeField} - ? WHERE id = ?`,
//             {
//                 replacements: [noOfRooms, hotelId],
//                 type: sequelize.QueryTypes.UPDATE,
//                 transaction,
//             }
//         );

//         // Commit the transaction after successful reservation
//         await transaction.commit();
//         return res.status(200).json(new ApiResponse(200, null, 'Hotel room reserved successfully'));
//     } catch (error) {
//         // Rollback the transaction in case of errors
//         await transaction.rollback();
//         console.log(error.message);
//         res.status(500).json({ error: 'Error reserving hotel room' });
//     }
// };





import sequelize from '../config/database.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const updateHotelReservation = async (req, res) => {
    const { reservationId, reservationStartDate, reservationEndDate, roomType, rooms } = req.body;
    const transaction = await sequelize.transaction();

    try {
        if (!reservationId || !reservationStartDate || !reservationEndDate || !roomType || rooms == null) {
            return res.status(400).json({ error: 'All reservation details are required.' });
        }

        const roomTypeField = roomType === 'Standard' ? 'standard' : 'deluxe';
        const priceField = roomType === 'Standard' ? 'pricePerNightStandard' : 'pricePerNightDeluxe';

        // Fetch current reservation details
        const [reservation] = await sequelize.query(
            `SELECT hr.hotelId, hr.noOfRooms AS currentRooms, hr.bill AS currentBill, 
                    h.${roomTypeField} AS totalRooms, h.${priceField} AS pricePerNight
             FROM HotelReservation hr
             JOIN Hotel h ON hr.hotelId = h.id
             WHERE hr.id = ? AND hr.type = ?`,
            {
                replacements: [reservationId, roomType],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found.' });
        }

        const { hotelId, currentRooms, currentBill, totalRooms, pricePerNight } = reservation;

        // Calculate used rooms for the given date range (excluding current reservation)
        const [usedRoomsResult] = await sequelize.query(
            `SELECT COALESCE(SUM(noOfRooms), 0) AS usedRooms
             FROM HotelReservation
             WHERE hotelId = ? AND type = ? AND id != ? AND 
                   ((reservationDate BETWEEN ? AND ?) OR (endDate BETWEEN ? AND ?))`,
            {
                replacements: [hotelId, roomType, reservationId, reservationStartDate, reservationEndDate, reservationStartDate, reservationEndDate],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        const usedRooms = usedRoomsResult.usedRooms;
        const availableRooms = totalRooms - usedRooms;

        if (availableRooms < rooms) {
            return res.status(400).json({ error: 'Not enough rooms available.' });
        }

        // Calculate number of days for the updated reservation
        const [daysResult] = await sequelize.query(
            'SELECT DATEDIFF(?, ?) AS noOfDays',
            {
                replacements: [reservationEndDate, reservationStartDate],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );
        const noOfDays = daysResult.noOfDays + 1;

        // Calculate the new bill
        const newBill = pricePerNight * rooms * noOfDays;
        const changeInBill = newBill - currentBill;

        // If the bill decreases or remains the same, update the reservation
        if (changeInBill <= 0) {
            await sequelize.query(
                `UPDATE HotelReservation
                 SET reservationDate = ?, endDate = ?, noOfRooms = ?, bill = ?, type = ?
                 WHERE id = ?`,
                {
                    replacements: [reservationStartDate, reservationEndDate, rooms, newBill, roomType, reservationId],
                    type: sequelize.QueryTypes.UPDATE,
                    transaction,
                }
            );

            await transaction.commit();
            return res.status(200).json({
                message: 'Reservation updated successfully.',
                changeInBill,
            });
        }

        // If the bill increases, do not update the reservation but return the bill increase
        await transaction.rollback();
        return res.status(200).json({
            message: 'Bill increase detected.',
            changeInBill,
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error.message);
        res.status(500).json({ error: 'Error updating hotel reservation.' });
    }
};

export const updateHotelReservation2 = async (req, res) => {
    const { reservationId, reservationStartDate, reservationEndDate, roomType, rooms, amount } = req.body;
    const transaction = await sequelize.transaction();

    try {
        if (!reservationId || !reservationStartDate || !reservationEndDate || !roomType || rooms == null) {
            return res.status(400).json({ error: 'All reservation details are required.' });
        }

        const roomTypeField = roomType === 'Standard' ? 'standard' : 'deluxe';
        const priceField = roomType === 'Standard' ? 'pricePerNightStandard' : 'pricePerNightDeluxe';

        // Fetch current reservation details
        const [reservation] = await sequelize.query(
            `SELECT hr.hotelId, hr.noOfRooms AS currentRooms, hr.bill AS currentBill, 
                    h.${roomTypeField} AS totalRooms, h.${priceField} AS pricePerNight
             FROM HotelReservation hr
             JOIN Hotel h ON hr.hotelId = h.id
             WHERE hr.id = ? AND hr.type = ?`,
            {
                replacements: [reservationId, roomType],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found.' });
        }

        const { hotelId, currentRooms, currentBill, totalRooms, pricePerNight } = reservation;

        // Calculate used rooms for the given date range (excluding current reservation)
        const [usedRoomsResult] = await sequelize.query(
            `SELECT COALESCE(SUM(noOfRooms), 0) AS usedRooms
             FROM HotelReservation
             WHERE hotelId = ? AND type = ? AND id != ? AND 
                   ((reservationDate BETWEEN ? AND ?) OR (endDate BETWEEN ? AND ?))`,
            {
                replacements: [hotelId, roomType, reservationId, reservationStartDate, reservationEndDate, reservationStartDate, reservationEndDate],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        const usedRooms = usedRoomsResult.usedRooms;
        const availableRooms = totalRooms - usedRooms;

        if (availableRooms < rooms) {
            return res.status(400).json({ error: 'Not enough rooms available.' });
        }

        const newBill = amount + currentBill;

        await sequelize.query(
            `UPDATE HotelReservation
                 SET reservationDate = ?, endDate = ?, noOfRooms = ?, bill = ?, type = ?
                 WHERE id = ?`,
            {
                replacements: [reservationStartDate, reservationEndDate, rooms, newBill, roomType, reservationId],
                type: sequelize.QueryTypes.UPDATE,
                transaction,
            }
        );

        await transaction.commit();
        return res.status(200).json({
            message: 'Reservation updated successfully.',
            newBill,
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error.message);
        res.status(500).json({ error: 'Error updating hotel reservation.' });
    }
};


export const reserveHotelRoom = async (req, res) => {
    const { hotelId, userName, reservationDate, endDate, noOfRooms, type } = req.body;
    const transaction = await sequelize.transaction();

    try {
        if (!hotelId || !userName || !reservationDate || !endDate || !noOfRooms || !type) {
            return res.status(400).json({ error: 'All reservation details are required.' });
        }

        const roomTypeField = type === 'Standard' ? 'standard' : 'deluxe';
        const priceField = type === 'Standard' ? 'pricePerNightStandard' : 'pricePerNightDeluxe';

        // Fetch total rooms and price per night
        const [hotel] = await sequelize.query(
            `SELECT ${roomTypeField} AS totalRooms, ${priceField} AS pricePerNight FROM Hotel WHERE id = ?`,
            {
                replacements: [hotelId],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
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

        // Calculate used rooms for the given date range
        const [usedRoomsResult] = await sequelize.query(
            `SELECT COALESCE(SUM(noOfRooms), 0) AS usedRooms
             FROM HotelReservation
             WHERE hotelId = ? AND type = ? AND 
                   ((reservationDate BETWEEN ? AND ?) OR (endDate BETWEEN ? AND ?))`,
            {
                replacements: [hotelId, type, reservationDate, endDate, reservationDate, endDate],
                type: sequelize.QueryTypes.SELECT,
                transaction,
            }
        );
        const usedRooms = usedRoomsResult.usedRooms;
        const availableRooms = hotel.totalRooms - usedRooms;

        if (availableRooms < noOfRooms) {
            return res.status(400).json({ error: 'Not enough rooms available' });
        }

        // Calculate number of days
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
        const bill = hotel.pricePerNight * noOfRooms * noOfDays;

        // Insert reservation data into HotelReservation table
        await sequelize.query(
            `INSERT INTO HotelReservation (hotelId, userId, reservationDate, endDate, noOfRooms, type, bill)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            {
                replacements: [hotelId, userId, reservationDate, endDate, noOfRooms, type, bill],
                type: sequelize.QueryTypes.INSERT,
                transaction,
            }
        );

        // Commit the transaction after successful reservation
        await transaction.commit();
        return res.status(200).json(new ApiResponse(200, bill, 'Hotel room reserved successfully'));
    } catch (error) {
        await transaction.rollback();
        console.log(error.message);
        res.status(500).json({ error: 'Error reserving hotel room' });
    }
};

