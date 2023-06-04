//Handling post request for email & password entered on login screen
server.post('/register', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { handle, username, email, password } = JSON.parse(body);
        let user = {
            handle: handle,
            username: username,
            email: email,
            password: password
        };
        //Checking if user with provided handle or email exist in database and preventing duplicate entries
        let checkUserExistsSql = `SELECT * FROM users WHERE handle = '${handle}' OR email = '${email}'`;
        social_database.query(checkUserExistsSql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Error checking if user exists" });
            }

            if (result.length > 0) {
                return res.status(400).send({ error: "User already exists with this handle or email" });
            }
            //If user does not already exist, create user in database
            let insertUserSql = 'INSERT INTO users SET ?';
            social_database.query(insertUserSql, user, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ error: "Error inserting user" });
                }
                res.send({ message: "Successfully registered new user." });
            });
        });
    });
});

//Handle login logic | testing credentials from database
server.post('/login', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { email, password } = JSON.parse(body);
        // Query the database to see if the provided email and password match any records in the users table
        let sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
        social_database.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: "Error checking login credentials" });
            }
            if (result.length > 0) {
                // The provided email and password match a record in the database
                req.session.user = { email };
                return res.send({ success: true, message: "LoginForm successful" });
            } else {
                // The provided email and password do not match any records in the database
                return res.status(401).send({ success: false, message: "Email or password is incorrect" });
            }
        });
    });
});
