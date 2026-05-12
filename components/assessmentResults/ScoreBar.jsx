import { Box, Typography } from "@mui/material";

const colorMap = {
  "Growth mindset": "#1a56db",
  Resilience: "#2e7d32",
  "Openness to feedback": "#7b1fa2",
  "Professional maturity": "#e65100",
  "Collaborative drive": "#1565c0",
  "Conflict resolution": "#c62828",
};

export default function ScoreBar({ dimension, score }) {
  const color = colorMap[dimension] || "#1a56db";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1.2,
        borderBottom: "1px solid #f0f0f0",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Typography
        sx={{ width: 180, fontSize: 13.5, color: "#333", flexShrink: 0 }}
      >
        {dimension}
      </Typography>

      <Box sx={{ flex: 1, mx: 2, position: "relative" }}>
        {/* Background track */}
        <Box
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: "#e9ecef",
            overflow: "hidden",
          }}
        >
          {/* Filled bar */}
          <Box
            sx={{
              height: "100%",
              width: `${score}%`,
              bgcolor: color,
              borderRadius: 5,
              transition: "width 0.8s ease",
            }}
          />
        </Box>
      </Box>

      <Typography
        sx={{ width: 40, textAlign: "right", fontWeight: 600, fontSize: 13.5, color: "#333" }}
      >
        {score}%
      </Typography>
    </Box>
  );
}
