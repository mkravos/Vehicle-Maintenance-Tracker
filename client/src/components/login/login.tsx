import React from "react";
import { useMutation } from "@tanstack/react-query";
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

const loginFailed: string =
  "Login failed. Please check your credentials and try again.";
const accountNotFound: string =
  "This account does not exist. Please register for an account or check your email address and try again.";
const generalError: string =
  "An error occurred while trying to log you in. Please try again later.";

function Login() {
  const theme = useTheme();
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => login(username, password, ""), // TODO: pass recaptcha token here
    onSuccess: (res) => {
      if (res.status === 200 && "token" in res.data) {
        setErrorMsg(null);
        localStorage.setItem("token", res.data.token);
        // TODO: update state
      } else if (res.status === 401) {
        setErrorMsg(loginFailed);
      } else if (res.status === 404) {
        setErrorMsg(accountNotFound);
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
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
            inputRef={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                mutate({ username, password });
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
          onClick={() => mutate({ username, password })}
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
            href="/forgot"
            variant="body2"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            Forgot password?
          </Link>
          <Link
            href="/register"
            variant="body2"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            Don't have an account? Register
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
