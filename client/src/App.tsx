import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./nav/Navbar";
import ExampleThemeUsage from "./components/ExampleThemeUsage";
import { slugs } from "./resources/strings/slugs";
import Login from "./components/login/login";
import Register from "./components/login/register";

const RECAPTCHA_SITE_KEY = "6Lfl2C8sAAAAAP__IBKBC-Vq7tRkgl5LBpk_EZYZ";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navbar>{children}</Navbar>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY} useEnterprise>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
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
              <Route path={slugs.login} element={<Login />} />
              <Route path={slugs.register} element={<Register />} />
              <Route
                path={slugs.forgot}
                element={<div>Forgot Password Page: TODO</div>}
              />
              {/* Private */}
              <Route
                path={slugs.dashboard}
                element={
                  <PrivateRoute>
                    <ExampleThemeUsage />
                  </PrivateRoute>
                }
              />
              <Route
                path={slugs.garage}
                element={
                  <PrivateRoute>
                    <div>Garage Page</div>
                  </PrivateRoute>
                }
              />
              <Route
                path={slugs.profile}
                element={
                  <PrivateRoute>
                    <div>Profile Page</div>
                  </PrivateRoute>
                }
              />
              <Route
                path={slugs.settings}
                element={
                  <PrivateRoute>
                    <div>Settings Page</div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleReCaptchaProvider>
  );
}

export default App;
