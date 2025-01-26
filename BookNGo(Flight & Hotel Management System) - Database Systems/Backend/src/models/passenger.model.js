export const createTablePassenger = `
CREATE TABLE IF NOT EXISTS Passenger (
id INT AUTO_INCREMENT PRIMARY KEY,
flightReservationId int NOT NULL,
name VARCHAR(50) not null,
passportOrCnic VARCHAR(50) not null,
FOREIGN KEY (flightReservationId) REFERENCES FlightReservation(id)
)
`;