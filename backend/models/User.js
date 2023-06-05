const mysql = require('mysql');
const bcrypt = require('bcrypt');

let meNexus = mysql.createConnection({
    socketPath  : process.env.DB_SOCKETPATH,
    host        : process.env.DB_HOST,
    port        : process.env.DB_PORT,
    user        : process.env.DB_USER,
    password    : process.env.DB_PASSWORD,
    database    : process.env.DB_DATABASE
});

meNexus.connect();

const createUser = async (email, password, handle, username) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            email,
            password: hashedPassword,
            handle,
            username
        };

        const result = await meNexus.query('INSERT INTO Users SET ?', user);

        console.log('User created:', result.insertId);
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

const getUserByEmail = async (email) => {
    console.log("getUserByEmail FIRED!");
    console.log(email.email);
    try {
        const query = 'SELECT * FROM Users WHERE email = ?';
        const result = await executeQuery(query, email);
        //console.log(result);
        return result[0];
    } catch (error) {
        throw new Error(error);
    }
};

const getUserByHandle = async (handle) => {
    try {
        const query = 'SELECT * FROM Users WHERE handle = ?';
        const result = await executeQuery(query, handle);
        //console.log(result);
        if (result.length === 0) {
            return null; // User not found
        }
        return result[0]; // Return the first user object from the result
    } catch (error) {
        throw new Error(error);
    }
};

const executeQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        meNexus.query(query, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserByHandle
};