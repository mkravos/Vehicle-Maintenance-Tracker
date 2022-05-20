import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Garage from './components/Garage';

function App() {
  return (
      <body>
        <Routes>
          <Route exact path="/" element={<Login/>}></Route>
          <Route exact path="/register" element={<Register/>}></Route>
          <Route exact path="/dashboard" element={<Dashboard/>}></Route>
          <Route exact path="/garage" element={<Garage/>}></Route>
        </Routes>
      </body>
  );
}

export default App;