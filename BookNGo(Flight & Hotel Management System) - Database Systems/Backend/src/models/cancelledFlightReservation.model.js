export const createTableCancelledFlightReservation = `
CREATE TABLE IF NOT EXISTS CancelledFlightReservation (
id INT PRIMARY KEY,
bill INT NOT NULL,
FOREIGN KEY (id) REFERENCES FlightReservation(id)
)
`;