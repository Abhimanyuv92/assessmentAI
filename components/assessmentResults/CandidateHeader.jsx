import { Box, Typography, Chip } from "@mui/material";

function CircularScore({ value }) {
  const size = 80;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e9ecef"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a56db"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <Typography
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: 700,
          fontSize: 17,
          color: "#1a56db",
        }}
      >
        {value}%
      </Typography>
    </Box>
  );
}

const metrics = [
  { label: "Attitude", value: "78%" },
  { label: "Behavioral", value: "71%" },
  { label: "Psychometric", value: "—" },
  { label: "Communication", value: "82%" },
];

export default function CandidateHeader() {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2.5,
        mb: 2,
        bgcolor: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 3,
      }}
    >
      {/* Circular Score */}
      <CircularScore value={77} />

      {/* Name & Modules */}
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#1a1a2e" }}>
          Rohan Sinha — Senior level
        </Typography>
        <Typography sx={{ fontSize: 12.5, color: "#888", mb: 1.5 }}>
          All 3 modules completed · 36 questions evaluated
        </Typography>

        {/* Metrics row */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {metrics.map(({ label, value }) => (
            <Box key={label}>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#222" }}>
                {value}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#999" }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Senior Tier + Benchmark */}
      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        <Chip
          label="Senior tier"
          size="small"
          sx={{
            bgcolor: "#e8f0fe",
            color: "#1a56db",
            fontWeight: 600,
            fontSize: 12,
            mb: 0.8,
          }}
        />
        <Typography sx={{ fontSize: 12, color: "#888" }}>
          Benchmarked against
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#888" }}>142 peers</Typography>
      </Box>
    </Box>
  );
}
