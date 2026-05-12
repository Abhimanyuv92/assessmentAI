import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Badge,
  AppBar,
  Toolbar,
  InputBase,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useState } from "react";

import CandidateHeader from "./CandidateHeader";
import ScoreDistribution from "./ScoreDistribution";
import KeyInsights from "./KeyInsights";
import TierBenchmark from "./TierBenchmark";
import RecommendedActions from "./RecommendedActions";
import ComparisonToAvg from "./ComparisonToAvg";

export default function AssessmentResultsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ bgcolor: "#f4f6f9", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* Top AppBar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "#fff", borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "52px !important", px: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#333" }}>
            Assessment Results
          </Typography>

          {/* Search */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: 1,
              px: 1.5,
              py: 0.4,
              bgcolor: "#fafafa",
              width: 260,
            }}
          >
            <SearchIcon sx={{ fontSize: 16, color: "#aaa", mr: 1 }} />
            <InputBase
              placeholder="Search candidates, modules..."
              sx={{ fontSize: 13, color: "#555", flex: 1 }}
            />
          </Box>
        </Toolbar>

        {/* Tabs */}
        <Box sx={{ borderBottom: "1px solid #e0e0e0", px: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              minHeight: 42,
              "& .MuiTab-root": { minHeight: 42, fontSize: 13, textTransform: "none", fontWeight: 500 },
              "& .MuiTabs-indicator": { bgcolor: "#1a56db" },
              "& .Mui-selected": { color: "#1a56db !important" },
            }}
          >
            <Tab label="Overview" />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>Candidates <Badge badgeContent={24} sx={{ "& .MuiBadge-badge": { bgcolor: "#1a56db", color: "#fff", fontSize: 10, height: 18, minWidth: 18 } }} /></Box>} />
            <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>Active Sessions <Badge badgeContent={6} sx={{ "& .MuiBadge-badge": { bgcolor: "#555", color: "#fff", fontSize: 10, height: 18, minWidth: 18 } }} /></Box>} />
            <Tab label="Analytics" />
            <Tab label="Export" />
          </Tabs>
        </Box>
      </AppBar>

      {/* Content */}
      <Box sx={{ px: 3, pt: 2.5, maxWidth: 1400, mx: "auto" }}>
        {/* Page Header Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              size="small"
              sx={{
                textTransform: "none",
                borderColor: "#ddd",
                color: "#555",
                fontSize: 13,
                "&:hover": { borderColor: "#bbb" },
              }}
            >
              Back
            </Button>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#1a1a2e" }}>
              Assessment Results
            </Typography>
            <Box
              sx={{
                bgcolor: "#e6f4ea",
                color: "#2e7d32",
                fontSize: 12,
                fontWeight: 600,
                px: 1.2,
                py: 0.3,
                borderRadius: 1,
              }}
            >
              Completed
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<PrintIcon />}
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", borderColor: "#ddd", color: "#555", fontSize: 13 }}
            >
              Print
            </Button>
            <Button
              startIcon={<ShareIcon />}
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", borderColor: "#ddd", color: "#555", fontSize: 13 }}
            >
              Share
            </Button>
            <Button
              startIcon={<PictureAsPdfIcon />}
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                bgcolor: "#1a56db",
                fontSize: 13,
                "&:hover": { bgcolor: "#1648c0" },
              }}
            >
              Export PDF
            </Button>
          </Box>
        </Box>

        {/* Main two-column layout */}
        <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start" }}>
          {/* Left main column */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CandidateHeader />
            <ScoreDistribution />
            <KeyInsights />
          </Box>

          {/* Right sidebar */}
          <Box sx={{ width: 270, flexShrink: 0 }}>
            <TierBenchmark />
            <RecommendedActions />
            <ComparisonToAvg />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
