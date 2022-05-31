import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import './App.css';
import Login from './components/account/Login.js';
import Register from './components/account/Register.js';
import Account from './components/account/Account.js';
import Dashboard from './components/dashboard/Dashboard.js';
import Garage from './components/garage/Garage.js';
import Error404 from './components/Error404.js';

// protected routes: https://www.robinwieruch.de/react-router-private-routes/#:~:text=Private%20Routes%20in%20React%20Router,page%2C%20they%20cannot%20access%20it.

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  // check if user is authenticated
  const isAuth = async () => {
    try {
      const res = await fetch("http://localhost:1234/", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
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

  const ProtectedRoute = () => {
    if (!isAuthenticated) {
      return <Navigate to={"/"} replace />;
    } else {
      return <Outlet/>;
    }
  };

  const AuthenticationRoute = () => {
    if (isAuthenticated) {
      return <Navigate to={"/dashboard"} replace />;
    } else {
      return <Outlet/>;
    }
  }

  return (
    <Routes>
      <Route element={<AuthenticationRoute/>}>
        <Route exact path="/" element={<Login setAuth={setAuth}/>}/>
        <Route exact path="/register" element={<Register/>}/>
      </Route>
      <Route element={<ProtectedRoute/>}>
        <Route exact path="/dashboard" element={<Dashboard/>}/>
        <Route exact path="/garage" element={<Garage/>}/>
        <Route exact path="/account" element={<Account setAuth={setAuth}/>}/>
      </Route>
      <Route path="*" element={<Error404/>}/>
    </Routes>
  );
}

export default App;