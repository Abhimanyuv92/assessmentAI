import { Box, Typography } from "@mui/material";
import ScoreBar from "./ScoreBar";

const dimensions = [
  { dimension: "Growth mindset", score: 82 },
  { dimension: "Resilience", score: 75 },
  { dimension: "Openness to feedback", score: 70 },
  { dimension: "Professional maturity", score: 79 },
  { dimension: "Collaborative drive", score: 78 },
  { dimension: "Conflict resolution", score: 66 },
];

export default function ScoreDistribution() {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2.5,
        mb: 2,
        bgcolor: "#fff",
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pb: 1,
          borderBottom: "2px solid #f0f0f0",
          mb: 0.5,
        }}
      >
        <Typography
          sx={{ width: 180, fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.8 }}
        >
          Dimension
        </Typography>
        <Typography
          sx={{ flex: 1, mx: 2, fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.8 }}
        >
          Score Distribution
        </Typography>
        <Typography
          sx={{ width: 40, textAlign: "right", fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.8 }}
        >
          Score
        </Typography>
      </Box>

      {dimensions.map((d) => (
        <ScoreBar key={d.dimension} {...d} />
      ))}
    </Box>
  );
}
