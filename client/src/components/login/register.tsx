import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Link,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { register } from "../../api/user";
import { slugs } from "../../resources/strings/slugs";
import { useNavigate } from "react-router-dom";

const generalError: string =
  "An error occurred during account creation. Please try again later.";
const accountExists: string =
  "An account with this email already exists. Please log in or use a different email address.";
const passwordComplexity: string =
  "Password must be at least 12 characters long, and include uppercase and lowercase letters, numbers, and special characters.";
const invalidEmail: string = "Please enter a valid email address.";
const registrationSuccess: string =
  "Account created successfully! You can now log in with your new account.";
const requiredFields: string = "Please fill in all required fields.";

export default function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({
      username,
      password,
      recaptchaToken,
    }: {
      username: string;
      password: string;
      recaptchaToken: string;
    }) => register(username, password, recaptchaToken),
    onSuccess: (res) => {
      console.log(res);
      if (res.status === 201) {
        setErrorMsg(null);
        setSuccessMsg(registrationSuccess);
      } else if (res.status === 409) {
        setErrorMsg(accountExists);
        setSuccessMsg(null);
      } else if (res.status === 500) {
        if (
          res.data?.message?.includes("format:")
        ) /* hack to detect invalid email format error from backend */ {
          setErrorMsg(invalidEmail);
          setSuccessMsg(null);
        } else if (
          res.data?.message?.includes("complexity:")
        ) /* hack to detect password complexity error from backend */ {
          setErrorMsg(passwordComplexity);
          setSuccessMsg(null);
        }
      } else {
        setErrorMsg(generalError);
        setSuccessMsg(null);
      }
    },
  });

  const handleSubmit = async () => {
    if (!username || !password || !confirmPassword) {
      setErrorMsg(requiredFields);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please try again.");
      return;
    }
    if (!executeRecaptcha) return;
    const recaptchaToken = await executeRecaptcha("register");
    mutate({ username, password, recaptchaToken });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
        height: "100vh",
        p: 4,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h1" color={theme.palette.primary.main}>
        Garage
      </Typography>
      <Paper
        sx={{
          mt: 4,
          p: 4,
          width: "575px",
          height: "600px",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <PersonAdd sx={{ fontSize: 64, color: theme.palette.primary.main }} />
        <Typography variant="h5" color={theme.palette.text.primary}>
          Register
        </Typography>
        <Box sx={{ height: 10, mt: 2 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold" }}
            color={theme.palette.error.main}
          >
            {isError ? generalError : errorMsg}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold" }}
            color={theme.palette.success.main}
          >
            {successMsg}
          </Typography>
        </Box>
        <Divider sx={{ my: 5 }} />
        <FormControl fullWidth>
          <TextField
            label="Email Address"
            variant="outlined"
            required
            error={errorMsg === requiredFields && !username}
            sx={{ mb: 2 }}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                passwordRef.current?.focus();
              }
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            required
            error={errorMsg === requiredFields && !password}
            sx={{ mb: 2 }}
            type="password"
            inputRef={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                confirmPasswordRef.current?.focus();
              }
            }}
          />
          <TextField
            label="Re-Enter Password"
            variant="outlined"
            required
            error={errorMsg === requiredFields && !confirmPassword}
            type="password"
            inputRef={confirmPasswordRef}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </FormControl>
        <Divider sx={{ my: 5 }} />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 4 }}
          onClick={() => handleSubmit()}
          disabled={isPending}
        >
          Create Account
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link
            href={slugs.login}
            variant="body2"
            sx={{ mt: 2, fontWeight: "bold" }}
            onClick={(e) => {
              e.preventDefault();
              navigate(slugs.login);
            }}
          >
            Already have an account? Sign In
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
