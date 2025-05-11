import sequelize from '../config/database.js'; // Sequelize instance
import { ApiResponse } from '../utils/ApiResponse.js'; // Assuming you have this

export const updateAirlineRating = async (req, res) => {
    const { flightReservationId, airlineId, rating } = req.body;
    const ratingInt = parseInt(rating);

    if (!airlineId || rating === undefined) {
        return res.status(400).json({ error: 'Airline ID and rating are required.' });
    }

    try {
        // Start a transaction
        const transaction = await sequelize.transaction();

        try {
            // Fetch the current rating and ratingCount for the airline
            const [airline] = await sequelize.query(
                'SELECT rating, ratingCount FROM Airline WHERE id = :airlineId',
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { airlineId },
                    transaction,
                }
            );

            if (!airline) {
                return res.status(404).json({ error: 'Airline not found.' });
            }

            const { rating: currentRating, ratingCount: currentRatingCount } = airline;

            // Calculate the new rating and ratingCount
            const newRatingCount = currentRatingCount + 1;
            const newRating = (currentRating * currentRatingCount + ratingInt) / newRatingCount;

            // Update the airline record with the new values
            await sequelize.query(
                'UPDATE Airline SET rating = :newRating, ratingCount = :newRatingCount WHERE id = :airlineId',
                {
                    type: sequelize.QueryTypes.UPDATE,
                    replacements: {
                        newRating,
                        newRatingCount,
                        airlineId,
                    },
                    transaction,
                }
            );

            await sequelize.query(
                'UPDATE FlightReservation SET status = "Rated" WHERE id = :flightReservationId',
                {
                    type: sequelize.QueryTypes.UPDATE,
                    replacements: {
                        flightReservationId: flightReservationId,
                    },
                    transaction,
                }
            );



            // Commit the transaction
            await transaction.commit();

            return res.status(200).json(new ApiResponse(200, { newRating }, 'Rating updated successfully.'));
        } catch (err) {
            // Rollback the transaction in case of an error
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update airline rating. Please try again later.' });
    }
};


export const allAirlines = async (req, res) => {
    try {
        const query = `
            SELECT name FROM Airline
        `;

        // 3. Execute the raw SQL query with replacements
        const airlines = await sequelize.query(query, {
            replacements: {
            },
            type: sequelize.QueryTypes.SELECT
        });

        // 4. Check if any airlines were found
        if (airlines.length === 0) {
            return res.status(404).json({ error: 'Unable to fetch airline names.' });
        }

        // 5. Return the list of airlines
        console.log(airlines);
        return res.status(200).json(new ApiResponse(200, airlines, 'Airlines found.'));
    } catch (error) {
        console.error('Error fetching airline names:', error);
        return res.status(500).json({ error: 'An error occurred while fetching for airline names.' });
    }
};