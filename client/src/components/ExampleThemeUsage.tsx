import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import { useThemeMode } from "../context/ThemeContext";
import { Lightbulb, Code, Palette } from "@mui/icons-material";

/**
 * Example component showing how to use the theme context
 */
function ExampleThemeUsage() {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Stack spacing={3}>
        {/* Example 1: Basic Theme Access */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${alpha(mode === "light" ? "#000" : "#fff", 0.08)}`,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Lightbulb sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Basic Theme Access
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" paragraph>
            Current mode:{" "}
            <Chip label={mode} size="small" color="primary" sx={{ ml: 1 }} />
          </Typography>

          <Button variant="contained" onClick={toggleTheme} sx={{ mt: 2 }}>
            Toggle to {mode === "light" ? "Dark" : "Light"} Mode
          </Button>
        </Paper>

        {/* Example 2: Using Theme Colors */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${alpha(mode === "light" ? "#000" : "#fff", 0.08)}`,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Palette sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Theme Colors in Action
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
                color: "#fff",
              }}
            >
              Primary Color: {theme.palette.primary.main}
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.secondary.main,
                color: "#fff",
              }}
            >
              Secondary Color: {theme.palette.secondary.main}
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.background.default,
                border: `1px solid ${alpha(mode === "light" ? "#000" : "#fff", 0.2)}`,
                color: theme.palette.text.primary,
              }}
            >
              Background: {theme.palette.background.default}
            </Box>
          </Stack>
        </Paper>

        {/* Example 3: Code Example */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${alpha(mode === "light" ? "#000" : "#fff", 0.08)}`,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Code sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Usage in Your Components
            </Typography>
          </Stack>

          <Box
            component="pre"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: mode === "light" ? "#f5f5f5" : "#0a0a0a",
              overflow: "auto",
              fontSize: "0.85rem",
              fontFamily: "monospace",
            }}
          >
            {`
import { useTheme } from '@mui/material';
import { useThemeMode } from '../context/ThemeContext';

function MyComponent() {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      Current mode: {mode}
      <Button onClick={toggleTheme}>Toggle</Button>
    </Box>
  );
}
            `}
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}

export default ExampleThemeUsage;
