export const endConnection = (connection) => {
    if (connection) {
        connection.end((err) => {
            if (err) {
                console.error('Error closing connection:', err);
            } else {
                console.log('DB Connection closed.');
            }
        });
    }
};