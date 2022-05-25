import React, { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import Login from './components/account/Login.js';
import Register from './components/account/Register.js';
import Account from './components/account/Account.js';
import Dashboard from './components/dashboard/Dashboard.js';
import Garage from './components/garage/Garage.js';

function App() {
  const checkAuthenticated = async () => {
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
    checkAuthenticated();
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route exact path="/" element={<Login/>}></Route>
      <Route exact path="/dashboard" element={<Dashboard/>}></Route>
      <Route exact path="/garage" element={<Garage/>}></Route>
      <Route exact path="/account" element={<Account/>}></Route>
      <Route exact path="/register" element={<Register/>}></Route>
    </Routes>
  );
}

export default App;