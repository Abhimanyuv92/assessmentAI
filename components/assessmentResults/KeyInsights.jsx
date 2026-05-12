import { Box, Typography } from "@mui/material";

export default function KeyInsights() {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      {/* Key Strength */}
      <Box
        sx={{
          flex: 1,
          border: "1px solid #c8e6c9",
          borderLeft: "4px solid #2e7d32",
          borderRadius: 2,
          p: 2,
          bgcolor: "#f9fbe7",
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#2e7d32",
            mb: 1,
            textTransform: "uppercase",
          }}
        >
          Key Strength
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: "#333", lineHeight: 1.6 }}>
          Demonstrates strong growth mindset and consistently reframes setbacks as
          learning opportunities. Above 85th percentile in resilience measures.
        </Typography>
      </Box>

      {/* Development Area */}
      <Box
        sx={{
          flex: 1,
          border: "1px solid #ffe0b2",
          borderLeft: "4px solid #e65100",
          borderRadius: 2,
          p: 2,
          bgcolor: "#fff8e1",
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#e65100",
            mb: 1,
            textTransform: "uppercase",
          }}
        >
          Development Area
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: "#333", lineHeight: 1.6 }}>
          Conflict escalation timing and proactive feedback-seeking patterns indicate
          opportunity for structured coaching in peer influence skills.
        </Typography>
      </Box>
    </Box>
  );
}
