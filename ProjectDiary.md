# Project Diary 
# Tasks Completed:

# 31 / 12 / 2024
## 1. Project Setup:

<li> Created the project directory structure for the backend and frontend.
<li>Initialized the backend with Express and the frontend with Create React App.
<li>Installed necessary dependencies for both backend and frontend.

## 2. Backend Configuration:

<li> Set up the PostgreSQL database connection using pg and connect-pg-simple.
<li>Created a config.js file to manage the database connection pool.
<li>Configured session management using express-session and connect-pg-simple.

## 3. Database Setup:

<li>Created the users table in PostgreSQL with the following columns:
id, username, password, user_type, am, phone, email, address.
<li>Created a session table to store session data.

## 4. User Model:

<li>Created a userModel.js file to interact with the users table.
<li>Implemented the findByUsername method to fetch user data by username.

## 5. Authentication Controller:

<li>Created an authController.js file to handle login and logout functionality.
<li>Implemented the login method to authenticate users using bcrypt for password comparison.
<li>Implemented the logout method to destroy the user session.

##  6. Routes Setup:

<li>Created an authRoutes.js file to define the login and logout routes.
<li>Integrated the routes into the Express app in app.js.

## 7. Frontend Configuration:

<li>Set up the React frontend with a basic login form component.
<li>Implemented the handleSubmit function to send login requests to the backend.
<li>Handled successful login by storing user data in local storage.


# 03 / 01 / 2025


##  1. User Update Functionality:

<li>Created a new UpdateUser component to allow users to update their password, address, and phone number.
<li>Implemented a form in the UpdateUser component that requires the current password before allowing updates.
<li>Created a backend endpoint to handle user updates and ensure only authenticated users can update their information.



# 06 / 01 / 2025

## 1. Added a creation page for new diplomas for each professor 

<li>The professor should be able to create a new diploma with a title and a short description
<li>Each user should be able to view all the diplomas that concern them

## 2. Added invite system 

<li>The professor should be able to invite students for the diploma 
<li>The student should be able to invite 2nd and 3rd professor 
<li>Each user should be able to view the invites and toggle "accepted" or "declined" from the view page 
<li>Each user should be able to view the invites they have sent

## 3. Added a pdf upload system

<li>Added a button for each diploma that when pressed will upload a pdf file
<li>Only the users that are concerned should have access to the pdf files
<li>Added a page that the user can view and download all the pdf files 

## <b>Next steps: 

<li>Add a user page - <b>DONE
<li>Check the functionality where the student can select 2nd and 3rd professor. Can they add more? Does the invite dissapear when the professors have accepted? - <b>DONE????
<li>Delete the invite if user declines (later in order to test invite system) <b>PENDING 
<li>Student accepts invites but diploma isn't added <b>PENDING
<li>Mobile site login press does nothing <b>PENDING
<li>Add the option for the prof to grade a diploma


# 07 / 01 / 2025

## 1. Implemented Filtering On professor page 

<li> Professor can filter diplomas based on status (pending, finished, cancelled) and their role(main/ second/ third prof).

## 2. Added Statistics page

<li> Added a statistics page for the professor implemented with chartjs. It doesn't do what I want it to because I haven't decided the stats it should show