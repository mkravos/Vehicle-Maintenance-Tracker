import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Login from './components/account/Login.js';
import Register from './components/account/Register.js';
import Settings from './components/settings/Settings.js';
import Dashboard from './components/dashboard/Dashboard.js';
import Garage from './components/garage/Garage.js';
import Error404 from './components/Error404.js';
import { verify } from './rest/userREST.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  // check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verify(token).then((res) => {
        console.log(res);
        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }).catch((err) => {
        console.log(err);
        setIsAuthenticated(false);
      });
    } else {
      console.log("No token found.");
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === false) {
    return (
      <Routes>
        <Route>
          <Route exact path="/login" element={<Login setAuth={setAuth} />} />
          <Route exact path="/register" element={<Register />} />
        </Route>
        <Route path="/" element={<Navigate to={"/login"} replace />} />
        <Route path="*" element={<Navigate to={"/login"} replace />} />
      </Routes>
    );
  } else if (isAuthenticated === true) {
    return (
      <Routes>
        <Route>
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/garage" element={<Garage />} />
          <Route exact path="/settings" element={<Settings setAuth={setAuth} />} />
        </Route>
        <Route path="/login" element={<Navigate to={"/dashboard"} replace />} />
        <Route path="/register" element={<Navigate to={"/dashboard"} replace />} />
        <Route path="/" element={<Navigate to={"/dashboard"} replace />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Loading...</p>
      </header>
    </div>
  );
}

export default App;