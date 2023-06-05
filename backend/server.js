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


// Initialize session middleware
// Initialize session middleware
server.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
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
            console.log('Strategy User object: ', user);

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
    console.log('serializing: ', user);
    done(null, user);
});

passport.deserializeUser((email, done) => {
    User.getUserByEmail({ email: email }, (err, user) => {
        console.log('deserializing: ', user);
        done(err, user);
    });
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
// TODO I don't think the login is correctly serializing user data to the session
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

            console.log('req.user returns the following:')
            console.log(req.user);
            return res.json({ message: 'Login successful', handle: user.handle });
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

// Server call that queries meNexus database for a profile from specified handle
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



// Server call that queries meNexus session for current user object
// Middleware function to check session data
const checkSessionData = (req, res, next) => {
    console.log('Session Data:');
    console.log(req.session);
    next(); // Move to the next middleware or route handler
};

// Use the checkSessionData middleware
server.use(checkSessionData);

// Server call that queries meNexus session for current user object
server.get('/getCurrentUser', (req, res) => {
    const user = req.session.user;

    if (user && user.handle) {
        // Return the handle of the currently logged-in user
        res.json({ handle: user.handle });
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});


//Server call that queries database for all posts from a specified handle
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

// Server call to gather and render all posts from a friends lists tied to specified handle
// TODO Implement logic for this function as its just boilerplate
server.get('/getFriendsPosts/:handle', (req, res) => {
    const userID = req.params.handle;
})

// API endpoint for submitting a post
//TODO Write api call for submitting a post, below is barely above boilerplate
// API endpoint for submitting a post
server.post("/createPost", (req, res) => {
    const { content, handle } = req.body;

    // Fetch the user_id based on the handle
    const userSql = "SELECT user_id FROM Users WHERE handle = ?";
    meNexus.query(userSql, [handle], (userErr, userResult) => {
        if (userErr) {
            console.error(userErr);
            return res.status(500).json({ error: "Failed to fetch user data." });
        }

        if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user_id = userResult[0].user_id;

        // Insert the post into the database
        const postSql = "INSERT INTO Posts (content, user_id) VALUES (?, ?)";
        meNexus.query(postSql, [content, user_id], (postErr, postResult) => {
            if (postErr) {
                console.error(postErr);
                return res.status(500).json({ error: "Failed to submit the post." });
            }

            // Return a success response
            return res.json({ message: "Post submitted successfully." });
        });
    });
});

// Update an existing post
server.put("/updatePost/:postId", (req, res) => {
    const postId = req.params.postId;
    const updatedContent = req.body.content; // Assuming the updated content is sent in the request body

    // Update the post in your database
    const updateSql = "UPDATE Posts SET content = ? WHERE post_id = ?";
    meNexus.query(updateSql, [updatedContent, postId], (updateErr, updateResult) => {
        if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ error: "Failed to update the post." });
        }

        // Check if any rows were affected
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: "Post not found." });
        }

        // Return a success response
        return res.json({ message: "Post updated successfully." });
    });
});

// Api endpoint for deleting a post given a specified postId
server.delete("/deletePost/:post_id", (req, res) => {
    const postId = req.params.post_id;

    // Delete the post from the database
    const deleteSql = "DELETE FROM Posts WHERE post_id = ?";
    meNexus.query(deleteSql, [postId], (deleteErr, deleteResult) => {
        if (deleteErr) {
            console.error(deleteErr);
            return res.status(500).json({ error: "Failed to delete the post." });
        }

        // Check if any rows were affected
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: "Post not found." });
        }

        // Return a success response
        return res.json({ message: "Post deleted successfully." });
    });
});








//Express server listening on port number specified
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
