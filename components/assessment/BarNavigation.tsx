import useAssessmentEngine from "./useAssessmentEngine";
import { Box, Button } from "@mui/material";

export default function NavigationBar() {
  const engine = useAssessmentEngine();
  const { nextQuestion, prevQuestion, currentIndex, totalQuestions } = engine;

  const isLast = currentIndex === totalQuestions - 1;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mt: 3,
      }}
    >
      <Button onClick={prevQuestion}>Previous</Button>

      <Button
        variant="contained"
        onClick={nextQuestion}
      >
        {isLast ? "Finish" : "Next Question"}
      </Button>
    </Box>
  );
}