export const createTableFlightReservation = `
CREATE TABLE IF NOT EXISTS FlightReservation (
id INT AUTO_INCREMENT PRIMARY KEY,
flightId int NOT NULL,
userId int not null,
bookingDate DATE DEFAULT CURRENT_TIMESTAMP,
status VARCHAR(50) NOT NULL DEFAULT 'Booked',
seats INT NOT NULL,
bill INT NOT NULL,
FOREIGN KEY (flightId) REFERENCES Flight(id),
FOREIGN KEY (userId) REFERENCES User(id)
)
`;