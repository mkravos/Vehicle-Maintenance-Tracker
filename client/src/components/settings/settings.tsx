import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import {
  ManageAccounts as ManageAccountsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Share as ShareIcon,
  Tune as TuneIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useThemeMode } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { slugs } from "../../resources/strings/slugs";

interface SettingsSection {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
  available: boolean;
}

const sections: SettingsSection[] = [
  {
    key: "account",
    title: "Account Settings",
    description: "Manage your profile, email address, and password.",
    icon: <ManageAccountsIcon />,
    path: slugs.settingsAccount,
    available: true,
  },
  {
    key: "notifications",
    title: "Notifications",
    description: "Choose what reminders and alerts you receive.",
    icon: <NotificationsIcon />,
    path: slugs.settingsNotifications,
    available: false,
  },
  {
    key: "security",
    title: "Security",
    description: "Two-factor authentication and active sessions.",
    icon: <SecurityIcon />,
    path: slugs.settingsSecurity,
    available: false,
  },
  {
    key: "sharing",
    title: "Sharing",
    description: "Share vehicles and maintenance records with other accounts.",
    icon: <ShareIcon />,
    path: slugs.settingsSharing,
    available: false,
  },
  {
    key: "preferences",
    title: "Preferences",
    description: "Theme, units, and other display preferences.",
    icon: <TuneIcon />,
    path: slugs.settingsPreferences,
    available: false,
  },
];

export default function Settings() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const navigate = useNavigate();

  const borderColor = alpha(mode === "light" ? "#000" : "#fff", 0.08);

  const handleSelect = (section: SettingsSection) => {
    if (section.available && section.path) {
      navigate(section.path);
    }
  };

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
        >
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account and customize how Garage works for you.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
        }}
      >
        {sections.map((section) => {
          const clickable = section.available;

          return (
            <Paper
              key={section.key}
              elevation={0}
              onClick={() => handleSelect(section)}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${borderColor}`,
                cursor: clickable ? "pointer" : "default",
                opacity: clickable ? 1 : 0.6,
                transition: "all 0.2s ease-in-out",
                "&:hover": clickable
                  ? {
                      transform: "translateY(-4px)",
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      boxShadow:
                        mode === "light"
                          ? "0 8px 32px rgba(0,0,0,0.08)"
                          : "0 8px 32px rgba(0,0,0,0.3)",
                      "& .settings-section-icon": {
                        bgcolor: alpha(theme.palette.primary.main, 0.18),
                      },
                      "& .settings-section-chevron": {
                        transform: "translateX(4px)",
                        color: theme.palette.primary.main,
                      },
                    }
                  : {},
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  className="settings-section-icon"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    borderRadius: 2.5,
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {section.icon}
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                    {!section.available && (
                      <Chip
                        label="Coming soon"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          bgcolor: alpha(
                            mode === "light" ? "#000" : "#fff",
                            0.06,
                          ),
                        }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </Box>

                {clickable && (
                  <ChevronRightIcon
                    className="settings-section-chevron"
                    sx={{
                      color: alpha(mode === "light" ? "#000" : "#fff", 0.4),
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                )}
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
