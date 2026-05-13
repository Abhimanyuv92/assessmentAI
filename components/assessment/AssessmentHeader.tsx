// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Tabs,
//   Tab,
//   Box,
// } from "@mui/material";
// import { useState } from "react";

// export default function AssessmentHeader() {
//   const [tab, setTab] = useState(0);

//   return (
//     <>
//       <AppBar position="static" color="inherit" elevation={1}>
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           <Typography fontWeight={600}>
//             Attitude Assessment
//           </Typography>

//           <Box>
//             <Button variant="outlined" sx={{ mr: 1 }}>
//               Save draft
//             </Button>
//             <Button variant="contained">
//               Next question
//             </Button>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Tabs
//         value={tab}
//         onChange={(_, v) => setTab(v)}
//         sx={{ px: 2, bgcolor: "white" }}
//       >
//         <Tab label="Overview" />
//         <Tab label="Candidates 24" />
//         <Tab label="Active Sessions 6" />
//         <Tab label="Analytics" />
//         <Tab label="Export" />
//       </Tabs>
//     </>
//   );
// }

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  LinearProgress,
} from "@mui/material";
import useAssessmentEngine from "./useAssessmentEngine";

type AssessmentEngine = ReturnType<typeof useAssessmentEngine>;

export default function AssessmentHeader({ engine }: { engine: AssessmentEngine }) {
  return (
    <>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography sx={{fontWeight:600}}>
           Assessment
          </Typography>

          <Box sx={{display:"flex",gap:2}}>
            {/* <Button variant="outlined" sx={{ mr: 1 }}>
              Save Draft
            </Button> */}
            <Button
              variant="contained"
              onClick={engine.prevQuestion}
              size="small"
            >
              Prev Question
            </Button>
            <Button
              variant="contained"
              onClick={engine.nextQuestion}
              size="small"
            >
              Next Question
            </Button>
          </Box>
        </Toolbar>

        {/* FULL WIDTH PROGRESS BAR
        <LinearProgress
          variant="determinate"
          value={engine.progress}
          sx={{ height: 6 }}
        /> */}
      </AppBar>
    </>
  );
}