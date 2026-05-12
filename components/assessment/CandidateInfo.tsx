import { Paper, Typography, Avatar, Box, LinearProgress } from "@mui/material";

export default function CandidateInfo() {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2">
        CANDIDATE INFO
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mt={2}>
        <Avatar>RS</Avatar>
        <Box>
          <Typography fontWeight={600}>Rohan Sinha</Typography>
          <Typography variant="caption">
            Senior · Engineering
          </Typography>
        </Box>
      </Box>

      <Typography mt={2} variant="caption">
        Session progress
      </Typography>

      <LinearProgress sx={{ mt: 1 }} variant="determinate" value={25} />

      <Typography variant="caption">1 of 4 modules</Typography>
    </Paper>
  );
}