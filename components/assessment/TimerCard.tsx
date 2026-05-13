import { Paper, Typography } from "@mui/material";

export default function TimerCard() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2">
        TIME ELAPSED
      </Typography>

      <Typography sx={{ fontSize: 28, fontWeight: 700, mt: 1 }}>
        02:34
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Estimated remaining: ~38 min
      </Typography>
    </Paper>
  );
}