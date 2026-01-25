import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  PaletteMode,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<PaletteMode>(() => {
    // Get saved preference from localStorage or default to light
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode as PaletteMode) || "light";
  });

  useEffect(() => {
    // Save preference to localStorage whenever it changes
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // Light mode colors
                primary: {
                  main: "#667eea",
                  light: "#818cf8",
                  dark: "#5a67d8",
                },
                secondary: {
                  main: "#764ba2",
                  light: "#9061c2",
                  dark: "#5e3c82",
                },
                background: {
                  default: "#f8f9fa",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#1a1a1a",
                  secondary: alpha("#000000", 0.6),
                },
              }
            : {
                // Dark mode colors
                primary: {
                  main: "#818cf8",
                  light: "#a5b4fc",
                  dark: "#667eea",
                },
                secondary: {
                  main: "#9061c2",
                  light: "#b794d4",
                  dark: "#764ba2",
                },
                background: {
                  default: "#0f0f0f",
                  paper: "#1a1a1a",
                },
                text: {
                  primary: "#ffffff",
                  secondary: alpha("#ffffff", 0.7),
                },
              }),
        },
        typography: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          h1: {
            fontWeight: 700,
            letterSpacing: "-1.5px",
          },
          h2: {
            fontWeight: 700,
            letterSpacing: "-1px",
          },
          h3: {
            fontWeight: 700,
            letterSpacing: "-0.5px",
          },
          h4: {
            fontWeight: 600,
            letterSpacing: "-0.5px",
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
          button: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: "10px 24px",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
        },
      }),
    [mode],
  );

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
