import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { slugs } from "../resources/strings/slugs";
import { verify } from "../api/user";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const setRecaptchaBadgeVisibility = (visible: boolean) => {
  const badge = document.querySelector(
    ".grecaptcha-badge",
  ) as HTMLElement | null;
  if (badge) badge.style.visibility = visible ? "visible" : "hidden";
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const { mutate: runVerify } = useMutation({
    mutationFn: () => verify(localStorage.getItem("token") ?? ""),
    onSuccess: (res) => {
      setIsAuthenticated(res.status === 200);
    },
    onError: () => {
      setIsAuthenticated(false);
    },
  });

  useEffect(() => {
    runVerify();
  }, [runVerify]);

  useEffect(() => {
    if (
      isAuthenticated &&
      (window.location.pathname === slugs.login ||
        window.location.pathname === slugs.register ||
        window.location.pathname === slugs.forgot)
    ) {
      navigate(slugs.dashboard);
    }
    setRecaptchaBadgeVisibility(!isAuthenticated);

    const observer = new MutationObserver(() =>
      setRecaptchaBadgeVisibility(!isAuthenticated),
    );
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isAuthenticated, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
