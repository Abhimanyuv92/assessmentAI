// import { Paper, Typography, Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
// import OptionItem from "./OptionItem";

// export default function QuestionCard({ module }) {
//   const question = module.questions[0];


//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 3,
//         borderRadius: 3,
//         border: "1px solid #e5e7eb",
//       }}
//     >
//       <Typography variant="caption" color="primary">
//         {module.name.toUpperCase()} · QUESTION 1
//       </Typography>

//       <Typography sx={{mt:1,mb:3,fontSize:18,fontWeight:500}}>
//         {question.text}
//       </Typography>

//       <Box  sx={{display:"flex", flexDirection:"column", gap:2}}>
//          <RadioGroup
//             name={question.id}
//         >
//               {question.options.map((opt, i) => (
//           <OptionItem key={i} label={opt} questionId={question.id} />
//         ))}
//             {/* <FormControlLabel value="female" control={<Radio />} label="Female" />
//             <FormControlLabel value="male" control={<Radio />} label="Male" />
//             <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
//         </RadioGroup>
      
//       </Box>
//     </Paper>
//   );
// }

import {
  Paper,
  Typography,
  Box,
  RadioGroup,
} from "@mui/material";

import OptionItem from "./OptionItem";
import useAssessmentEngine from "./useAssessmentEngine";

type AssessmentEngine = ReturnType<typeof useAssessmentEngine>;

export default function QuestionCard({ engine }: { engine: AssessmentEngine }) {

  const q = engine.currentQuestion;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
      }}
    >
      <Typography variant="caption" color="primary">
        {engine.currentModule.name.toUpperCase()} ·
        QUESTION {engine.currentIndex + 1}
      </Typography>

      <Typography sx={{ mt: 1, mb: 3, fontSize: 18, fontWeight: 500 }}>
        {q.text}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <RadioGroup name={String(q.id)}>
          {q.options.map((opt, i) => (
            <OptionItem
              key={i}
              label={opt}
              questionId={String(q.id)}
            />
          ))}
        </RadioGroup>
      </Box>
    </Paper>
  );
}