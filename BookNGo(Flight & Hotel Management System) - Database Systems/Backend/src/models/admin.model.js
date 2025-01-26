export const createTableAdmin = `
CREATE TABLE IF NOT EXISTS Admin (
id int Auto_increment primary key,
userName VARCHAR(20) unique,
name VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL,
lastLogin TIMESTAMP
)
`;
//
// UPDATE Admin SET last_login = NOW() WHERE id = 1;