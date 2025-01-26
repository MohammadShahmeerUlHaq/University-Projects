export const createTableBundle = `
CREATE TABLE IF NOT EXISTS Bundle (
id INT AUTO_INCREMENT PRIMARY KEY,
flightId INT NOT NULL,
flightIdRet INT NOT NULL,
hotelId int NOT NULL,
discount INT NOT NULL,
FOREIGN KEY (flightId) REFERENCES Flight(id),
FOREIGN KEY (flightIdRet) REFERENCES Flight(id),
FOREIGN KEY (hotelId) REFERENCES Hotel(id)
)
`;