import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#202A42",
      light: "#273453",
    },
    secondary: {
      main: "#FFD600",
    },
    background: {
      default: "#202A42",
      paper: "#273453",
    },
    text: {
      primary: "#E6EBF4",
      secondary: "#B0B8D1",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  typography: {
    allVariants: {
      color: "#E6EBF4",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#202A42",
          color: "#E6EBF4",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#273453",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#273453",
          color: "#E6EBF4",
          borderRadius: "12px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "6px",
          fontWeight: 500,
        },
        contained: {
          backgroundColor: "#FFD600",
          color: "#202A42",
          "&:hover": {
            backgroundColor: "#FFE66D",
          },
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.3)",
          color: "#E6EBF4",
          "&:hover": {
            backgroundColor: "rgba(255, 214, 0, 0.1)",
            borderColor: "#FFD600",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#28365A",
            color: "#E6EBF4",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "&:hover fieldset": {
              borderColor: "#FFD600",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFD600",
            },
            "&:hover .MuiInputBase-input::placeholder": {
              color: "#FFFFFF",
              opacity: 1,
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#B0B8D1",
            opacity: 0.7,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#B0B8D1",
          "&.Mui-focused": {
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#B0B8D1",
          "&.Mui-error": {
            color: "#FF6B6B",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.3)",
          "&.Mui-checked": {
            color: "#FFD600",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "&.Mui-checked .MuiSwitch-thumb": {
            backgroundColor: "#FFD600",
          },
          "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#FFD600",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          color: "#B0B8D1",
          "&.Mui-selected": {
            color: "#FFD600",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#28365A",
          color: "#E6EBF4",
          "& .MuiChip-deleteIcon": {
            color: "#FFD600",
          },
        },
      },
    },
  },
});

export default theme;
