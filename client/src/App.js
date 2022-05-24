import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import Login from './components/account/Login.js';
import Register from './components/account/Register.js';
import Account from './components/account/Account.js';
import Dashboard from './components/dashboard/Dashboard.js';
import Garage from './components/garage/Garage.js';

function App() {
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