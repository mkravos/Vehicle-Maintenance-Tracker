import React from 'react';
import './App.css';
import BootstrapNavbar from './components/BootstrapNavbar.js';

function App() {
  return (
    <div className="App">
      <BootstrapNavbar></BootstrapNavbar>
      <header className="App-header">
        <p>Vehicle Maintenance Tracker</p>
      </header>
    </div>
  );
}

export default App;