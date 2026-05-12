"use client";

import { useState, useRef } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  CheckCircleOutline,
  FileUploadOutlined,
  InsertDriveFileOutlined,
  Close,
  SendOutlined,
  ScheduleSendOutlined,
  InfoOutlined,
  AccessTimeOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { useSnackbarStore } from "@/lib/snackbarStore";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtBytes(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

function getTier(y) {
  if (y === 0) return "Fresher";
  if (y <= 3) return "Junior";
  if (y <= 5) return "Senior";
  if (y <= 7) return "Lead";
  if (y <= 12) return "Manager";
  return "Leadership";
}

function getExpLabel(y) {
  if (y <= 3) return "0–3 yrs";
  if (y <= 5) return "3–5 yrs";
  if (y <= 7) return "5–7 yrs";
  if (y <= 12) return "7–12 yrs";
  return "12+ yrs";
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ASSESSMENT_CATEGORIES = [
  {
    name: "SJT",
    sub: "Situational Judgement Test",
    type: "Scenario-based",
    weight: "40%",
    iconBg: "rgba(15,99,255,0.10)",
    iconColor: "#0F63FF",
    pillBg: "rgba(15,99,255,0.10)",
    pillColor: "#0F63FF",
  },
  {
    name: "Psychometric",
    sub: "Personality & traits",
    type: "Adaptive",
    iconBg: "rgba(91,163,100,0.12)",
    iconColor: "#3B6D11",
    pillBg: "rgba(91,163,100,0.12)",
    pillColor: "#3B6D11",
  },
  {
    name: "Behavioural",
    sub: "Past behaviour indicators",
    type: "Structured",
    iconBg: "rgba(186,117,23,0.12)",
    iconColor: "#854F0B",
    pillBg: "rgba(186,117,23,0.12)",
    pillColor: "#854F0B",
  },
  {
    name: "Communication",
    sub: "Verbal & written clarity",
    type: "Evaluated",
    iconBg: "rgba(226,75,74,0.10)",
    iconColor: "#A32D2D",
    pillBg: "rgba(226,75,74,0.10)",
    pillColor: "#A32D2D",
  },
];

const WEIGHTS = ["40%", "25%", "25%", "10%"];

// ─── Resume Upload ─────────────────────────────────────────────────────────────

function ResumeUpload({ file, error, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) onChange(f);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.75, color: "text.secondary", fontSize: 13 }}>
        Resume <Box component="span" sx={{ color: "error.main" }}>*</Box>
      </Typography>

      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        sx={{
          border: "1.5px dashed",
          borderColor: error ? "error.main" : dragging ? "#0F63FF" : file ? "success.main" : "divider",
          borderRadius: 2,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          bgcolor: file
            ? "rgba(91,180,100,0.04)"
            : dragging
            ? "rgba(15,99,255,0.03)"
            : "action.hover",
          transition: "all 0.2s ease",
          "&:hover": { borderColor: "#0F63FF", bgcolor: "rgba(15,99,255,0.03)" },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".pdf,.doc,.docx"
          onChange={(e) => { if (e.target.files?.[0]) onChange(e.target.files[0]); }}
        />

        {file ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
            <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: "rgba(15,99,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <InsertDriveFileOutlined sx={{ fontSize: 18, color: "#0F63FF" }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">{fmtBytes(file.size)}</Typography>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
              sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
            >
              <Close sx={{ fontSize: 15 }} />
            </IconButton>
          </Box>
        ) : (
          <>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(15,99,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileUploadOutlined sx={{ fontSize: 20, color: "#0F63FF" }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
              Click to upload or drag & drop
            </Typography>
            <Typography variant="caption" color="text.secondary">PDF or Word — max 5 MB</Typography>
          </>
        )}
      </Box>

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

// ─── Page 1 ───────────────────────────────────────────────────────────────────

function Page1({ onNext }) {
  const [form, setForm] = useState({ name: "", email: "", experience: "", resume: null });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required.";
    else if (f.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!f.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
    if (!f.experience.trim()) e.experience = "Experience is required.";
    else if (isNaN(Number(f.experience)) || Number(f.experience) < 0) e.experience = "Enter a valid number of years.";
    if (!f.resume) e.resume = "Resume is required.";
    else if (!ALLOWED_TYPES.includes(f.resume.type)) e.resume = "Only PDF or Word documents are accepted.";
    else if (f.resume.size > 5 * 1024 * 1024) e.resume = "File size must not exceed 5 MB.";
    return e;
  };

  const change = (field, val) => {
    const updated = { ...form, [field]: val };
    setForm(updated);
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validate(updated)[field] }));
  };

  const blur = (field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors((p) => ({ ...p, [field]: validate(form)[field] }));
  };

  const handleNext = () => {
    setTouched({ name: true, email: true, experience: true, resume: true });
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    const exp = Number(form.experience);
    onNext({ name: form.name.trim(), email: form.email.trim(), exp, tier: getTier(exp), expLabel: getExpLabel(exp), resume: form.resume });
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: { xs: 3, md: 3.5 } }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
        Add new candidate
      </Typography>

      <TextField
        label="Full Name"
        placeholder="e.g. Rohan Sinha"
        fullWidth
        required
        size="small"
        value={form.name}
        onChange={(e) => change("name", e.target.value)}
        onBlur={() => blur("name")}
        error={!!(touched.name && errors.name)}
        helperText={touched.name && errors.name}
        sx={{ mb: 2.5 }}
      />

      <TextField
        label="Email Address"
        placeholder="e.g. rohan@company.com"
        type="email"
        fullWidth
        required
        size="small"
        value={form.email}
        onChange={(e) => change("email", e.target.value)}
        onBlur={() => blur("email")}
        error={!!(touched.email && errors.email)}
        helperText={touched.email && errors.email}
        sx={{ mb: 2.5 }}
      />

      <TextField
        label="Years of Experience"
        placeholder="e.g. 14"
        type="number"
        fullWidth
        required
        size="small"
        value={form.experience}
        onChange={(e) => change("experience", e.target.value)}
        onBlur={() => blur("experience")}
        error={!!(touched.experience && errors.experience)}
        helperText={
          (touched.experience && errors.experience) ||
          "Enter total years — tier will be assigned automatically."
        }
        inputProps={{ min: 0, step: 1 }}
        sx={{ mb: 2.5 }}
      />

      <ResumeUpload
        file={form.resume}
        error={touched.resume ? errors.resume : undefined}
        onChange={(f) => { change("resume", f); setTouched((p) => ({ ...p, resume: true })); }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
          disableElevation
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            bgcolor: "#0F63FF",
            "&:hover": { bgcolor: "#0B54D6" },
          }}
        >
          Next
        </Button>
      </Box>
    </Paper>
  );
}

// ─── Page 2 ───────────────────────────────────────────────────────────────────

function Page2({ data, onBack, onSend, onSendLater, sending }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>

      {/* Hero card */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0F63FF 0%, #1a3fa8 100%)",
          borderRadius: 3,
          p: "24px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)" }} />
        <Box sx={{ position: "absolute", right: 20, bottom: -50, width: 100, height: 100, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />

        <Typography sx={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", mb: 0.5 }}>
          Candidate review
        </Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 500, color: "#fff", mb: 0.25 }}>{data.name}</Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>{data.email}</Typography>
        <Box sx={{ mt: 1.5 }}>
          <Chip
            icon={<WorkOutlineOutlined sx={{ fontSize: "14px !important", color: "rgba(255,255,255,0.85) !important" }} />}
            label={data.tier}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 500,
              height: 26,
              "& .MuiChip-label": { px: 1.25 },
            }}
          />
        </Box>
      </Box>

      {/* Info grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
        {[
          { label: "Experience", value: `${data.expLabel} (${data.exp} yrs)`, color: "text.primary" },
          { label: "Role suitability", value: data.tier, color: "#0F63FF" },
        ].map((c) => (
          <Box key={c.label} sx={{ bgcolor: "action.hover", borderRadius: 2, p: "12px 14px" }}>
            <Typography sx={{ fontSize: 10.5, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.4 }}>
              {c.label}
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: c.color }}>{c.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Role info alert */}
      <Alert
        icon={<InfoOutlined sx={{ fontSize: 18 }} />}
        severity="info"
        variant="outlined"
        sx={{ borderRadius: 2, fontSize: 13, "& .MuiAlert-message": { fontSize: 13, lineHeight: 1.6 } }}
      >
        <strong>{data.tier}</strong> role suits your given experience. A tailored assessment has been prepared across the categories below.
      </Alert>

      {/* Duration alert */}
      <Alert
        icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />}
        severity="warning"
        variant="outlined"
        sx={{ borderRadius: 2, "& .MuiAlert-message": { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 2 } }}
      >
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>Total test duration</Typography>
          <Typography variant="caption" color="text.secondary">
            Candidate will have exactly 1 hour to complete all sections
          </Typography>
        </Box>
        <Chip
          label="1 Hour"
          size="small"
          sx={{
            bgcolor: "rgba(186,117,23,0.12)",
            color: "#854F0B",
            fontWeight: 600,
            fontSize: 13,
            border: "0.5px solid rgba(186,117,23,0.30)",
            borderRadius: 1.5,
            height: 30,
            flexShrink: 0,
          }}
        />
      </Alert>

      {/* Assessment table */}
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Assessment categories
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { fontSize: 11, fontWeight: 500, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", py: 1, bgcolor: "action.hover" } }}>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Weightage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ASSESSMENT_CATEGORIES.map((cat, i) => (
                <TableRow key={cat.name} sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: "action.hover" } }}>
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: cat.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <WorkOutlineOutlined sx={{ fontSize: 15, color: cat.iconColor }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{cat.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{cat.sub}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: "text.secondary", py: 1.5 }}>{cat.type}</TableCell>
                  <TableCell align="right" sx={{ py: 1.5 }}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        fontSize: 12,
                        fontWeight: 500,
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 10,
                        bgcolor: cat.pillBg,
                        color: cat.pillColor,
                      }}
                    >
                      {WEIGHTS[i]}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2.5, py: 1.5 }}>
          <Typography variant="body2" color="text.secondary">Total weightage</Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 500 }}>100%</Typography>
        </Box>
      </Paper>

      {/* Action buttons */}
      <Box sx={{ display: "flex", gap: 1.25, mt: 0.5 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onSend}
          disabled={sending}
          disableElevation
          startIcon={sending ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : <SendOutlined sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            height: 42,
            bgcolor: "#0F63FF",
            fontSize: 14,
            "&:hover": { bgcolor: "#0B54D6" },
            "&.Mui-disabled": { bgcolor: "#0F63FF", opacity: 0.65 },
          }}
        >
          {sending ? "Sending..." : "Send test link"}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={onSendLater}
          startIcon={<ScheduleSendOutlined sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            height: 42,
            fontSize: 14,
            borderColor: "divider",
            color: "text.primary",
            "&:hover": { bgcolor: "action.hover", borderColor: "divider" },
          }}
        >
          Send later
        </Button>
      </Box>

      {/* Back */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          size="small"
          onClick={onBack}
          startIcon={<ArrowBack sx={{ fontSize: 14 }} />}
          sx={{ textTransform: "none", color: "text.secondary", fontSize: 13 }}
        >
          Back to edit
        </Button>
      </Box>
    </Box>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function CandidateWizard() {
  const [step, setStep] = useState(0); // MUI Stepper is 0-indexed
  const [candidateData, setCandidateData] = useState(null);
  const [sending, setSending] = useState(false);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  

  
  const handleNext = (data) => {
    setCandidateData(data);
    setStep(1);
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await fetch("/api/send-candidate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: candidateData.name,
          email: candidateData.email,
          tier: candidateData.tier,
          experience: candidateData.expLabel,
        }),
      });
      showSnackbar(`Test link sent to ${candidateData.email}`, "success");
      setStep(0)
    } catch {
      showSnackbar("Failed to send email. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const handleSendLater = () => {
    showSnackbar("Saved — you can send the link later from the dashboard.", "info");
    setStep(0);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        p: { xs: "32px 16px 60px", md: "40px 24px 60px" },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 540 }}>

        {/* MUI Stepper */}
        <Stepper activeStep={step} sx={{ mb: 3.5 }}>
          {["Candidate info", "Review & send"].map((label, i) => (
            <Step key={label} completed={step > i}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    "&.Mui-completed": { color: "#0F63FF" },
                    "&.Mui-active": { color: "#0F63FF" },
                  },
                }}
                sx={{
                  "& .MuiStepLabel-label": { fontSize: 13 },
                  "& .MuiStepLabel-label.Mui-active": { fontWeight: 500, color: "text.primary" },
                  "& .MuiStepLabel-label.Mui-completed": { color: "text.secondary" },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 0 && <Page1 onNext={handleNext} />}
        {step === 1 && candidateData && (
          <Page2
            data={candidateData}
            onBack={() => setStep(0)}
            onSend={handleSend}
            onSendLater={handleSendLater}
            sending={sending}
          />
        )}
      </Box>
    </Box>
  );
}