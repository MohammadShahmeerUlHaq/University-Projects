export const createTableUser = `
CREATE TABLE IF NOT EXISTS User (
id int Auto_increment primary key,
userName VARCHAR(20) unique,
name VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
phone VARCHAR(20) NOT NULL,
bookings INT DEFAULT 0,
cnicOrPassport VARCHAR(20) NOT NULL unique
)
`;

function generateAccessToken(User) {
    return jwt.sign(
        {
            id: User.id,
            email: User.email,
            username: User.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

function generateRefreshToken(User) {
    return jwt.sign(
        { id: User.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

//const hashedPassword = await bcrypt.hash(password, 10);
//const isPasswordCorrect = await bcrypt.compare(password, user.password);