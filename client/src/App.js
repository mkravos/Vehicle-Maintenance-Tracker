import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Login from './components/account/Login.js';
import Register from './components/account/Register.js';
import Account from './components/account/Account.js';
import Dashboard from './components/dashboard/Dashboard.js';
import Garage from './components/garage/Garage.js';
import ViewServiceRecords from './components/garage/ViewServiceRecords.js';
import Error404 from './components/Error404.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState();

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  // check if user is authenticated
  const isAuth = async () => {
    try {
      const res = await fetch("http://localhost:1234/verify", {
        method: "GET",
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.text();
      parseRes === 'true' ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      if(err.message === "Unexpected token U in JSON at position 0") {
        return; // user has not made a login attempt, ignore the console error.
      } else {
        console.error(err.message);
      }
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  if (isAuthenticated === false) {
    return (
      <Routes>
        <Route>
          <Route exact path="/login" element={<Login setAuth={setAuth}/>}/>
          <Route exact path="/register" element={<Register/>}/>
        </Route>
        <Route path="/" element={<Navigate to={"/login"} replace />}/>
        <Route path="*" element={<Navigate to={"/login"} replace />}/>
      </Routes>
    );
  }
  if (isAuthenticated === true) {
    return (
      <Routes>
        <Route>
          <Route exact path="/dashboard" element={<Dashboard/>}/>
          <Route exact path="/garage" element={<Garage/>}/>
          <Route exact path="/service-records" element={<ViewServiceRecords/>}/>
          <Route exact path="/account" element={<Account setAuth={setAuth}/>}/>
        </Route>
        <Route path="/login" element={<Navigate to={"/dashboard"} replace />}/>
        <Route path="/register" element={<Navigate to={"/dashboard"} replace />}/>
        <Route path="/" element={<Navigate to={"/dashboard"} replace />}/>
        <Route path="*" element={<Error404/>}/>
      </Routes>
    );
  }
}

export default App;