import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
  IconButton,
  alpha,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useThemeMode } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { slugs } from "../../resources/strings/slugs";
import { updateUser } from "../../api/user";

const generalError: string =
  "An error occurred while updating your account. Please try again later.";
const accountExists: string =
  "An account with this email already exists. Please use a different email address.";
const emailPasswordIncorrect: string =
  "Password is incorrect. Please try again.";
const invalidEmail: string = "Please enter a valid email address.";
const emailSuccess: string = "Email address updated successfully.";
const passwordComplexity: string =
  "Password must be at least 12 characters long, and include uppercase and lowercase letters, numbers, and special characters.";
const incorrectPassword: string =
  "Current password is incorrect. Please try again.";
const samePassword: string =
  "New password cannot be the same as the current password.";
const passwordsDoNotMatch: string = "Passwords do not match. Please try again.";
const requiredFields: string = "Please fill in all required fields.";
const passwordSuccess: string = "Password updated successfully.";

export default function AccountSettings() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const navigate = useNavigate();

  const borderColor = alpha(mode === "light" ? "#000" : "#fff", 0.08);

  // Field refs for Enter-to-advance navigation
  const lastNameRef = React.useRef<HTMLInputElement>(null);
  const companyNameRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const streetRef = React.useRef<HTMLInputElement>(null);
  const cityRef = React.useRef<HTMLInputElement>(null);
  const stateRef = React.useRef<HTMLInputElement>(null);
  const postalCodeRef = React.useRef<HTMLInputElement>(null);
  const countryRef = React.useRef<HTMLInputElement>(null);
  const emailPasswordRef = React.useRef<HTMLInputElement>(null);
  const newPasswordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  // Profile details form state
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [companyName, setCompanyName] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [street, setStreet] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [postalCode, setPostalCode] = React.useState<string>("");
  const [country, setCountry] = React.useState<string>("");
  const [profileError, setProfileError] = React.useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = React.useState<string | null>(
    null,
  );

  // Email form state
  const [newEmail, setNewEmail] = React.useState<string>("");
  const [emailPassword, setEmailPassword] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [emailSuccessMsg, setEmailSuccessMsg] = React.useState<string | null>(
    null,
  );

  // Password form state
  const [currentPassword, setCurrentPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = React.useState<
    string | null
  >(null);

  const handleUpdateProfile = () => {
    setProfileError(null);
    setProfileSuccess(null);
    // TODO: API integration — persist user profile details
  };

  const handleUpdateEmail = () => {
    setEmailError(null);
    setEmailSuccessMsg(null);
    if (!newEmail || !emailPassword) {
      setEmailError(requiredFields);
      return;
    }
    updateUser("changeUsername", newEmail, emailPassword)
      .then((res) => {
        if (res.status === 401) {
          setEmailError(emailPasswordIncorrect);
          return;
        } else if (res.status === 409) {
          setEmailError(accountExists);
          return;
        } else if (
          res.status === 500 &&
          res.data?.message?.includes("format:")
        ) /* hack to detect invalid email format error from backend */ {
          setEmailError(invalidEmail);
          return;
        }
        localStorage.setItem("username", newEmail);
        setEmailSuccessMsg(emailSuccess);
        setNewEmail("");
        setEmailPassword("");
      })
      .catch(() => {
        setEmailError(generalError);
      });
  };

  const handleUpdatePassword = () => {
    setPasswordError(null);
    setPasswordSuccessMsg(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(requiredFields);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(passwordsDoNotMatch);
      return;
    }
    updateUser("changePassword", newPassword, currentPassword)
      .then((res) => {
        if (res.status === 401) {
          setPasswordError(incorrectPassword);
          return;
        } else if (res.status === 409) {
          setPasswordError(samePassword);
          return;
        } else if (
          res.status === 500 &&
          res.data?.message?.includes("complexity:")
        ) /* hack to detect password complexity error from backend */ {
          setPasswordError(passwordComplexity);
          return;
        }
        setPasswordSuccessMsg(passwordSuccess);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch(() => {
        setPasswordError(generalError);
      });
  };

  const sectionCard = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    error: string | null,
    success: string | null,
    fields: React.ReactNode,
    onSubmit: () => void,
    submitLabel: string,
  ) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${borderColor}`,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        <Box
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
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ minHeight: 24, mt: 1 }}>
        {error && (
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold" }}
            color={theme.palette.error.main}
          >
            {error}
          </Typography>
        )}
        {success && (
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold" }}
            color={theme.palette.success.main}
          >
            {success}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>{fields}</Stack>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          aria-label="back to settings"
          onClick={() => navigate(slugs.settings)}
          sx={{
            color: theme.palette.text.primary,
            "&:hover": {
              bgcolor: alpha(mode === "light" ? "#000" : "#fff", 0.05),
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
          >
            Account Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Update your email address and password.
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>
        {sectionCard(
          <PersonIcon />,
          "Profile Details",
          "Personal information used across your maintenance records.",
          profileError,
          profileSuccess,
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            }}
          >
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  lastNameRef.current?.focus();
                }
              }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              inputRef={lastNameRef}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  companyNameRef.current?.focus();
                }
              }}
            />
            <TextField
              label="Company Name (optional)"
              variant="outlined"
              fullWidth
              value={companyName}
              inputRef={companyNameRef}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  phoneRef.current?.focus();
                }
              }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={phone}
              inputRef={phoneRef}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  streetRef.current?.focus();
                }
              }}
            />
            <TextField
              label="Street Address"
              variant="outlined"
              fullWidth
              value={street}
              inputRef={streetRef}
              onChange={(e) => setStreet(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  cityRef.current?.focus();
                }
              }}
              sx={{ gridColumn: { sm: "1 / -1" } }}
            />
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              value={city}
              inputRef={cityRef}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  stateRef.current?.focus();
                }
              }}
            />
            <TextField
              label="State / Province"
              variant="outlined"
              fullWidth
              value={state}
              inputRef={stateRef}
              onChange={(e) => setState(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  postalCodeRef.current?.focus();
                }
              }}
            />
            <TextField
              label="ZIP / Postal Code"
              variant="outlined"
              fullWidth
              value={postalCode}
              inputRef={postalCodeRef}
              onChange={(e) => setPostalCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  countryRef.current?.focus();
                }
              }}
            />
            <TextField
              label="Country"
              variant="outlined"
              fullWidth
              value={country}
              inputRef={countryRef}
              onChange={(e) => setCountry(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateProfile();
                }
              }}
            />
          </Box>,
          handleUpdateProfile,
          "Save Profile",
        )}

        {sectionCard(
          <EmailIcon />,
          "Email Address",
          "Your email address is used as your username to sign in.",
          emailError,
          emailSuccessMsg,
          <>
            <TextField
              label="New Email Address"
              variant="outlined"
              required
              error={emailError === requiredFields && !newEmail}
              fullWidth
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  emailPasswordRef.current?.focus();
                }
              }}
            />
            <TextField
              label="Current Password"
              variant="outlined"
              type="password"
              required
              error={emailError === requiredFields && !emailPassword}
              fullWidth
              value={emailPassword}
              inputRef={emailPasswordRef}
              onChange={(e) => setEmailPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateEmail();
                }
              }}
            />
          </>,
          handleUpdateEmail,
          "Update Email",
        )}

        {sectionCard(
          <LockIcon />,
          "Password",
          "Use at least 12 characters with uppercase, lowercase, numbers, and special characters.",
          passwordError,
          passwordSuccessMsg,
          <>
            <TextField
              label="Current Password"
              variant="outlined"
              type="password"
              required
              error={passwordError === requiredFields && !currentPassword}
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  newPasswordRef.current?.focus();
                }
              }}
            />
            <TextField
              label="New Password"
              variant="outlined"
              type="password"
              required
              error={passwordError === requiredFields && !newPassword}
              fullWidth
              value={newPassword}
              inputRef={newPasswordRef}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  confirmPasswordRef.current?.focus();
                }
              }}
            />
            <TextField
              label="Confirm New Password"
              variant="outlined"
              type="password"
              required
              error={passwordError === requiredFields && !confirmPassword}
              fullWidth
              value={confirmPassword}
              inputRef={confirmPasswordRef}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdatePassword();
                }
              }}
            />
          </>,
          handleUpdatePassword,
          "Update Password",
        )}
      </Stack>
    </Box>
  );
}
