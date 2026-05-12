"use client";

import { useState, type ReactNode, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useSnackbarStore } from "@/lib/snackbarStore";


function TabPanel({ children, value, index }: { children: ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index} aria-labelledby={`tab-${index}`}>
      {value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null}
    </div>
  );
}

export default function Login() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  const [hiringOptions, setHiringOptions] = useState<string[]>([
    "Frontend Engineer",
    "Operations Specialist",
    "Backend Developer",
    "Product Manager",
    "Data Scientist",
  ]);
  const [selectedHiringFor, setSelectedHiringFor] = useState<string[]>([]);

  // Form state
  const [recruiterForm, setRecruiterForm] = useState({
    companyName: "",
    companyEmail: "",
    password: "",
  });

  const [candidateForm, setCandidateForm] = useState({
    email: "",
    password: "",
    desiredRole: "",
    experience: "",
  });

  // Error state
  const [recruiterErrors, setRecruiterErrors] = useState({
    companyName: "",
    companyEmail: "",
    password: "",
    hiringFor: "",
  });

  const [candidateErrors, setCandidateErrors] = useState({
    email: "",
    password: "",
  });

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // Clear errors when switching tabs
    setRecruiterErrors({ companyName: "", companyEmail: "", password: "", hiringFor: "" });
    setCandidateErrors({ email: "", password: "" });
  };

  const validateRecruiterForm = () => {
    const errors = { companyName: "", companyEmail: "", password: "", hiringFor: "" };
    let isValid = true;

    if (!recruiterForm.companyName.trim()) {
      errors.companyName = "Company name is required";
      isValid = false;
    }

    if (!recruiterForm.companyEmail.trim()) {
      errors.companyEmail = "Company email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(recruiterForm.companyEmail)) {
      errors.companyEmail = "Please enter a valid email address";
      isValid = false;
    }

    if (!recruiterForm.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (recruiterForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (selectedHiringFor.length === 0) {
      errors.hiringFor = "Please select at least one role";
      isValid = false;
    }

    setRecruiterErrors(errors);
    return isValid;
  };

  const validateCandidateForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!candidateForm.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(candidateForm.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!candidateForm.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (candidateForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setCandidateErrors(errors);
    return isValid;
  };

  const handleSubmit = (role: "RECRUITER" | "CANDIDATE") => {
    let isValid = false;

    if (role === "RECRUITER") {
      isValid = validateRecruiterForm();
    } else {
      isValid = validateCandidateForm();
    }

    if (isValid) {
      showSnackbar("Registration successful", "success");
      localStorage.setItem("role", role);
      setTimeout(() => {
        router.push("/auth/login");
      }, 300);
    }
  };

  return (
    <Box className="min-h-screen">
      <Box className="mx-auto flex min-h-screen max-w-7xl flex-col gap-2 px-4 py-10 lg:flex-row lg:items-center lg:justify-evenly">
        <Box className="flex-1 lg:max-w-[45%]">
          <Typography variant="h3" component="h3" sx={{ mb: 3, fontWeight: 700, lineHeight: 1.1 }}>
            Nexon AI for Recruiters & Candidates
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 660 }}>
            A modern portal to manage coding assessments, review candidate results, and make smarter hiring decisions faster.
          </Typography>
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Recruiter workflow
              </Typography>
              <Typography color="text.secondary">
                Post assessments, invite candidates, and track progress with a centralized dashboard.
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Candidate experience
              </Typography>
              <Typography color="text.secondary">
                Sign in quickly, access test details, and see your status in one clean interface.
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Built for assessments
              </Typography>
              <Typography color="text.secondary">
                Fast, responsive, and ready for real interview-grade question flows.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box className="flex w-full justify-center lg:w-auto">
          <Card sx={{ width: "100%", minWidth: 420, maxWidth: 420, borderRadius: 3, boxShadow: 6 }}>
            <CardHeader
              title="Sign In"
            />

            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
              <Tabs value={tabIndex} onChange={handleTabChange} aria-label="login role tabs">
                <Tab label="Recruiter" id="tab-0" aria-controls="tabpanel-0" />
                <Tab label="Candidate" id="tab-1" aria-controls="tabpanel-1" />
              </Tabs>
            </Box>

            <CardContent>
              <TabPanel value={tabIndex} index={0}>
                <Stack spacing={3}>
                  <TextField
                    label="Company Name"
                    fullWidth
                    required
                    value={recruiterForm.companyName}
                    onChange={(e) => setRecruiterForm(prev => ({ ...prev, companyName: e.target.value }))}
                    error={!!recruiterErrors.companyName}
                    helperText={recruiterErrors.companyName}
                  />
                  <TextField
                    label="Company Email"
                    type="email"
                    fullWidth
                    required
                    value={recruiterForm.companyEmail}
                    onChange={(e) => setRecruiterForm(prev => ({ ...prev, companyEmail: e.target.value }))}
                    error={!!recruiterErrors.companyEmail}
                    helperText={recruiterErrors.companyEmail}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={recruiterForm.password}
                    onChange={(e) => setRecruiterForm(prev => ({ ...prev, password: e.target.value }))}
                    error={!!recruiterErrors.password}
                    helperText={recruiterErrors.password}
                  />
                  <Autocomplete
                    multiple
                    freeSolo
                    options={hiringOptions}
                    value={selectedHiringFor}
                    onChange={(_event, newValue) => {
                      setSelectedHiringFor(newValue);
                      const newOptions = newValue.filter((item) => !hiringOptions.includes(item));
                      if (newOptions.length) {
                        setHiringOptions((prev) => [...prev, ...newOptions]);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Hiring For"
                        placeholder="Type or select roles"
                        required
                        error={!!recruiterErrors.hiringFor}
                        helperText={recruiterErrors.hiringFor}
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </TabPanel>

              <TabPanel value={tabIndex} index={1}>
                <Stack spacing={3}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={candidateForm.email}
                    onChange={(e) => setCandidateForm(prev => ({ ...prev, email: e.target.value }))}
                    error={!!candidateErrors.email}
                    helperText={candidateErrors.email}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={candidateForm.password}
                    onChange={(e) => setCandidateForm(prev => ({ ...prev, password: e.target.value }))}
                    error={!!candidateErrors.password}
                    helperText={candidateErrors.password}
                  />
                  <TextField
                    label="Desired Role"
                    fullWidth
                    value={candidateForm.desiredRole}
                    onChange={(e) => setCandidateForm(prev => ({ ...prev, desiredRole: e.target.value }))}
                    placeholder="Example: Backend Developer"
                  />
                  <TextField
                    label="Experience"
                    fullWidth
                    value={candidateForm.experience}
                    onChange={(e) => setCandidateForm(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="Example: 3 years"
                  />
                </Stack>
              </TabPanel>
            </CardContent>

            <CardActions sx={{ flexDirection: "column", gap: 2, px: 3, pb: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => handleSubmit(tabIndex === 0 ? "RECRUITER" : "CANDIDATE")}
              >
                Sign In
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
    </Box>
  );
}
