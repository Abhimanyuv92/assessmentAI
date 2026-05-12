import { Paper, Radio, Typography, Box, FormControlLabel } from "@mui/material";
import { useState } from "react";

export default function OptionItem({ label, questionId }: { label: string; questionId: string }) {
  const [selected, setSelected] = useState(false);

  return (
    <Paper
      onClick={() => setSelected(!selected)}
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        // selected
        //   ? "2px solid #1976d2"
        //   : "1px solid #e5e7eb",
        // transition: "0.2s",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
     <FormControlLabel control={<Radio />} id={`${questionId}-${label}`} label={label} value={label}/>
      {/* <Radio checked={selected} id={`${questionId}`} /> */}
      {/* <Typography>{label}</Typography> */}
    </Paper>
  );
}