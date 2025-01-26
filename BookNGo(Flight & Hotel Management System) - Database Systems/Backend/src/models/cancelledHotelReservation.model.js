export const createTableCancelledHotelReservation = `
CREATE TABLE IF NOT EXISTS CancelledHotelReservation (
id INT PRIMARY KEY,
bill INT NOT NULL,
FOREIGN KEY (id) REFERENCES HotelReservation(id)
)
`;