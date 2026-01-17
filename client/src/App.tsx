import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./nav/Navbar";
import ExampleThemeUsage from "./components/ExampleThemeUsage";

function App() {
  return (
    <BrowserRouter>
      <Navbar>
        <Routes>
          <Route path="/" element={<ExampleThemeUsage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Navbar>
    </BrowserRouter>
  );
}

export default App;
