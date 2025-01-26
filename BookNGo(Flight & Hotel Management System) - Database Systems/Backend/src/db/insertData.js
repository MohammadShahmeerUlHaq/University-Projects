import sequelize from '../config/database.js'; // Sequelize instance
import bcrypt from 'bcrypt';
import fs from 'fs';

// Load datasets
const cities = JSON.parse(fs.readFileSync('cities.json', 'utf-8')).map(c => c.name);
const airlines = JSON.parse(fs.readFileSync('airlines.json', 'utf-8')).map(a => a.name);
const hotels = JSON.parse(fs.readFileSync('hotels.json', 'utf-8')).map(h => h.hotel_name);

// Utility to generate random numbers in a range
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const insertAirlines = async () => {
    try {
        const airlineValues = airlines.map(name => {
            // Escape single quotes in the airline name
            const escapedName = name.replace(/'/g, "''"); // Escape single quotes for SQL
            const rating = (Math.random() * 4 + 1).toFixed(1);
            const ratingCount = random(100, 1000);
            return `('${escapedName}', ${rating}, ${ratingCount})`;
        });

        // Check for existing airlines first
        for (const airlineValue of airlineValues) {
            const name = airlineValue.match(/\('([^']+)'/)[1]; // Extract the airline name from the value

            // Query to check if the airline already exists
            const [existingAirline] = await sequelize.query(
                `SELECT COUNT(*) AS count FROM Airline WHERE name = '${name}'`,
                { type: sequelize.QueryTypes.SELECT }
            );

            if (existingAirline.count > 0) {
                console.log(`Airline '${name}' already exists. Skipping insertion.`);
            } else {
                // Insert the airline if it doesn't exist
                const query = `
                    INSERT INTO Airline (name, rating, ratingCount)
                    VALUES ${airlineValue}
                `;
                await sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
                console.log(`Inserted airline: ${name}`);
            }
        }

        console.log('Airlines insertion completed!');
    } catch (error) {
        console.error('Error during airline insertion:', error);
    }
};

// Insert Hotels
const insertHotels = async () => {
    try {
        for (const city of cities) {
            const usedHotelNames = new Set(); // Track unique names for this city during processing

            for (let i = 0; i < 2; i++) {
                let hotelBaseName, uniqueName;

                // Ensure unique base name per city
                do {
                    hotelBaseName = hotels[random(0, hotels.length - 1)].replace(/'/g, "''");
                } while (usedHotelNames.has(hotelBaseName.toLowerCase().trim()));
                usedHotelNames.add(hotelBaseName.toLowerCase().trim());

                // Generate a unique hotel name
                let suffix = 0;
                do {
                    uniqueName = `${hotelBaseName} - ${city}${suffix > 0 ? ` - ${suffix}` : ''}`.replace(/'/g, "''");
                    suffix++;

                    // Check for duplicate entry in the database
                    const [existingHotel] = await sequelize.query(
                        `SELECT COUNT(*) AS count FROM Hotel WHERE name = '${uniqueName}'`,
                        { type: sequelize.QueryTypes.SELECT }
                    );

                    if (existingHotel.count === 0) break; // Name is unique in the database
                } while (true);

                const location = city.replace(/'/g, "''");
                const standardRooms = random(10, 50);
                const deluxeRooms = random(5, 30);
                const priceStandard = random(100, 300);
                const priceDeluxe = random(200, 500);
                const rating = (Math.random() * 4 + 1).toFixed(1);
                const ratingCount = random(100, 1000);

                const query = `
                    INSERT INTO Hotel (name, standard, deluxe, location, pricePerNightStandard, pricePerNightDeluxe, rating, ratingCount)
                    VALUES ('${uniqueName}', ${standardRooms}, ${deluxeRooms}, '${location}', ${priceStandard}, ${priceDeluxe}, ${rating}, ${ratingCount})
                `;
                try {
                    await sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
                    console.log(`Inserted hotel: ${uniqueName}`);
                } catch (error) {
                    console.error(`Error inserting hotel '${uniqueName}':`, error);
                }
            }
        }

        console.log('Hotel insertion completed!');
    } catch (error) {
        console.error('Error during hotel insertion:', error);
    }
};

// Insert Flights
const insertFlights = async () => {
    try {
        const totalFlights = 5000; // Target total number of flights
        const startDate = new Date('2024-12-01');
        const endDate = new Date('2025-01-31');
        let flightCount = 0;

        const usedFlightIdentifiers = new Set(); // Track all unique flight identifiers

        while (flightCount < totalFlights) {
            const origin = cities[random(0, cities.length - 1)];
            const destination = cities[random(0, cities.length - 1)];

            if (origin === destination) continue; // Skip same-city flights

            let airline, departureDate, flightIdentifier;

            // Ensure unique flight identifier for this route
            do {
                airline = random(0, airlines.length - 1);
                departureDate = new Date(startDate.getTime() + random(0, endDate - startDate));
                flightIdentifier = `${airline}-${origin}-${destination}-${departureDate.toISOString()}`.toLowerCase().trim();
            } while (usedFlightIdentifiers.has(flightIdentifier));

            usedFlightIdentifiers.add(flightIdentifier);

            const price = random(100, 500);
            const numSeats = random(50, 300);
            const status = 'Scheduled';

            const query = `
                INSERT INTO Flight (airlineId, origin, destination, departure, price, status, numSeats)
                VALUES ('${airline}', '${origin}', '${destination}', '${departureDate.toISOString().slice(0, 19).replace('T', ' ')}', ${price}, '${status}', ${numSeats})
            `;

            try {
                // Check for duplicate entry in the database
                const [existingFlight] = await sequelize.query(
                    `SELECT COUNT(*) AS count FROM Flight WHERE airlineId = '${airline}' AND origin = '${origin}' AND destination = '${destination}' AND departure = '${departureDate.toISOString().slice(0, 19).replace('T', ' ')}'`,
                    { type: sequelize.QueryTypes.SELECT }
                );

                if (existingFlight.count === 0) {
                    await sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
                    console.log(`Inserted flight: ${airline}, ${origin} -> ${destination}, ${departureDate}`);
                    flightCount++;
                } else {
                    console.log(`Duplicate flight detected. Skipping: ${airline}, ${origin} -> ${destination}, ${departureDate}`);
                }
            } catch (error) {
                console.error(`Error inserting flight '${airline}, ${origin} -> ${destination}, ${departureDate}':`, error);
            }
        }

        console.log(`Flight insertion completed! Total flights inserted: ${flightCount}`);
    } catch (error) {
        console.error('Error during flight insertion:', error);
    }
};

// Insert Bundles

const insertBundles = async () => {
    try {
        const bundleValues = [];
        const bundleCount = 100; // Number of bundles to generate
        const maxRetries = 50; // Maximum retries for finding valid bundles

        for (let i = 0; i < bundleCount; i++) {
            let retries = 0;
            let validBundleFound = false;

            while (!validBundleFound && retries < maxRetries) {
                retries++;

                // Step 1: Select a random going flight
                const [goingFlight] = await sequelize.query(
                    `SELECT id, origin, destination, departure 
                     FROM Flight 
                     ORDER BY RAND() 
                     LIMIT 1`,
                    { type: sequelize.QueryTypes.SELECT }
                );

                if (!goingFlight) continue; // Skip if no going flight is found

                const goingDate = new Date(goingFlight.departure);

                // Step 2: Find return flights
                const returnFlights = await sequelize.query(
                    `SELECT id, origin, destination, departure 
                     FROM Flight 
                     WHERE origin = :destination 
                       AND destination = :origin 
                       AND departure > :goingDate`,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: {
                            destination: goingFlight.destination,
                            origin: goingFlight.origin,
                            goingDate: goingDate.toISOString(),
                        },
                    }
                );

                if (returnFlights.length === 0) continue; // Skip if no return flights are found

                // Randomly select one return flight
                const returnFlight = returnFlights[Math.floor(Math.random() * returnFlights.length)];

                // Step 3: Find hotels at the destination of the going flight
                const hotels = await sequelize.query(
                    `SELECT id FROM Hotel WHERE location = :destination`,
                    {
                        type: sequelize.QueryTypes.SELECT,
                        replacements: { destination: goingFlight.destination },
                    }
                );

                if (hotels.length === 0) continue; // Skip if no hotels are found

                // Randomly select one hotel
                const hotel = hotels[Math.floor(Math.random() * hotels.length)];

                // Step 4: Add to bundle values
                const discount = random(5, 50); // Discount percentage (5% to 50%)
                bundleValues.push(`(${goingFlight.id}, ${returnFlight.id}, ${hotel.id}, ${discount})`);
                validBundleFound = true;
            }

            if (!validBundleFound) {
                console.warn(`Failed to generate a valid bundle after ${maxRetries} retries.`);
            }
        }

        if (bundleValues.length === 0) {
            console.error('No bundle data to insert. Skipping insertion.');
            return;
        }

        const batchSize = 100; // Process in batches
        for (let i = 0; i < bundleValues.length; i += batchSize) {
            const batch = bundleValues.slice(i, i + batchSize);
            const query = `
                INSERT INTO Bundle (flightId, flightIdRet, hotelId, discount)
                VALUES ${batch.join(', ')}
            `;
            await sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
            console.log(`Inserted batch ${Math.ceil(i / batchSize) + 1} of bundles.`);
        }

        console.log('Bundle insertion completed!');
    } catch (error) {
        console.error('Error during bundle insertion:', error);
    }
};

// const insertBundles = async () => {
//     try {
//         const bundleValues = [];
//         const bundleCount = 100; // Number of bundles to generate

//         for (let i = 0; i < bundleCount; i++) {
//             const hotelId = random(1, 2000); // Assuming hotel IDs are from 1 to 2000
//             let flightId, flightIdRet;

//             // Ensure flights form a valid round trip and hotel is at the destination
//             do {
//                 flightId = random(1, 10000); // Assuming flight IDs are from 1 to 10000
//                 flightIdRet = random(1, 10000);

//                 // Fetch the going flight details
//                 const [goingFlight] = await sequelize.query(
//                     `SELECT id, origin, destination, departure 
//                      FROM Flight WHERE id = ${flightId}`,
//                     { type: sequelize.QueryTypes.SELECT }
//                 );

//                 // Fetch the return flight details
//                 const [returnFlight] = await sequelize.query(
//                     `SELECT id, origin, destination, departure 
//                      FROM Flight WHERE id = ${flightIdRet}`,
//                     { type: sequelize.QueryTypes.SELECT }
//                 );

//                 if (!goingFlight || !returnFlight) continue; // Skip if flight IDs don't exist

//                 const goingDate = new Date(goingFlight.departure);
//                 const returnDate = new Date(returnFlight.departure);

//                 // Check flight validity: going flight destination == return flight origin, and vice versa
//                 if (
//                     goingFlight.destination === returnFlight.origin &&
//                     goingFlight.origin === returnFlight.destination &&
//                     returnDate > goingDate
//                 ) {
//                     // Fetch the hotel details to ensure it's at the destination of the first flight
//                     const [hotel] = await sequelize.query(
//                         `SELECT id FROM Hotel WHERE id = ${hotelId} AND location = '${goingFlight.destination}'`,
//                         { type: sequelize.QueryTypes.SELECT }
//                     );

//                     if (hotel) break; // Valid bundle found
//                 }
//             } while (true);

//             const discount = random(5, 50); // Discount percentage (5% to 50%)
//             bundleValues.push(`(${flightId}, ${flightIdRet}, ${hotelId}, ${discount})`);
//         }

//         if (bundleValues.length === 0) {
//             console.error('No bundle data to insert. Skipping insertion.');
//             return;
//         }

//         const batchSize = 100; // Process in batches to avoid memory issues
//         for (let i = 0; i < bundleValues.length; i += batchSize) {
//             const batch = bundleValues.slice(i, i + batchSize);
//             const query = `
//                 INSERT INTO Bundle (flightId, flightIdRet, hotelId, discount)
//                 VALUES ${batch.join(', ')}
//             `;
//             await sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
//             console.log(`Inserted batch ${i / batchSize + 1} of bundles.`);
//         }

//         console.log('Bundle insertion completed!');
//     } catch (error) {
//         console.error('Error during bundle insertion:', error);
//     }
// };

// const insertBundles = async () => {
//     try {
//         const bundleValues = [];
//         const bundleCount = 1000; // Number of bundles to generate

//         for (let i = 0; i < bundleCount; i++) {
//             const hotelId = random(1, 2000); // Assuming hotel IDs are from 1 to 2000
//             let flightId, flightIdRet;

//             // Ensure return flight's date is after the departure flight's date
//             do {
//                 flightId = random(1, 10000); // Assuming flight IDs are from 1 to 10000
//                 flightIdRet = random(1, 10000);

//                 const [goingFlight] = await sequelize.query(
//                     `SELECT departure FROM Flight WHERE id = ${flightId}`,
//                     { type: sequelize.QueryTypes.SELECT }
//                 );

//                 const [returnFlight] = await sequelize.query(
//                     `SELECT departure FROM Flight WHERE id = ${flightIdRet}`,
//                     { type: sequelize.QueryTypes.SELECT }
//                 );

//                 if (!goingFlight || !returnFlight) continue; // Skip if flight IDs don't exist

//                 const goingDate = new Date(goingFlight.departure);
//                 const returnDate = new Date(returnFlight.departure);

//                 if (returnDate > goingDate) break; // Valid return date found
//             } while (true);

//             const discount = random(5, 50); // Discount percentage (5% to 50%)
//             bundleValues.push(`(${flightId}, ${flightIdRet}, ${hotelId}, ${discount})`);
//         }

//         if (bundleValues.length === 0) {
//             console.error('No bundle data to insert. Skipping insertion.');
//             return;
//         }

//         const batchSize = 100; // Process in batches to avoid memory issues
//         for (let i = 0; i < bundleValues.length; i += batchSize) {
//             const batch = bundleValues.slice(i, i + batchSize);
//             const query = `
//                 INSERT INTO Bundle (flightId, flightIdRet, hotelId, discount)
//                 VALUES ${batch.join(', ')}
//             `;
//             await sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
//             console.log(`Inserted batch ${i / batchSize + 1} of bundles.`);
//         }

//         console.log('Bundle insertion completed!');
//     } catch (error) {
//         console.error('Error during bundle insertion:', error);
//     }
// };


const insertAdmins = async () => {
    try {
        const h1 = await bcrypt.hash('Kay224643', 10);
        const h2 = await bcrypt.hash('Kay224611', 10);
        const h3 = await bcrypt.hash('Kay224416', 10);

        const query = `
        INSERT INTO Admin (userName, name, password, lastLogin) 
        VALUES 
        (:userName1, :name1, :password1, NOW()),
        (:userName2, :name2, :password2, NOW()),
        (:userName3, :name3, :password3, NOW())
    `;

        await sequelize.query(query, {
            replacements: {
                userName1: 'msuhk',
                name1: 'Mohammad Shahmeer Ul Haq',
                password1: h1,
                userName2: 'roohan.alt',
                name2: 'Roohan Ahmed',
                password2: h2,
                userName3: 'armughann_',
                name3: 'Armughan Ather',
                password3: h3
            },
            type: sequelize.QueryTypes.INSERT
        });
    } catch (error) {
        console.error('Error inserting users:', error);
    }
};

// Run Insertions
const runInserts = async () => {
    try {
        console.log('Starting data insertion...');
        // await insertAirlines();
        // await insertAdmins();
        // await insertHotels();
        // await insertFlights();
        await insertBundles();
        console.log('Data insertion completed.');
    } catch (error) {
        console.error('Error during data insertion:', error);
    }
};

runInserts();