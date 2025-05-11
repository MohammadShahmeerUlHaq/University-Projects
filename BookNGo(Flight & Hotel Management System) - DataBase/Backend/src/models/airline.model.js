export const createTableAirline = `
CREATE TABLE IF NOT EXISTS Airline (
id int auto_increment PRIMARY KEY,
name VARCHAR(100) unique,
rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
ratingCount INT NOT NULL DEFAULT 0
)
`;