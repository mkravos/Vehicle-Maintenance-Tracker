import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./nav/Navbar";
import ExampleThemeUsage from "./components/ExampleThemeUsage";
import { slugs } from "./resources/strings/slugs";

type PrivateRouteProps = {
  auth: {
    isAuthenticated: boolean;
  };
  children: React.ReactNode;
};

const PrivateRoute = (props: PrivateRouteProps) => {
  const {
    auth: { isAuthenticated },
    children,
  } = props;

  return isAuthenticated ? (
    <Navbar>{children}</Navbar>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path={slugs.catchall}
          element={<Navigate to={slugs.root} replace />}
        />
        <Route
          path={slugs.root}
          element={<Navigate to={slugs.dashboard} replace />}
        />
        <Route path={slugs.login} element={<div>Login Page</div>} />
        <Route path={slugs.register} element={<div>Register Page</div>} />

        {/* Private */}
        <Route
          path={slugs.dashboard}
          element={
            <PrivateRoute auth={{ isAuthenticated }}>
              <ExampleThemeUsage />
            </PrivateRoute>
          }
        />
        <Route
          path={slugs.garage}
          element={
            <PrivateRoute auth={{ isAuthenticated }}>
              <div>Garage Page</div>
            </PrivateRoute>
          }
        />
        <Route
          path={slugs.profile}
          element={
            <PrivateRoute auth={{ isAuthenticated }}>
              <div>Profile Page</div>
            </PrivateRoute>
          }
        />
        <Route
          path={slugs.settings}
          element={
            <PrivateRoute auth={{ isAuthenticated }}>
              <div>Settings Page</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
