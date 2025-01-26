export const createTableCancelledBundleReservation = `
CREATE TABLE IF NOT EXISTS CancelledBundleReservation (
id INT AUTO_INCREMENT PRIMARY KEY,
bill INT NOT NULL,
FOREIGN KEY (id) REFERENCES BundleReservation(id)
)
`;