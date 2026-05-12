import { Box, Typography } from "@mui/material";

const comparisons = [
  { label: "vs. peer avg", value: "+5%", color: "#2e7d32" },
  { label: "vs. dept avg", value: "+3%", color: "#2e7d32" },
  { label: "Percentile", value: "72nd", color: "#1a56db" },
];

export default function ComparisonToAvg() {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
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
        Comparison to Avg
      </Typography>

      {comparisons.map(({ label, value, color }) => (
        <Box
          key={label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#555" }}>{label}</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color }}>{value}</Typography>
        </Box>
      ))}
    </Box>
  );
}
