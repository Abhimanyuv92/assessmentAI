"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Google, Microsoft } from "@mui/icons-material";
import { useLoginStore } from "@/lib/loginStore";
import { useSnackbarStore } from "@/lib/snackbarStore";

export default function AuthLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const {login} = useLoginStore();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    


  const handleLogin = (event: SyntheticEvent) => {
    event.preventDefault();

    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } 

    if (!valid) {
      return;
    }
    login(email,'token')
    localStorage.setItem("authPage", "login");
    if(email.toLowerCase() == "cand@test.com"){
    showSnackbar("Login successful!", "success");

    router.push("/candidate");
    localStorage.setItem("role", "candidate");
    }else if(email.toLowerCase() == "admin@test.com"){
    showSnackbar("Login successful!", "success");

    router.push("/admin");
    localStorage.setItem("role", "admin");

    }else{
        setEmailError("Invalid email or password");
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center">
        <Box className="flex w-full justify-center lg:w-auto">
          <Card sx={{ width: "100%", maxWidth: 380, borderRadius: 3, boxShadow: 6 }}>
            <CardHeader
              title="Login"
            />

            <CardContent>
              <Box component="form" onSubmit={handleLogin}>
                <Stack spacing={3}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    fullWidth
                    required
                    onChange={(event) => setEmail(event.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    fullWidth
                    required
                    onChange={(event) => setPassword(event.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                  />
                </Stack>
              </Box>
            </CardContent>

            <CardActions sx={{ flexDirection: "column", gap: 2, px: 3, pb: 3 }}>
              <Button type="submit" variant="contained" size="large" fullWidth onClick={handleLogin}>
                Login
              </Button>

              <Divider sx={{ width: "100%" }}>
                <Typography variant="caption" color="text.secondary">
                  or continue with
                </Typography>
              </Divider>

               <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                <Button variant="outlined" fullWidth color="inherit" sx={{ textTransform: "none" }} startIcon={<img src="https://hrcdn.net/fcore/assets/signup/google-1ce6cf8a69.svg"  />}>
                Google
                </Button>
                <Button variant="outlined" fullWidth color="inherit" sx={{ textTransform: "none" }} startIcon={<img src="https://hrcdn.net/fcore/assets/signup/microsoft-dcac910d72.svg" />}>
                Microsoft
                </Button>
              </Stack>
            </CardActions>
          </Card>
        </Box>
    </Box>
  );
}
