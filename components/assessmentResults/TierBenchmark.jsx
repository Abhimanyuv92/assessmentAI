import { Box, Typography, LinearProgress } from "@mui/material";

const benchmarks = [
  { label: "Attitude", score: 78, avg: 72 },
  { label: "Behavioral", score: 71, avg: 68 },
  { label: "Communication", score: 82, avg: 74 },
];

export default function TierBenchmark() {
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
        Tier Benchmark
      </Typography>

      {benchmarks.map(({ label, score, avg }) => (
        <Box key={label} sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
            <Typography sx={{ fontSize: 13, color: "#333" }}>{label}</Typography>
            <Typography sx={{ fontSize: 12, color: "#555" }}>
              <Box component="span" sx={{ fontWeight: 700 }}>
                {score}%
              </Box>{" "}
              vs {avg}% avg
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={score}
            sx={{
              height: 7,
              borderRadius: 4,
              bgcolor: "#e9ecef",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#1a56db",
                borderRadius: 4,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
