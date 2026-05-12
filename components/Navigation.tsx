"use client";

import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useLoginStore } from "@/lib/loginStore";
import { useSnackbarStore } from "@/lib/snackbarStore";
import { useEffect, useState } from "react";

export default function Navigation() {
  const router = useRouter();

  const {isAuthenticated,logout,user} = useLoginStore();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
   const menuItemsInitialValue = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Features", path: "/features" },
    { label: "Solutions", path: "/solutions" },
  ]
  const [menuItems, setMenuItems] = useState(menuItemsInitialValue);

console.log(user)
 

  useEffect(()=>{
    if(isAuthenticated){
      setMenuItems([...menuItemsInitialValue,{label:"Dashboard",path:user==='admin@test.com'?"/admin":"/dashboard"}])
    }else{
      setMenuItems(menuItemsInitialValue)
    }
  },[isAuthenticated])

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#273453",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        borderBottom: "1px solid rgba(255, 214, 0, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, #FFD600, #FFF9C4)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            Nexon AI
          </Typography>

          {/* Navigation Links */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              flex: 1,
              justifyContent: "flex-end",
              paddingRight:"2rem"
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => router.push(item.path)}
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  textTransform: "none",
                  color: "#E6EBF4",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: 0,
                    height: 2,
                    bottom: -4,
                    left: 0,
                    backgroundColor: "#FFD600",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Auth Buttons */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
           {isAuthenticated ?<Button
              variant="outlined"
              onClick={() => {localStorage.removeItem("role")
                 logout()
                 showSnackbar("Logged out successfully!", "success");
                 router.push("/")}}
              sx={{
                borderColor: "#FFD600",
                color: "#FFD600",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                "&:hover": {
                  backgroundColor: "rgba(255, 214, 0, 0.1)",
                },
              }}
            >
              Logout
            </Button>: 
           <>
           <Button
              variant="outlined"
              onClick={() => router.push("/auth/login")}
              sx={{
                borderColor: "#FFD600",
                color: "#FFD600",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                "&:hover": {
                  backgroundColor: "rgba(255, 214, 0, 0.1)",
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push("/auth")}
              sx={{
                backgroundColor: "#FFD600",
                color: "#202A42",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                "&:hover": {
                  backgroundColor: "#FFE66D",
                },
              }}
            >
              Sign Up
            </Button>
            </>}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
