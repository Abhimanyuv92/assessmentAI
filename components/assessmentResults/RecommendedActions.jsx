import { Box, Typography } from "@mui/material";

const actions = [
  { label: "Shortlist for Lead-level assessment track", color: "#1a56db" },
  { label: "Enroll in conflict resolution workshop", color: "#e65100" },
  { label: "Schedule psychometric for complete profile", color: "#2e7d32" },
];

export default function RecommendedActions() {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        mb: 2,
        bgcolor: "#fff",
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          color: "#888",
          mb: 1.5,
          textTransform: "uppercase",
        }}
      >
        Recommended Actions
      </Typography>

      {actions.map(({ label, color }) => (
        <Box key={label} sx={{ display: "flex", alignItems: "flex-start", mb: 1.2 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: color,
              flexShrink: 0,
              mt: "2px",
              mr: 1.2,
              opacity: 0.85,
            }}
          />
          <Typography sx={{ fontSize: 13, color: "#333", lineHeight: 1.4 }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
