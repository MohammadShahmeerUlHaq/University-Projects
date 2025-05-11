import sequelize from '../config/database.js'; // Sequelize instance
import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have this

export const searchFlights = async (req, res) => {
    try {
        const { origin, destination, numberOfSeats, fromDate, toDate, airlineName } = req.body;

        // 1. Validate inputs
        if (!origin || !destination || !numberOfSeats || !fromDate) {
            return res.status(400).json({ error: 'Origin, destination, number of seats, and fromDate are required.' });
        }

        // 2. Convert fromDate and toDate to SQL-compatible timestamp
        const fromDateTimestamp = new Date(fromDate);  // No need to parse, the input is a valid Date string
        let toDateTimestamp = toDate ? new Date(toDate) : null;

        // 3. Build the base query for flights
        let query = `
            SELECT flight.id, airlineId, Airline.name, departure, destination, origin, price, status, numSeats, rating, ratingCount
            FROM Flight, Airline
            WHERE 
                Airline.id = Flight.airlineId
                AND origin = :origin
                AND destination = :destination
                AND numSeats >= :numberOfSeats
                AND departure >= :fromDateTimestamp
        `;

        // 4. Add toDate condition if provided
        if (toDateTimestamp) {
            query += ` AND departure <= :toDateTimestamp`;
        }

        // 5. If airlineName is provided, search for that specific airline
        let airlineId;
        if (airlineName) {
            const query1 = `
                SELECT * FROM Airline WHERE name = :airlineName
            `;

            const [airline] = await sequelize.query(query1, {
                replacements: { airlineName }, // Replacing placeholder with variable
                type: sequelize.QueryTypes.SELECT
            });
            //const airline = await Airline.findOne({ where: { name: airlineName } });
            if (!airline) {
                return res.status(404).json({ error: 'Airline not found.' });
            }
            airlineId = airline.id;
            query += ` AND airlineId = :airlineId`;
        }

        // 6. Execute the raw SQL query with replacements
        const flights = await sequelize.query(query, {
            replacements: {
                origin: origin,
                destination: destination,
                numberOfSeats: parseInt(numberOfSeats),
                fromDateTimestamp: fromDateTimestamp,
                toDateTimestamp: toDateTimestamp,
                airlineId: airlineId
            },
            type: sequelize.QueryTypes.SELECT
        });

        // 7. Check if any flights were found
        if (flights.length === 0) {
            return res.status(404).json({ error: 'No flights found matching the criteria.' });
        }

        // 8. Return the list of flights
        return res.status(200).json(new ApiResponse(200, flights, 'Flights found.'));
    } catch (error) {
        console.error('Error searching flights:', error);
        return res.status(500).json({ error: 'An error occurred while searching for flights.' });
    }
};