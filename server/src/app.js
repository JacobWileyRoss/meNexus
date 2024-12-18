// Imports
const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql2');
require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

//Instantiate Express app
const app = express()
app.use(cors({
    origin: 'http://localhost:5173', // client's origin
    credentials: true, // Allow credentials (cookies) to be sent
}));

app.use(morgan('combined'));

app.use(express.json());

// Initialize session middleware
app.use(session({
    // TODO replace with a secure, random session secret
    secret: 'your-secret-key', // Replace with a secure key
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true only if using HTTPS
        sameSite: 'Lax', // Allow cross-origin requests
    },
}));

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log('Middleware Debugging');
    console.log('Cookies:', req.headers.cookie);
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    console.log('Session Store:', req.sessionStore);
    req.sessionStore.all((err, sessions) => {
        console.log('All Sessions:', sessions);
    });
    next();
});

// Middleware function to check session data
const checkSessionData = (req, res, next) => {
    console.log('Session Data:');
    console.log(req.session);
    next(); // Move to the next middleware or route handler
};

// Use the checkSessionData middleware
app.use(checkSessionData);

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
const User = require('./models/user');
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            // Fetch user and authentication details by email
            const auth = await User.getAuthByEmail(email);

            if (!auth) {
                return done(null, false, { message: 'Incorrect email or password' });
            }

            // Verify the password
            const isMatch = await bcrypt.compare(password, auth.hashed_password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect email or password' });
            }

            // Fetch user details from Users table
            const user = await User.getUserById(auth.user_id);
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            // Merge user and authentication data
            const completeUser = {
                user_id: user.user_id,
                handle: user.handle,
                display_name: user.display_name,
                email: auth.email,
            };

            return done(null, completeUser);
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.user_id); // Use user_id as the identifier
});

// Deserialize user from session
passport.deserializeUser(async (user_id, done) => {
    try {
        // Fetch user details
        const user = await User.getUserById(user_id);
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error, null);
    }
});


///////////////////////////////////////////API endpoints///////////////////////////////////////////

// API endpoint to ensure server is running
app.get('/ping', (req, res) => {
    console.log(req);
    res.send('Server is live.');
})

// API endpoint to create a user
app.post('/createUser', async (req, res) => {
    console.log('/createUser FIRED');
    try {
        const { email, password, handle, display_name } = req.body;
        console.log("Received data:", { email, password, handle, display_name });

        // Validate required fields
        if (!email || !password || !handle || !display_name) {
            console.log("Missing required fields.");
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the email is already used by another user
        const existingUserByEmail = await User.getUserByEmail(email);
        console.log("Existing user by email:", existingUserByEmail);

        if (existingUserByEmail) {
            console.log("Email is already taken.");
            return res.status(400).json({ error: 'Email is already taken' });
        }

        // Check if the handle is already used by another user
        const existingUserByHandle = await User.getUserByHandle(handle);
        console.log("Existing user by handle:", existingUserByHandle);

        if (existingUserByHandle) {
            console.log("Handle is already taken.");
            return res.status(400).json({ error: 'Handle is already taken' });
        }

        // Call the createUser function from the User model
        const newUserId = await User.createUser(email, password, handle, display_name);
        console.log("New user created with ID:", newUserId);

        // Return a success response
        return res.status(201).json({ message: 'User created successfully', user_id: newUserId });
    } catch (error) {
        console.error("Error in /createUser:", error.message);
        return res.status(500).json({ error: 'Failed to create user' });
    }
});

// API endpoint to update password
app.put('/updatePassword', async (req, res) => {
    const { user_id, newPassword } = req.body;
    if (!user_id || !newPassword) {
        return res.status(400).json({ error: "User ID and new password are required" });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the Authentication table
        const sql = 'UPDATE Authentication SET hashed_password = ? WHERE user_id = ?';
        meNexus.query(sql, [hashedPassword, user_id], (err, result) => {
            if (err) {
                console.error("Error updating password:", err);
                return res.status(500).json({ error: "Error updating password" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            console.log("Password updated successfully for user:", user_id);
            res.json({ message: "Password updated successfully" });
        });
    } catch (error) {
        console.error("Error updating password:", error.message);
        res.status(500).json({ error: "Error updating password" });
    }
});

// API endpoint to handle login request
app.post('/login', (req, res, next) => {
    console.log('/login called');
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Handle error
            console.error('Error during login authentication:', err);
            return res.status(500).json({ error: 'An error occurred during login' });
        }
        if (!user) {
            // Authentication failed
            return res.status(401).json({ error: info ? info.message : 'Incorrect email or password' });
        }
        // Log in the user
        req.login(user, (err) => {
            if (err) {
                // Handle error
                console.error('Error during session login:', err);
                return res.status(500).json({ error: 'Failed to log in' });
            }
            // Authentication successful, attach session data
            req.session.user = {
                user_id: user.user_id,
                handle: user.handle,
                display_name: user.display_name,
            };
            console.log('Session Data:', req.session.user);

            return res.json({
                message: 'Login successful',
                handle: user.handle,
                display_name: user.display_name,
            });
        });
    })(req, res, next);
});

// API endpoint to handle logout request and destroy session
app.post('/logout', (req, res) => {
    console.log('/logout called');
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }

        req.session.destroy((destroyErr) => {
            if (destroyErr) {
                console.error('Error destroying session:', destroyErr);
                return res.status(500).json({ error: 'Failed to destroy session' });
            }

            // Clear the session cookie
            res.clearCookie('connect.sid', { path: '/' });
            console.log('User successfully logged out and session cleared.');
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});

// API endpoint that queries meNexus database for all user accounts
app.get('/getUsers', (req, res) => {
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

// API endpoint to fetch a user's profile by handle
app.get('/getProfile/:handle', (req, res) => {
    const handle = req.params.handle;

    const sql = `
        SELECT
            Profiles.profile_name,
            Profiles.profile_bio,
            Profiles.profile_location,
            Profiles.profile_picture,
            Profiles.profile_banner,
            Profiles.custom_css,
            Users.display_name,
            Users.handle
        FROM Profiles
                 INNER JOIN Users ON Profiles.user_id = Users.user_id
        WHERE Users.handle = ?;
    `;

    meNexus.query(sql, [handle], (err, results) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            res.status(500).json({ error: 'Error fetching user profile' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Profile not found' });
        } else {
            res.json(results[0]); // Send the first (and only) result
        }
    });
});

// API endpoint to fetch the current user from the session
app.get('/getCurrentUser', (req, res) => {
    console.log('getCurrentUser called');
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);

    if (req.session && req.session.user) {
        const { user_id, handle, display_name } = req.session.user;

        // Ensure the session data contains all necessary fields
        if (!user_id || !handle || !display_name) {
            console.error('Incomplete session data');
            return res.status(400).json({ error: 'Incomplete session data' });
        }

        // Send the user data stored in the session
        console.log('User found in session:', req.session.user);
        return res.json({
            user_id,
            handle,
            display_name
        });
    } else {
        console.log('User not authenticated');
        return res.status(401).json({ error: 'User not authenticated' });
    }
});

// API endpoint that queries database for all posts from a specified handle
app.get('/getUserPosts/:handle', (req, res) => {
    const handle = req.params.handle || req.query.handle;
    console.log(`GetPostsFired for ${handle}`)
    // SQL is performing an inner join on Posts and Users tables where post.user_id == users.user_id
    let sql = `
        SELECT Posts.*, Users.display_name, Users.handle
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

// API endpoint for submitting a post
app.post("/createPost", (req, res) => {
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

// API endpoint to update a post
app.put("/updatePost/:postId", (req, res) => {
    const postId = req.params.postId;
    const updatedContent = req.body.content;
    // Update the post in database
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
app.delete("/deletePost/:post_id", (req, res) => {
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
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})