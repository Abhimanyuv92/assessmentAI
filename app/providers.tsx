"use client";

import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import theme from "@/lib/theme";



export default function Providers({ children }: { children: React.ReactNode }) {
 
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

  
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
  );
}
