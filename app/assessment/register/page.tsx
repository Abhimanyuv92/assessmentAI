"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  MonitorSmartphone,
  WifiOff,
  Camera,
  Mic,
  Eye,
  Ban,
  ArrowRight,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TokenPayload {
  name: string;
  email: string;
  tier: string;
  experience: string;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  experience: string;
  govtIdType: string;
  govtIdFile: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  govtIdType?: string;
  govtIdFile?: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const GOVT_ID_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Passport",
  "Voter ID",
  "Driving Licence",
];

const ASSESSMENT_CATEGORIES = [
  {
    name: "SJT",
    full: "Situational Judgement Test",
    weight: "40%",
    desc: "Scenario-based questions assessing decision-making in real workplace situations.",
    pillBg: "rgba(15,99,255,0.09)",
    pillColor: "#0F63FF",
  },
  {
    name: "Psychometric",
    full: "Psychometric Assessment",
    weight: "25%",
    desc: "Personality & cognitive trait evaluation using validated adaptive instruments.",
    pillBg: "rgba(59,109,17,0.09)",
    pillColor: "#3B6D11",
  },
  {
    name: "Behavioural",
    full: "Behavioural Assessment",
    weight: "25%",
    desc: "Structured questions based on past behaviour as a predictor of future performance.",
    pillBg: "rgba(133,79,11,0.09)",
    pillColor: "#854F0B",
  },
  {
    name: "Communication",
    full: "Communication Skills",
    weight: "10%",
    desc: "Evaluation of verbal reasoning, written clarity, and professional expression.",
    pillBg: "rgba(163,45,45,0.09)",
    pillColor: "#A32D2D",
  },
];

const PROCTORING_RULES = [
  {
    icon: Camera,
    color: "#0F63FF",
    bg: "rgba(15,99,255,0.08)",
    title: "Webcam required",
    desc: "Your webcam must remain active throughout the test. Face must be clearly visible at all times.",
  },
  {
    icon: Mic,
    color: "#3B6D11",
    bg: "rgba(59,109,17,0.08)",
    title: "Microphone on",
    desc: "Audio will be monitored. Ensure you are in a quiet environment with no background conversations.",
  },
  {
    icon: Eye,
    color: "#854F0B",
    bg: "rgba(133,79,11,0.08)",
    title: "Eye tracking active",
    desc: "Do not look away from the screen for extended periods. Gaze detection is enabled.",
  },
  {
    icon: MonitorSmartphone,
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    title: "Single screen only",
    desc: "Only one monitor is permitted. Connecting additional displays will flag your session.",
  },
  {
    icon: Ban,
    color: "#A32D2D",
    bg: "rgba(163,45,45,0.08)",
    title: "Tab switching disabled",
    desc: "Switching browser tabs or windows will be recorded as a violation and may terminate your test.",
  },
  {
    icon: WifiOff,
    color: "#854F0B",
    bg: "rgba(133,79,11,0.08)",
    title: "Stable internet required",
    desc: "Ensure a stable internet connection (min. 2 Mbps). Disconnections are logged as incidents.",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function decodeToken(token: string): TokenPayload | null {
  try {
    return JSON.parse(atob(token.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Full name is required.";
  else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address.";

  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  else if (!/^[6-9]\d{9}$/.test(values.phone.trim()))
    errors.phone = "Enter a valid 10-digit Indian mobile number.";

  if (!values.experience.trim()) errors.experience = "Years of experience is required.";
  else if (isNaN(Number(values.experience)) || Number(values.experience) < 0)
    errors.experience = "Enter a valid non-negative number.";

  if (!values.govtIdType) errors.govtIdType = "Please select an ID type.";

  if (!values.govtIdFile) errors.govtIdFile = "Please upload a government-issued ID.";
  else if (values.govtIdFile.size > 5 * 1024 * 1024)
    errors.govtIdFile = "File must not exceed 5 MB.";
  else if (!["image/jpeg", "image/png", "application/pdf"].includes(values.govtIdFile.type))
    errors.govtIdFile = "Only JPG, PNG, or PDF files are accepted.";

  return errors;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  const steps = ["Registration", "Instructions", "Assessment"];
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3.5 }}>
      {steps.map((label, i) => (
        <Box key={label} sx={{ flex: 1, textAlign: "center" }}>
          <Box
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: i < step ? "primary.main" : i === step ? "primary.main" : "action.disabledBackground",
              opacity: i < step ? 0.4 : 1,
              mb: 0.6,
              transition: "all 0.3s",
            }}
          />
          <Typography
            sx={{
              fontSize: 11,
              color: i === step ? "primary.main" : i < step ? "text.secondary" : "text.disabled",
              fontWeight: i === step ? 700 : 400,
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// ─── File Upload ──────────────────────────────────────────────────────────────

function GovtIdUpload({
  value,
  error,
  onChange,
}: {
  value: File | null;
  error?: string;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <Box>
      <Typography sx={{ fontSize: 13, mb: 0.6, color: "text.secondary" }}>
        Government ID Proof <Box component="span" sx={{ color: "error.main" }}>*</Box>
      </Typography>
      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); onChange(e.dataTransfer.files?.[0] ?? null); }}
        sx={{
          border: "1.5px dashed",
          borderColor: error ? "error.main" : dragging ? "primary.main" : "divider",
          borderRadius: 2,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          bgcolor: dragging ? "action.hover" : "background.default",
          transition: "all 0.2s ease",
          "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
        }}
      >
        <input ref={inputRef} type="file" hidden accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
        {value ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: "action.selected", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={18} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value.name}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{formatBytes(value.size)}</Typography>
            </Box>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onChange(null); if (inputRef.current) inputRef.current.value = ""; }}>
              <X size={14} />
            </IconButton>
          </Box>
        ) : (
          <>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "action.selected", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={18} />
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Click to upload or drag & drop</Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>JPG, PNG, or PDF · max 5 MB</Typography>
          </>
        )}
      </Box>
      {error && <Typography sx={{ fontSize: 11.5, color: "error.main", mt: 0.5 }}>{error}</Typography>}
    </Box>
  );
}

// ─── Screen 1: Registration ───────────────────────────────────────────────────

function RegistrationScreen({
  form,
  errors,
  touched,
  submitting,
  submitted,
  onChange,
  onBlur,
  onSubmit,
  setTouched,
}: {
  form: FormValues;
  errors: FormErrors;
  touched: Record<string, boolean>;
  submitting: boolean;
  submitted: boolean;
  onChange: (field: keyof FormValues, value: string | File | null) => void;
  onBlur: (field: keyof FormValues) => void;
  onSubmit: () => void;
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  return (
    <>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 3.5 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: "50%", bgcolor: "primary.main", mb: 1.5 }}>
          <CheckCircle2 size={24} color="#fff" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Candidate Registration</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          Complete your profile to proceed to the assessment
        </Typography>
      </Box>

      <Stepper step={0} />

      {/* Form card */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {submitted && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            Registration complete! Loading instructions…
          </Alert>
        )}

        <TextField
          label="Full Name" required fullWidth size="small"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          onBlur={() => onBlur("name")}
          error={touched.name && !!errors.name}
          helperText={touched.name && errors.name}
        />

        <TextField
          label="Email Address" required fullWidth size="small" type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          onBlur={() => onBlur("email")}
          error={touched.email && !!errors.email}
          helperText={touched.email && errors.email}
        />

        <TextField
          label="Phone Number" required fullWidth size="small"
          placeholder="10-digit mobile number"
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
          onBlur={() => onBlur("phone")}
          error={touched.phone && !!errors.phone}
          helperText={touched.phone && errors.phone}
        />

        <TextField
          label="Years of Experience" required fullWidth size="small" type="number"
          placeholder="e.g. 14"
          value={form.experience}
          onChange={(e) => onChange("experience", e.target.value)}
          onBlur={() => onBlur("experience")}
          error={touched.experience && !!errors.experience}
          helperText={touched.experience && errors.experience}
          // inputProps={{ min: 0, step: 1 }}
        />

        <Divider />

        <FormControl fullWidth size="small" error={touched.govtIdType && !!errors.govtIdType} required>
          <InputLabel>Government ID Type</InputLabel>
          <Select
            label="Government ID Type"
            value={form.govtIdType}
            onChange={(e) => onChange("govtIdType", e.target.value)}
            onBlur={() => onBlur("govtIdType")}
          >
            {GOVT_ID_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
          {touched.govtIdType && errors.govtIdType && <FormHelperText>{errors.govtIdType}</FormHelperText>}
        </FormControl>

        <GovtIdUpload
          value={form.govtIdFile}
          error={touched.govtIdFile ? errors.govtIdFile : undefined}
          onChange={(f) => { onChange("govtIdFile", f); setTouched((p) => ({ ...p, govtIdFile: true })); }}
        />

        {submitting && <LinearProgress sx={{ borderRadius: 1 }} />}

        <Button
          onClick={onSubmit}
          disabled={submitting || submitted}
          variant="contained"
          size="large"
          disableElevation
          endIcon={<ArrowRight size={16} />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 15,
            py: 1.4,
            "&.Mui-disabled": { opacity: 0.65 },
          }}
        >
          {submitting ? "Saving…" : submitted ? "Redirecting…" : "Save & Continue"}
        </Button>
      </Box>

      <Typography sx={{ textAlign: "center", mt: 3, fontSize: 12, color: "text.disabled" }}>
        Having issues? Contact <strong>talent@yourcompany.com</strong>
      </Typography>
    </>
  );
}

// ─── Screen 2: Instructions ───────────────────────────────────────────────────

function InstructionsScreen({
  payload,
  form,
  onStart,
}: {
  payload: TokenPayload;
  form: FormValues;
  onStart: () => void;
}) {
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 3.5 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: "50%", bgcolor: "primary.main", mb: 1.5 }}>
          <ShieldCheck size={24} color="#fff" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Test Instructions</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          Read carefully before beginning your assessment
        </Typography>
      </Box>

      <Stepper step={1} />

      {/* Candidate summary card */}
      <Box
        sx={{
          bgcolor: "primary.main",
          borderRadius: 3,
          p: "20px 24px",
          mb: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", right: -24, top: -24, width: 120, height: 120, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)" }} />
        <Box sx={{ position: "absolute", right: 16, bottom: -40, width: 90, height: 90, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />
        <Typography sx={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", mb: 0.5 }}>
          Candidate
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#fff", mb: 0.25 }}>{form.name || payload.name}</Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.72)", mb: 1.25 }}>{form.email || payload.email}</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={`${payload.tier} Role`}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 500, fontSize: 11, border: "1px solid rgba(255,255,255,0.25)", height: 24 }}
          />
          <Chip
            label={`${form.experience || payload.experience.replace(/[^0-9]/g, "")} yrs experience`}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 500, fontSize: 11, border: "1px solid rgba(255,255,255,0.25)", height: 24 }}
          />
        </Box>
      </Box>

      {/* Test overview */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, md: 3.5 },
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Duration + role banner */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              p: "12px 14px",
              borderRadius: 2,
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: "action.selected", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Clock size={17} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>Duration</Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>1 Hour</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              p: "12px 14px",
              borderRadius: 2,
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: "action.selected", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CheckCircle2 size={17} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>Test level</Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{payload.tier}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Category table */}
        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled", mb: 1.5 }}>
            Assessment categories
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {ASSESSMENT_CATEGORIES.map((cat) => (
              <Box
                key={cat.name}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: "10px 12px",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.35 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{cat.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>·</Typography>
                    <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>{cat.full}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.5 }}>{cat.desc}</Typography>
                </Box>
                <Box
                  component="span"
                  sx={{
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    px: 1.25,
                    py: 0.4,
                    borderRadius: 10,
                    bgcolor: cat.pillBg,
                    color: cat.pillColor,
                    mt: 0.25,
                  }}
                >
                  {cat.weight}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Total */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1, pt: 1.25, borderTop: "1px solid", borderColor: "divider" }}>
            <Typography sx={{ fontSize: 12, color: "text.secondary", mr: 1 }}>Total weightage</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>100%</Typography>
          </Box>
        </Box>
      </Box>

      {/* Proctoring */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, md: 3.5 },
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <ShieldCheck size={16} />
          <Typography sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled" }}>
            Proctoring instructions
          </Typography>
        </Box>

        <Alert
          severity="warning"
          icon={<AlertTriangle size={16} />}
          sx={{ borderRadius: 2, mb: 2, fontSize: 13, "& .MuiAlert-message": { fontSize: 13 } }}
        >
          Violations detected by the proctoring system may result in immediate test termination and disqualification.
        </Alert>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.25 }}>
          {PROCTORING_RULES.map((rule) => (
            <Box
              key={rule.title}
              sx={{
                display: "flex",
                gap: 1.25,
                p: "10px 12px",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1.5,
                  bgcolor: rule.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  mt: 0.25,
                }}
              >
                <rule.icon size={14} color={rule.color} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, mb: 0.25 }}>{rule.title}</Typography>
                <Typography sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.55 }}>{rule.desc}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Agreement + Start */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 3, md: 3.5 },
        }}
      >
        <Box
          onClick={() => setAgreed(!agreed)}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            cursor: "pointer",
            mb: 2.5,
            p: "12px 14px",
            borderRadius: 2,
            border: "1px solid",
            borderColor: agreed ? "primary.main" : "divider",
            bgcolor: agreed ? "action.selected" : "transparent",
            transition: "all 0.15s",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: 0.75,
              border: "2px solid",
              borderColor: agreed ? "primary.main" : "text.disabled",
              bgcolor: agreed ? "primary.main" : "transparent",
              flexShrink: 0,
              mt: 0.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            {agreed && <X size={11} color="#fff" strokeWidth={3} />}
          </Box>
          <Typography sx={{ fontSize: 13, color: "text.primary", lineHeight: 1.6 }}>
            I have read and understood all the instructions. I agree to the proctoring conditions and confirm that I will not use any unfair means during the assessment.
          </Typography>
        </Box>

        <Button
          onClick={onStart}
          disabled={!agreed}
          variant="contained"
          size="large"
          fullWidth
          disableElevation
          endIcon={<ArrowRight size={16} />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 15,
            py: 1.4,
            "&.Mui-disabled": { opacity: 0.45 },
          }}
        >
          Begin Assessment
        </Button>
      </Box>

      <Typography sx={{ textAlign: "center", mt: 3, fontSize: 12, color: "text.disabled" }}>
        Having issues? Contact <strong>talent@yourcompany.com</strong>
      </Typography>
    </>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

function CandidateRegistrationPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [screen, setScreen] = useState<"register" | "instructions">("register");
  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [tokenError, setTokenError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormValues>({
    name: "", email: "", phone: "", experience: "", govtIdType: "", govtIdFile: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setTokenError(true); return; }
    const decoded = decodeToken(token);
    if (!decoded) { setTokenError(true); return; }
    setPayload(decoded);
    setForm((prev) => ({
      ...prev,
      name: decoded.name,
      email: decoded.email,
      experience: decoded.experience, // token now sends raw number e.g. "5"
    }));
  }, [params]);

  const handleChange = (field: keyof FormValues, value: string | File | null) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      const e = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: e[field] }));
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const e = validate(form);
    setErrors((prev) => ({ ...prev, [field]: e[field] }));
  };

  const handleSubmit = async () => {
    const allTouched = { name: true, email: true, phone: true, experience: true, govtIdType: true, govtIdFile: true };
    setTouched(allTouched);
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1000));
    setSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setScreen("instructions");
    }, 800);
  };

  const handleStart = () => {
    const token = params.get("token") ?? "";
    router.push(`/assessment/test?token=${token}`);
  };

  if (tokenError) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default", p: 3 }}>
        <Box sx={{ maxWidth: 420, textAlign: "center" }}>
          <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
            This registration link is invalid or has expired.
          </Alert>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            Please contact <strong>talent@yourcompany.com</strong> for a new invite.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!payload) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 5, px: 2 }}>
      <Box sx={{ maxWidth: 560, mx: "auto" }}>
        {screen === "register" ? (
          <RegistrationScreen
            form={form}
            errors={errors}
            touched={touched}
            submitting={submitting}
            submitted={submitted}
            onChange={handleChange}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            setTouched={setTouched}
          />
        ) : (
          <InstructionsScreen
            payload={payload}
            form={form}
            onStart={handleStart}
          />
        )}
      </Box>
    </Box>
  );
}

export default function Page() {
  return (
    <Suspense>
      <CandidateRegistrationPage />
    </Suspense>
  );
}