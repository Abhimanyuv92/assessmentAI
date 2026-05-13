"use client";

// app/assessment/instructions/page.tsx
// Route: /assessment/instructions?token=<base64url>

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import {
  AlertTriangle,
  Clock,
  EyeOff,
  MonitorOff,
  ShieldAlert,
  Wifi,
  BrainCircuit,
  CheckCheck,
  ChevronRight,
} from "lucide-react";

// ─── Rule definitions ──────────────────────────────────────────────────────────

const RULES = [
  {
    icon: <MonitorOff size={20} />,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    title: "Do not switch tabs",
    description:
      "Navigating away from this window — even briefly — is detected automatically. Each violation deducts 5 points from your final score.",
  },
  {
    icon: <EyeOff size={20} />,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    title: "Do not minimise the window",
    description:
      "Minimising or hiding the browser window is treated the same as switching tabs. Keep this window maximised and in focus at all times.",
  },
  {
    icon: <BrainCircuit size={20} />,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    title: "No AI tools or assistance",
    description:
      "Using ChatGPT, Copilot, Gemini, or any AI-assisted tool during the test is strictly prohibited and grounds for immediate disqualification.",
  },
  {
    icon: <ShieldAlert size={20} />,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    title: "No external resources",
    description:
      "You may not refer to books, notes, websites, or seek help from another person. The test measures your own knowledge and problem-solving.",
  },
  {
    icon: <Wifi size={20} />,
    color: "#0F63FF",
    bg: "rgba(15,99,255,0.08)",
    title: "Stable internet required",
    description:
      "Ensure you have a stable connection before starting. Connectivity issues may cause your progress to be lost.",
  },
  {
    icon: <Clock size={20} />,
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    title: "Complete in one sitting",
    description:
      "Once the test begins, the timer cannot be paused. Complete the entire assessment without breaks.",
  },
];

const SCORE_DEDUCTIONS = [
  { action: "Tab switch / window blur",   deduction: "−5 pts per occurrence" },
  { action: "Minimise window",            deduction: "−5 pts per occurrence" },
  { action: "AI tool detected",           deduction: "Disqualification"       },
  { action: "Unanswered questions",       deduction: "0 pts (no negatives)"   },
];

// ─── Page component ────────────────────────────────────────────────────────────

function AssessmentInstructionsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [acknowledged, setAcknowledged] = useState(false);
  const [attemptedStart, setAttemptedStart] = useState(false);

  const handleStart = () => {
    setAttemptedStart(true);
    if (!acknowledged) return;
    const token = params.get("token") ?? "";
    router.push(`/assessment/test?token=${token}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F4F6F9", py: 5, px: 2 }}>
      <Box sx={{ maxWidth: 680, mx: "auto" }}>

        {/* Progress bar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
          {["Registration", "Instructions", "Assessment"].map((step, i) => (
            <Box key={step} sx={{ flex: 1, textAlign: "center" }}>
              <Box sx={{ height: 4, borderRadius: 2, bgcolor: i <= 1 ? "#0F63FF" : "#e0e0e0", mb: 0.5 }} />
              <Typography sx={{ fontSize: 11, color: i <= 1 ? "#0F63FF" : "text.disabled", fontWeight: i <= 1 ? 700 : 400 }}>
                {step}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Page title */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(239,68,68,0.1)", mb: 2 }}>
            <AlertTriangle size={26} color="#EF4444" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a1a2e", mb: 0.5 }}>
            Assessment Instructions
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Please read all rules carefully before you begin. Violations are monitored automatically.
          </Typography>
        </Box>

        {/* Warning banner */}
        <Alert
          severity="warning"
          icon={<AlertTriangle size={18} />}
          sx={{ borderRadius: 2, mb: 3, fontWeight: 500, fontSize: 13.5 }}
        >
          This assessment is proctored. Tab switches, minimising the window, and AI tool usage
          are detected in real time and will deduct points from your score.
        </Alert>

        {/* Rules grid */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.07)",
            p: 3.5,
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            mb: 3,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e", mb: 2.5 }}>
            📋 Rules & Guidelines
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {RULES.map((rule, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "rgba(0,0,0,0.06)",
                  bgcolor: "#FAFBFC",
                  transition: "border-color 0.2s",
                  "&:hover": { borderColor: rule.color + "55" },
                }}
              >
                <Box
                  sx={{
                    width: 40, height: 40, borderRadius: 2,
                    bgcolor: rule.bg, color: rule.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {rule.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: "#1a1a2e", mb: 0.3 }}>
                    {rule.title}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                    {rule.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Score deduction table */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.07)",
            p: 3.5,
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            mb: 3,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e", mb: 2 }}>
            📉 Score Deduction Policy
          </Typography>

          <Box sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
            {/* Table header */}
            <Box sx={{ display: "flex", bgcolor: "#F4F6F9", px: 2.5, py: 1.2 }}>
              <Typography sx={{ flex: 1, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Action
              </Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Consequence
              </Typography>
            </Box>
            <Divider />
            {SCORE_DEDUCTIONS.map((row, i) => (
              <Box key={i}>
                <Box sx={{ display: "flex", alignItems: "center", px: 2.5, py: 1.5, "&:hover": { bgcolor: "#FAFBFC" } }}>
                  <Typography sx={{ flex: 1, fontSize: 13.5, color: "#333" }}>{row.action}</Typography>
                  <Typography
                    sx={{
                      fontSize: 13, fontWeight: 700,
                      color: row.deduction.startsWith("−") ? "#EF4444" : row.deduction === "Disqualification" ? "#7C3AED" : "#10B981",
                    }}
                  >
                    {row.deduction}
                  </Typography>
                </Box>
                {i < SCORE_DEDUCTIONS.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Acknowledgement + CTA */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.07)",
            p: 3.5,
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                sx={{ color: "#0F63FF", "&.Mui-checked": { color: "#0F63FF" } }}
              />
            }
            label={
              <Typography sx={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>
                I have read and understood all the instructions. I agree to follow the rules
                and acknowledge that violations will result in score deductions or disqualification.
              </Typography>
            }
            sx={{ alignItems: "flex-start", mb: 2 }}
          />

          {attemptedStart && !acknowledged && (
            <Alert severity="error" sx={{ borderRadius: 1.5, mb: 2, fontSize: 13 }}>
              You must accept the terms before starting the assessment.
            </Alert>
          )}

          <Button
            onClick={handleStart}
            variant="contained"
            size="large"
            endIcon={<ChevronRight size={18} />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              bgcolor: acknowledged ? "#0F63FF" : "#9CA3AF",
              fontWeight: 700,
              fontSize: 15,
              py: 1.4,
              width: "100%",
              "&:hover": { bgcolor: acknowledged ? "#0B54D6" : "#9CA3AF" },
            }}
          >
            I Understand — Start Assessment
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.8, mt: 2 }}>
            <CheckCheck size={14} color="#10B981" />
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              Your activity is monitored for the duration of this test
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ textAlign: "center", mt: 3, fontSize: 12, color: "text.disabled" }}>
          Having issues? Contact <strong>talent@yourcompany.com</strong>
        </Typography>

      </Box>
    </Box>
  );
}

export default function Page() {
  return (
    <Suspense>
      <AssessmentInstructionsPage />
    </Suspense>
  );
}