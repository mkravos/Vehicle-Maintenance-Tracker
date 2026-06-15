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
import { Lock } from "@mui/icons-material";
import { login } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { slugs } from "../../resources/strings/slugs";
import { useAuth } from "../../context/AuthContext";

const loginFailed: string =
  "Login failed. Please check your credentials and try again.";
const accountNotFound: string =
  "This account does not exist. Please register for an account or check your email address and try again.";
const generalError: string =
  "An error occurred while trying to log you in. Please try again later.";
const requiredFields: string = "Please fill in all required fields.";

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({
      username,
      password,
      recaptchaToken,
    }: {
      username: string;
      password: string;
      recaptchaToken: string;
    }) => login(username, password, recaptchaToken),
    onSuccess: (res) => {
      if (res.status === 200 && "token" in res.data) {
        setErrorMsg(null);
        localStorage.setItem("username", username);
        localStorage.setItem("token", res.data.token);
        setIsAuthenticated(true);
      } else if (res.status === 401) {
        setErrorMsg(loginFailed);
      } else if (res.status === 404) {
        setErrorMsg(accountNotFound);
      }
    },
  });

  const handleSubmit = async () => {
    if (!username || !password) {
      setErrorMsg(requiredFields);
      return;
    }
    if (!executeRecaptcha) return;
    const recaptchaToken = await executeRecaptcha("login");
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
          height: "575px",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Lock sx={{ fontSize: 64, color: theme.palette.primary.main }} />
        <Typography variant="h5" color={theme.palette.text.primary}>
          Login
        </Typography>
        <Typography
          sx={{ height: 10, mt: 2, fontWeight: "bold" }}
          variant="body2"
          color={theme.palette.error.main}
        >
          {isError ? generalError : errorMsg}
        </Typography>
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
            type="password"
            required
            error={errorMsg === requiredFields && !password}
            inputRef={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
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
          Sign In
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link
            href={slugs.forgot}
            variant="body2"
            sx={{ mt: 2, fontWeight: "bold" }}
            onClick={(e) => {
              e.preventDefault();
              navigate(slugs.forgot);
            }}
          >
            Forgot password?
          </Link>
          <Link
            href={slugs.register}
            variant="body2"
            sx={{ mt: 2, fontWeight: "bold" }}
            onClick={(e) => {
              e.preventDefault();
              navigate(slugs.register);
            }}
          >
            Don't have an account? Register
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
