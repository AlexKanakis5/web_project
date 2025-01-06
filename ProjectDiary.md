# Project Diary - [31/12/2024]

Tasks Completed:
1. Project Setup:

<li> Created the project directory structure for the backend and frontend.
<li>Initialized the backend with Express and the frontend with Create React App.
<li>Installed necessary dependencies for both backend and frontend.

2. Backend Configuration:

<li> Set up the PostgreSQL database connection using pg and connect-pg-simple.
<li>Created a config.js file to manage the database connection pool.
<li>Configured session management using express-session and connect-pg-simple.

3. Database Setup:

<li>Created the users table in PostgreSQL with the following columns:
id, username, password, user_type, am, phone, email, address.
<li>Created a session table to store session data.

4. User Model:

<li>Created a userModel.js file to interact with the users table.
<li>Implemented the findByUsername method to fetch user data by username.

5. Authentication Controller:

<li>Created an authController.js file to handle login and logout functionality.
<li>Implemented the login method to authenticate users using bcrypt for password comparison.
<li>Implemented the logout method to destroy the user session.

6. Routes Setup:

<li>Created an authRoutes.js file to define the login and logout routes.
<li>Integrated the routes into the Express app in app.js.

7. Frontend Configuration:

<li>Set up the React frontend with a basic login form component.
<li>Implemented the handleSubmit function to send login requests to the backend.
<li>Handled successful login by storing user data in local storage.


03 / 01 / 2025


1. User Update Functionality:

<li>Created a new UpdateUser component to allow users to update their password, address, and phone number.
<li>Implemented a form in the UpdateUser component that requires the current password before allowing updates.
<li>Created a backend endpoint to handle user updates and ensure only authenticated users can update their information.

