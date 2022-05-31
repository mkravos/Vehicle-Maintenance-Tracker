import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import './App.css';
import Login from './components/account/Login.js';
import Register from './components/account/Register.js';
import Account from './components/account/Account.js';
import Dashboard from './components/dashboard/Dashboard.js';
import Garage from './components/garage/Garage.js';

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
      console.error(err.message);
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

  return (
    <Routes>
      <Route exact path="/" element={<Login setAuth={setAuth}/>}/>
      <Route exact path="/register" element={<Register/>}/>
      <Route element={<ProtectedRoute/>}>
        <Route exact path="/dashboard" element={<Dashboard/>}/>
        <Route exact path="/garage" element={<Garage/>}/>
        <Route exact path="/account" element={<Account/>}/>
      </Route>
      <Route path="*" element={<p className="e404">404: There's nothing here!</p>}/>
    </Routes>
  );
}

export default App;