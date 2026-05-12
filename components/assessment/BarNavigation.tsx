import { useAssessmentStore } from "@/lib/useAssessmentStore";
import { Box, Button } from "@mui/material";

export default function NavigationBar() {
  const {
    nextQuestion,
    prevQuestion,
    currentIndex,
    questions,
  } = useAssessmentStore();

  const isLast =
    currentIndex === questions.length - 1;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mt: 3,
      }}
    >
      <Button onClick={prevQuestion}>
        Previous
      </Button>

      <Button
        variant="contained"
        onClick={nextQuestion}
      >
        {isLast ? "Finish" : "Next Question"}
      </Button>
    </Box>
  );
}