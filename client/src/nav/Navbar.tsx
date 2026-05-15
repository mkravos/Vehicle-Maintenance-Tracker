import React, { useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  CssBaseline,
  alpha,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useThemeMode } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { slugs } from "../resources/strings/slugs";
import { logout } from "../api/user";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 280;

interface NavbarProps {
  children?: React.ReactNode;
}

function Navbar({ children }: NavbarProps) {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    setIsAuthenticated(false);
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: slugs.dashboard,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor:
            mode === "light"
              ? alpha("#ffffff", 0.8)
              : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha(
            mode === "light" ? "#000" : "#fff",
            0.08,
          )}`,
          transition: theme.transitions.create(["margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: "70px !important" }}>
          <IconButton
            color="default"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              mr: 2,
              color: theme.palette.text.primary,
              "&:hover": {
                bgcolor: alpha(mode === "light" ? "#000" : "#fff", 0.05),
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: "-0.5px",
            }}
          >
            Garage: Vehicle Maintenance Tracker
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={toggleTheme}
            sx={{
              mr: 2,
              color: theme.palette.text.primary,
              "&:hover": {
                bgcolor: alpha(mode === "light" ? "#000" : "#fff", 0.05),
                transform: "rotate(180deg)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          <IconButton
            onClick={handleAvatarClick}
            sx={{
              p: 0.5,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
                fontSize: "1rem",
                border: `2px solid ${alpha("#667eea", 0.2)}`,
              }}
            >
              U
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 3,
                bgcolor:
                  mode === "light"
                    ? alpha("#ffffff", 0.95)
                    : alpha(theme.palette.background.paper, 0.95),
                backdropFilter: "blur(20px)",
                border: `1px solid ${alpha(
                  mode === "light" ? "#000" : "#fff",
                  0.08,
                )}`,
                boxShadow:
                  mode === "light"
                    ? "0 8px 32px rgba(0,0,0,0.08)"
                    : "0 8px 32px rgba(0,0,0,0.3)",
                "& .MuiMenuItem-root": {
                  borderRadius: 1.5,
                  mx: 1,
                  my: 0.5,
                  px: 2,
                  py: 1.5,
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                },
              },
            }}
          >
            <MenuItem onClick={() => navigateTo(slugs.profile)}>
              <ListItemIcon>
                <PersonIcon
                  fontSize="small"
                  sx={{ color: theme.palette.primary.main }}
                />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigateTo(slugs.settings)}>
              <ListItemIcon>
                <SettingsIcon
                  fontSize="small"
                  sx={{ color: theme.palette.primary.main }}
                />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: "#f44336" }} />
              </ListItemIcon>
              <Typography sx={{ color: "#f44336" }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            bgcolor: theme.palette.background.paper,
            borderRight: `1px solid ${alpha(
              mode === "light" ? "#000" : "#fff",
              0.08,
            )}`,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Toolbar sx={{ minHeight: "70px !important" }} />

        <Box sx={{ p: 3 }}>
          <Typography
            variant="caption"
            sx={{
              color: alpha(mode === "light" ? "#000" : "#fff", 0.4),
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              px: 2,
            }}
          >
            Navigation
          </Typography>
        </Box>

        <Box sx={{ px: 2 }}>
          <List sx={{ p: 0 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 56,
                    borderRadius: 2.5,
                    px: 2.5,
                    py: 1.5,
                    transition: "all 0.2s ease-in-out",
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                      "& .MuiListItemText-primary": {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      },
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                      },
                    },
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      transform: "translateX(4px)",
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                      "& .MuiListItemText-primary": {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2.5,
                      color: alpha(mode === "light" ? "#000" : "#fff", 0.6),
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    slotProps={{
                      primary: {
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: alpha(mode === "light" ? "#000" : "#fff", 0.8),
                      },
                    }}
                    sx={{
                      "& .MuiListItemText-primary": {
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          width: 0,
        }}
      >
        <Toolbar sx={{ minHeight: "70px !important" }} />
        {children}
      </Box>
    </Box>
  );
}

export default Navbar;
