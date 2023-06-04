//Import Express
const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql');
require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


//Instantiate Express app called "server"
const server = express()
server.use(cors());
server.use(morgan('combined'));
server.use(bodyParser.json());
server.use(express.json());

// Use Express session middleware
server.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Use Passport middleware
server.use(passport.initialize());
server.use(passport.session());

// Assigning port number for the express server
const port = process.env.EXPRESS_PORT;

//Create mySQL Connection using data stored in .env file
let meNexus = mysql.createConnection({
    socketPath  : process.env.DB_SOCKETPATH,
    host        : process.env.DB_HOST,
    port        : process.env.DB_PORT,
    user        : process.env.DB_USER,
    password    : process.env.DB_PASSWORD,
    database    : process.env.DB_DATABASE
});

//Connect to mySQL
meNexus.connect((err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Connected to myNexus!");
    }
});


///////////////////////////////////////////Passportjs///////////////////////////////////////////

// Define a local authentication strategy
// TODO Update authentication strategy so that registration and login is functional
const User = require('./models/User');
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            // Find the user by their email
            const user = await User.getUserByEmail(email);

            // If the user doesn't exist, return an error
            if (!user) {
                return done(null, false, { message: 'Incorrect email or password' });
            }

            // Compare the provided password with the hashed password in the database
            console.log(".compare prefire...");
            console.log(user.password);
            console.log(password);
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(".compare FIRED!");

            // If the passwords don't match, return an error
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect email or password' });
            }

            // If the passwords match, return the user
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


// Serialize the user into a session
passport.serializeUser((user, done) => {
    done(null, user.email);
});

// Deserialize the user from a session
passport.deserializeUser(async (email, done) => {
    try {
        const user = await User.getUserByEmail(email);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

///////////////////////////////////////////API endpoints///////////////////////////////////////////

server.get('/ping', (req, res) => {
    console.log(req);
    res.send('Server is live.');
})

// API endpoint to create a user
server.post('/createUser', async (req, res) => {
    console.log('/createUser FIRED');
    try {
        const { email, password, handle, username } = req.body;

        // Check if the email is already used by another user
        const existingUserByEmail = await User.getUserByEmail(email);

        // If a user with the same email exists, return an error
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'Email is already taken' });
        }

        // Check if the handle is already used by another user
        const existingUserByHandle = await User.getUserByHandle(handle);

        // If a user with the same handle exists, return an error
        if (existingUserByHandle) {
            return res.status(400).json({ error: 'Handle is already taken' });
        }

        // Call the createUser function from the User model with 'username' parameter
        await User.createUser(email, password, handle, username);

        // Return a success response
        return res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
});


// Server call to handle login request
server.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Handle error
            return res.status(500).json({ error: 'An error occurred' });
        }
        if (!user) {
            // Authentication failed
            return res.status(401).json({ error: 'Incorrect email or password' });
        }
        // Log in the user
        req.login(user, (err) => {
            if (err) {
                // Handle error
                console.error(err);
                return res.status(500).json({ error: 'An error occurred' });
            }
            // Authentication successful
            return res.json({ message: 'Login successful' });
        });
    })(req, res, next);
});




//Server call that queries meNexus database for all user accounts
server.get('/getUsers', (req, res) => {
    let sql = 'SELECT * FROM Users';
    let query = meNexus.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            res.send(results);
        }
    })
});

// Server call that queries meNexus database for a profile from specified user_id
// TODO Calls to getProfile use a hardcoded URL to specify the user_id instead of using a variable
server.get('/getProfile/:handle', (req, res) => {
    const handle = req.params.handle;
    let sql = `
        SELECT Profiles.*, Users.username, Users.handle
        FROM Profiles
                 INNER JOIN Users ON Profiles.user_id = Users.user_id
        WHERE Users.handle = ?;

    `;
    meNexus.query(sql, [handle], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching user profile');
        } else {
            res.send(results);
        }
    });
});



//Server call that queries database for all posts from a specified user_id
//TODO Creating a request in Postman does not generate a URL that matches this style. Why?
server.get('/getUserPosts/:handle', (req, res) => {
    const handle = req.params.handle || req.query.handle;
    console.log(`GetPostsFired for ${handle}`)
    // SQL is performing an inner join on Posts and Users tables where post.user_id == users.user_id
    let sql = `
        SELECT Posts.*, Users.username, Users.handle
        FROM Posts
        INNER JOIN Users ON Posts.user_id = Users.user_id
        WHERE Users.handle = ?
    `;
    let query = meNexus.query(sql, [handle], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching user posts');
        } else {
            res.send(results);
        }
    });
});


// Server call to gather and render all posts from a friends lists tied to specified user_id
server.get('/getFriendsPosts/:userID', (req, res) => {
    const userID = req.params.userID;
})


// API endpoint for submitting a post
//TODO Write api call for submitting a post, below is barely above boilerplate
server.post("/submitPost", (req, res) => {
    const { text } = req.body;

    // Insert the post into the database
    const sql = "INSERT INTO Posts (content) VALUES (?)";
    meNexus.query(sql, [text], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to submit the post." });
        }

        // Return a success response
        return res.json({ message: "Post submitted successfully." });
    });
});





//Express server listening on port number specified
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
