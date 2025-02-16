import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import StudentPage from './components/StudentPage';
import ProfessorPage from './components/ProfessorPage';
import StatisticsPage from './components/StatisticsPage';
import NavBar from './components/NavBar';
import UpdateUser from './components/UpdateUser';
import CreateDiploma from './components/CreateDiploma';
import InvitesPage from './components/InvitesPage';
import DiplomaFilesPage from './components/DiplomaFilesPage';
import './components/NavBar.css';
import SecretaryPage from './components/SecretaryPage';
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Get user from local storage
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('User is logged in:', user);
    }
  }, [user]);

  return (
    // Router is used to define the routes of the application
    <Router> 
      <div>
        <NavBar user={user} setUser={setUser} />
        <Switch>
          <Route path="/" exact>
            {user && user.user_type === 'student' ? (
              <StudentPage user={user} />
            ) : user && user.user_type === 'professor' ? (
              <ProfessorPage user={user} />
            ) : user && user.user_type === 'secretary' ? (
              <SecretaryPage user={user} />
            ) : (
              <HomePage />
            )}
          </Route>
          <Route path="/login">
            {/* if the user is already logged in redirect to root */}
            {user ? <Redirect to="/" /> : <LoginForm setUser={setUser} />}
          </Route>
          <Route path="/update">
            {user ? <UpdateUser user={user} setUser={setUser} /> : <Redirect to="/login" />}
          </Route>
          <Route path="/create-diploma">
            {/* if the user is a not loged in or a professor redirect to login */}
            {user && user.user_type === 'professor' ? <CreateDiploma user={user} /> : <Redirect to="/login" />} 
          </Route>
          <Route path="/invites">
            {user ? <InvitesPage user={user} /> : <Redirect to="/login" />}
          </Route>
          <Route path="/diplomas/:id/files">
            {user ? <DiplomaFilesPage user={user} /> : <Redirect to="/login" />}
          </Route>
          <Route path="/statistics">
            {user && user.user_type === 'professor' ? <StatisticsPage user={user} /> : <Redirect to="/login" />}
          </Route>
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;