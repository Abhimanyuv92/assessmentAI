import useAssessmentEngine from "./useAssessmentEngine";
import { Tabs, Tab, Box } from "@mui/material";
import { assessmentModules } from "./assessmentData";

export default function ModuleTabs() {
  const engine = useAssessmentEngine();
  const activeModule = engine.currentModule.id;

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={activeModule}>
        {assessmentModules.map((module) => (
          <Tab
            key={module.id}
            label={module.name}
            value={module.id}
            onClick={() => engine.goToModule(module)}
          />
        ))}
      </Tabs>
    </Box>
  );
}