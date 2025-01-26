// import dotenv from "dotenv";
// import { app } from './app.js';
// import { setupDatabase } from './db/dbSetup.js';

// dotenv.config({
//     path: './.env'
// });
// (async () => {
//     try {
//         // Await the setupDatabase function to ensure it completes before continuing
//         await setupDatabase();
//         console.log('Database setup completed.');

        
//     } catch (error) {
//         console.error('Error during database setup or server startup:', error);
//         process.exit(1);  // Exit on failure
//     }
// })();

import dotenv from "dotenv";
import { app } from './app.js';
import { setupDatabase } from './db/dbSetup.js';

dotenv.config({
    path: './.env'
});

(async () => {
    try {
        // Await the setupDatabase function to ensure it completes before continuing
        await setupDatabase();
        console.log('Database setup completed.');

        // Start the server after database setup
        const PORT = process.env.PORT || 8000;  // Default to 8000 if PORT is not defined in .env
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Error during database setup or server startup:', error);
        process.exit(1);  // Exit on failure
    }
})();









// import dotenv from "dotenv";
// import { app } from './app.js';
// import { setupDatabase } from './db/dbSetup.js';

// dotenv.config({
//     path: './.env'
// });

// (() => {
//     try {
//         setupDatabase();
//         console.log('Database setup completed hello.');

//         // Start the server after DB setup
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is Running at PORT: ${process.env.PORT}`);
//         });
//     } catch (error) {
//         console.error('Error during database setup or server startup:', error);
//         process.exit(1);  // Exit on failure
//     }
// })();