// import { Box, Grid } from "@mui/material";
// import { useState } from "react";

// import AssessmentHeader from "./AssessmentHeader";
// import ModulesSidebar from "./ModulesSidebar";
// import QuestionCard from "./QuestionCard";
// import CandidateInfo from "./CandidateInfo";
// import TimerCard from "./TimerCard";

// import { assessmentModules } from "./assessmentData";

// export default function AssessmentPage() {
//   const [activeModule, setActiveModule] = useState(
//     assessmentModules[0]
//   );

//   return (
//     <Box sx={{ bgcolor: "#f6f7fb", minHeight: "100vh" }}>
//       <AssessmentHeader />

//       <Grid container sx={{ p: 2}} spacing={2}>
//         {/* QUESTION AREA */}
//         <Grid size={{ xs: 12, md: 9 }}>
//           <QuestionCard module={activeModule} />
//         </Grid>

//         {/* SIDEBAR */}
//         <Grid size={{ xs: 12, md: 3 }}>
//           <ModulesSidebar
//             modules={assessmentModules}
//             activeModule={activeModule}
//             onSelect={setActiveModule}
//           />

//           <CandidateInfo />
//           <TimerCard />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

import { Box, Grid, LinearProgress } from "@mui/material";

import AssessmentHeader from "./AssessmentHeader";
import ModulesSidebar from "./ModulesSidebar";
import QuestionCard from "./QuestionCard";
import CandidateInfo from "./CandidateInfo";
import TimerCard from "./TimerCard";

import useAssessmentEngine from "./useAssessmentEngine";

export default function AssessmentPage({selectedModule}:{selectedModule?:string}) {

  const engine = useAssessmentEngine();

  return (
    <Box sx={{ bgcolor: "#f6f7fb", minHeight: "100vh" }}>

      <AssessmentHeader engine={engine} />

      <Grid container sx={{ p: 2 }} spacing={2}>

        {/* QUESTION AREA */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* FULL WIDTH PROGRESS BAR */}
        <LinearProgress
          variant="determinate"
          value={engine.progress}
          sx={{ height: 4,mb:2 }}
        />
          <QuestionCard engine={engine} />
        </Grid>

        {/* SIDEBAR */}
        <Grid size={{ xs: 12, md: 3 }}>
          <ModulesSidebar
            modules={engine.modules}
            activeModule={selectedModule ? (engine.modules.find((m) => m.id === selectedModule) ?? engine.currentModule) : engine.currentModule}
            onSelect={engine.goToModule}
          />

          {/* <CandidateInfo />
          <TimerCard /> */}
        </Grid>
      </Grid>
    </Box>
  );
}