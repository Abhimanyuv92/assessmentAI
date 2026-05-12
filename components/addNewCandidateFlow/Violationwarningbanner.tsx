"use client";

// components/assessment/ViolationWarningBanner.tsx
//
// Drop this inside your test page and pass useProctoring() values as props.
// It renders a floating banner each time a violation is detected.

import { useEffect } from "react";
import { Alert, Box, Collapse, IconButton, Typography } from "@mui/material";
import { AlertTriangle, X } from "lucide-react";
import { ProctoringViolation } from "./useProctoring";

const MESSAGES: Record<string, string> = {
  tab_switch:
    "Tab switch detected! Returning to this tab is required. 5 points have been deducted.",
  window_blur:
    "Window focus lost! Keep this window active during the assessment. 5 points deducted.",
  window_minimize:
    "Window minimised! The assessment must remain visible at all times. 5 points deducted.",
  devtools:
    "Developer tools detected! This activity is not allowed. 5 points deducted.",
};

interface ViolationWarningBannerProps {
  violation: ProctoringViolation | null;
  totalViolations: number;
  currentScore: number;
  isVisible: boolean;
  onDismiss: () => void;
}

export default function ViolationWarningBanner({
  violation,
  totalViolations,
  currentScore,
  isVisible,
  onDismiss,
}: ViolationWarningBannerProps) {
  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [isVisible, violation, onDismiss]);

  return (
    <Collapse in={isVisible} unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: { xs: "calc(100vw - 32px)", sm: 540 },
          boxShadow: "0 8px 32px rgba(239,68,68,0.25)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Alert
          severity="error"
          icon={<AlertTriangle size={20} />}
          action={
            <IconButton size="small" color="inherit" onClick={onDismiss}>
              <X size={16} />
            </IconButton>
          }
          sx={{
            alignItems: "flex-start",
            bgcolor: "#FEF2F2",
            border: "1.5px solid #FECACA",
            borderRadius: 2,
            "& .MuiAlert-icon": { pt: "2px", color: "#DC2626" },
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: "#991B1B", mb: 0.3 }}>
            ⚠️ Integrity Violation Detected
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6 }}>
            {violation ? MESSAGES[violation.reason] : "A violation was detected."}
          </Typography>
          <Box sx={{ display: "flex", gap: 2.5, mt: 1 }}>
            <Box>
              <Typography sx={{ fontSize: 11, color: "#B91C1C", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Violations
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#DC2626" }}>
                {totalViolations}
              </Typography>
            </Box>
            <Box sx={{ width: "1px", bgcolor: "#FECACA" }} />
            <Box>
              <Typography sx={{ fontSize: 11, color: "#B91C1C", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Current Score
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: currentScore <= 50 ? "#DC2626" : "#D97706" }}>
                {currentScore}%
              </Typography>
            </Box>
            <Box sx={{ width: "1px", bgcolor: "#FECACA" }} />
            <Box>
              <Typography sx={{ fontSize: 11, color: "#B91C1C", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Deducted This Event
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#DC2626" }}>
                −5 pts
              </Typography>
            </Box>
          </Box>
        </Alert>
      </Box>
    </Collapse>
  );
}