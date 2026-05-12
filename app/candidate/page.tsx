"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import AuthGuard from "../components/AuthGuard";
import { assessments } from "../data/assessments";
import { Typography } from "@mui/material";

function Candidate() {

  const assessment = assessments[0];

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const selectAnswer = (qid: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [qid]: option
    }));
  };

  return (
    <>
      <h1>{assessment.title}</h1>

      {assessment.questions.map(q=>(
        <div key={q.id}>
          <p>{q.question}</p>

          {q.options.map(opt=>(
            <button
              key={opt}
              onClick={()=>selectAnswer(q.id,opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ))}
      <button
 onClick={()=>{

   let score=0;

   assessment.questions.forEach(q=>{
     if(answers[q.id]===q.correctAnswer){
       score++;
     }
   });

   alert(`Score: ${score}/${assessment.questions.length}`);

 }}
>
Submit Test
</button>
    </>
  );
}

export default function CandidatePage() {
  return (
    <AuthGuard role="candidate">
      <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", px: 3 }}>
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          Candidate View
        </Typography>
      </Box>
    </AuthGuard>
  );
}