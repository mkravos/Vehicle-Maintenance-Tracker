import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import './App.css';
import Login from './components/account/Login.js';
import Register from './components/account/Register.js';
import Account from './components/account/Account.js';
import Dashboard from './components/dashboard/Dashboard.js';
import Garage from './components/garage/Garage.js';
import Error404 from './components/Error404.js';

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
  console.log(isAuthenticated);

  const ProtectedRoute = (isAuthenticated) => { // issue here: not redirecting after login
    if (!isAuthenticated) {
      console.log("not authenticated");
      return <Navigate to={"/"} replace />;
    } else {
      console.log("authenticated");
      return <Outlet/>;
    }
  };

  return (
    <Routes>
      <Route exact path="/" element={<Login setAuth={setAuth}/>}/>
      <Route exact path="/register" element={<Register/>}/>
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated}/>}>
        <Route exact path="/dashboard" element={<Dashboard/>}/>
        <Route exact path="/garage" element={<Garage/>}/>
        <Route exact path="/account" element={<Account/>}/>
      </Route>
      <Route path="*" element={<Error404/>}/>
    </Routes>
  );
}

export default App;