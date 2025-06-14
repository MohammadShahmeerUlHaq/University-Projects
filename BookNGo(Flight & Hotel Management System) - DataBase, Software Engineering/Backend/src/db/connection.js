import mysql from 'mysql';
import { DB_NAME } from '../constants.js';

const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: DB_NAME
});
export default connection;










// import mysql from 'mysql';
// import { DB_NAME } from '../constants.js';

// const db = mysql.createConnection({
//     host: process.env.MYSQL_HOST || 'localhost',
//     user: process.env.MYSQL_USER || 'root',
//     password: process.env.MYSQL_PASSWORD || '',
//     database: DB_NAME
// });

// db.connect((err) => {
//     if (err) {
//         console.error('MySQL connection FAILED:', err);
//         process.exit(1); // Exit the process on failure
//     }
//     console.log(`\nMySQL connected! DB HOST: ${db.config.host}`);
// });
// export default db;