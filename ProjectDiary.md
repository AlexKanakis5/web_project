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



# 07 / 01 / 2025

## 1. Implemented Filtering On professor page 

<li> Professor can filter diplomas based on status (pending, finished, cancelled) and their role(main/ second/ third prof).

## 2. Added Statistics page

<li> Added a statistics page for the professor implemented with chartjs. It doesn't do what I want it to because I haven't decided the stats it should show



# 08 / 01 / 2025

## 1. Updated Statistics page

<li>Now stats page displays 1. Average time to Complete per Year 2. Average Grade per Year 3. Correlation between time and grade


# 10 / 01 / 2025

## 1. Added option to grade diplomas

<li>Professor should be able to add a grade for a diploma
<li>Only pending diplomas can be graded

## 2. Fixed invite system

<li>Student can accept invite
<li>Student can invite 2nd/3rd professor
<li>Professors can accept invites
<li>When invite is accepted diploma is added to the main page 

## 3. Added upload pdf file for student

<li>Student can now upload pdf files for each diploma that they are concerned
<li>Also added it back to professor 

## Next steps: 

<li><b><em>PENDING</em></b> Delete the invite if user declines (later in order to test invite system) 
<li><b><em>PENDING</em></b> Fix all css If I see anything i will fix 
<li><b><em>PENDING</em></b> When filter by main/third prof and pending, nothing shows Possible reason 'P'ending -> 'p'ending THIS IS THE REASON 
<li><b><em>PENDING</em></b> Comments Comments Comments

<li><em><b>DONE</em></b> Mobile site login press does nothing - problem with cors I ignore IDGAF
<li><em><b>DONE</em></b> Check the functionality where the student can select 2nd and 3rd professor. Can they add more? Does the invite dissapear when the professors have accepted?
<li><em><b>DONE</em></b> Student accepts invites but diploma isn't added 
<li><em><b>DONE</em></b> Add the option for the prof to grade a diploma. Maybe add a grade column for each teacher grade and then the faculty can set it to finished with the chosen grade 
<li><em><b>DONE</em></b> Add delete button for each diploma, on the professors page DONE -> Moved to secretary 
<li><em><b>DONE</em></b> Professor cant grade newly created diplomas DONE (when creating new diplomas "pending" was uppercase -> "Pending")

<li><em><b>???</em></b> DOCUMENT FOLDER NUMBER DOES NOTHING but I am afraid to remove it or drop column from database,please be lenient  <b>???</b>

# 11 / 01 / 2025

## 1. Added Secretary page

<li>Added new user to users table with user_type of secretary
<li>Secretary user gets directed to secretary page upon login
<li>They can view all pending diplomas 

## 2. Cancell Diplomas

<li>Secretary can press a button to cancell any diplomas
<li>A text file is uploaded to the diploma folder that contains the details of the cancellation 

## 3. Finish Diplomas

<li>Secretary can press a button to set diploma status to finished
<li>Button only shows when all three professors have graded the diploma
<li>The final grade will be set to the average of the three 

### 4. Fixed file upload

<li>IDK what happened

### 5. Hid navbar buttons from secretary 

<li>Hid view invites and update info from secretary


# 26 / 01 / 2025

### 1. Change DB query on the statistics page avoid NULL

<li>Added a condition of year not null to the DB query because some diplomas where finished with no finished date 


