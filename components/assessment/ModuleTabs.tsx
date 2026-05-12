import { useAssessmentStore } from "@/lib/useAssessmentStore";
import { Tabs, Tab, Box } from "@mui/material";
import { assessmentModules } from "./assessmentData";

export default function ModuleTabs() {
  const { currentIndex, questions, jumpToModule } =
    useAssessmentStore() as any;

  const activeModule =
    questions[currentIndex].moduleId;

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={activeModule}>
        {assessmentModules.map((module) => (
          <Tab
            key={module.id}
            label={module.title}
            value={module.id}
            onClick={() => jumpToModule(module.id)}
          />
        ))}
      </Tabs>
    </Box>
  );
}