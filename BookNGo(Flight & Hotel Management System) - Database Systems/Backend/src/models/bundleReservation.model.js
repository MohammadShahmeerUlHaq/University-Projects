export const createTableBundleReservation = `
CREATE TABLE IF NOT EXISTS BundleReservation (
id INT AUTO_INCREMENT PRIMARY KEY,
userId INT NOT NULL,
status VARCHAR(50) NOT NULL DEFAULT 'Booked',
bill INT NOT NULL,
flightReservationId INT NOT NULL,
flightReservationIdRet INT NOT NULL,
hotelReservationId int NOT NULL,
bundleId INT NOT NULL,
FOREIGN KEY (flightReservationId) REFERENCES FlightReservation(id),
FOREIGN KEY (flightReservationIdRet) REFERENCES FlightReservation(id),
FOREIGN KEY (bundleId) REFERENCES Bundle(id),
FOREIGN KEY (hotelReservationId) REFERENCES HotelReservation(id),
FOREIGN KEY (userId) REFERENCES User(id)
)
`;