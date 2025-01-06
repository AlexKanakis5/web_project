# My App

This project is a full-stack application built with Express, React, and PostgreSQL. It includes user authentication with a login form that maintains user sessions until logout.

## Project Structure

```
my-app
├── backend
│   ├── controllers
│   │   └── authController.js
│   ├── models
│   │   └── userModel.js
│   ├── routes
│   │   └── authRoutes.js
│   ├── app.js
│   ├── config.js
│   └── package.json
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── components
│   │   │   └── LoginForm.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── package.json
└── README.md
```

## Backend Setup

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the database connection in `config.js`.
4. Start the server:
   ```
   node app.js
   ```

## Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

## Usage

- Access the application in your browser at `http://localhost:3000`.
- Use the login form to authenticate users. The session will persist until the user logs out.

## License

This project is licensed under the MIT License.