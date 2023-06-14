# meNexus

This is a social networking app built with Node.js, Express, mySQL, and React.

## Getting Started

To get started with the app, clone the repository and install the dependencies. 
Please note that both `/backend` and `/frontend` have their own package json files for dependencies.
###

$ `git clone https://github.com/JacobWileyRoss/meNexus.git`

$ `cd meNexus/backend`

$ `npm install`

$ `cd meNexus/frontend`

$ `npm install`
###

Create a `.env` file in `meNexus/backend` and configure the required environment variables:

`DB_HOST=<database-host>`

`DB_PORT=<database-port>`

`DB_USER=<database-username>`

`DB_PASSWORD=<database-password>`

`DB_DATABASE=<database-name>`

`EXPRESS_PORT=<express-server-port>`


Replace `<database-host>`, `<database-port>`, `<database-username>`, `<database-password>`, `<database-name>`, 
and `<express-server-port>` with your own values that reflect your local environment.
###
You will then want to run the provided mySQL schema script located in `meNexus/database` to create the database 
expected by the app. This will also create a sample user profile that can be accessed at `http://localhost:<express-server-port>/profile/jacob`

## Running the App

Start the Express server by running the following commands:

$ `cd meNexus/backend`

$ `nodemon server.js`

$ `cd meNexus/frontend`

$ `npm start`

###
You can then access the app at `http://localhost:<express-server-port>/register` in your web browser.
####
After reaching the register page of the app, you can create a new user. After registering a new user, 
you will be redirected to log in. After successful login, you will be redirected to the new user's profile. 
This will be an empty page where you can create your first post. Currently, there is a known issue where 
you have to manually refresh the page after submitting a new post for it to be displayed. As of 6/13, the 
functionality to create the user profile has not been built. You can manually enter data in the Profiles 
table of the database for full name/bio/location and a URL to a profile picture. Once the data has been 
entered into the database, refreshing the page should render the user's profile. Alternatively, accessing 
`http://localhost:<express-server-port>/profile/jacob` should render a sample profile page.

## API Endpoints

The app provides the following API endpoints:

- `GET /ping`: Returns a message indicating that the server is live.
- `POST /createUser`: Creates a new user account.
- `POST /login`: Authenticates a user and logs them in.
- `GET /getUsers`: Retrieves all user accounts from the database.
- `GET /getProfile/:handle`: Retrieves a user profile based on the provided handle.
- `GET /getCurrentUser`: Retrieves the currently logged-in user.
- `GET /getUserPosts/:handle`: Retrieves all posts from a user based on the provided handle.
- `POST /createPost`: Submits a new post.
- `PUT /updatePost/:postId`: Updates an existing post.
- `DELETE /deletePost/:post_id`: Deletes a post.

## Frontend

The frontend of the app is built with React. You can find the React components in the `frontend/src/components` directory of the project.

## Dependencies

The app uses the following dependencies:

- `express`: Web framework for Node.js.
- `express-session`: Session middleware for Express.
- `body-parser`: Middleware for parsing JSON request bodies.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- `morgan`: HTTP request logger middleware.
- `mysql`: MySQL database driver.
- `dotenv`: Loads environment variables from a `.env` file.
- `passport`: Authentication middleware for Node.js.
- `passport-local`: Local authentication strategy for Passport.
- `bcrypt`: Library for hashing passwords.


