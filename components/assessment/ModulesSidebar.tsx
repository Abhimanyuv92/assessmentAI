import { Paper, Typography, Box } from "@mui/material";

type AssessmentModule = {
  id: string;
  name: string;
  questions: { id: number; text: string; options: string[] }[];
};

export default function ModulesSidebar({
  modules,
  activeModule,
  onSelect,
}: {
  modules: AssessmentModule[];
  activeModule: AssessmentModule;
  onSelect: (module: AssessmentModule) => void;
}) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        ASSESSMENT MODULES
      </Typography>

      {modules.map((module) => {
        const active = module.id === activeModule.id;

        return (
          <Box
            key={module.id}
            onClick={() => onSelect(module)}
            sx={{
              p: 1.5,
              cursor: "pointer",
              mb: 1,
              fontWeight: active ? 600 : 400,
              bgcolor: active ? "#eef3ff" : "transparent",
              borderLeft: active
                ? "1px solid #1976d2"
                : "1px solid transparent",

              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            {module.name}
          </Box>
        );
      })}
    </Paper>
  );
}