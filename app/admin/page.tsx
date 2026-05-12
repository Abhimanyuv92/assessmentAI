"use client";

import { useState } from "react";
import AuthGuard from "../components/AuthGuard";
import { Box } from "@mui/material";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import AdminModuleTabs from "../../components/admin/AdminModuleTabs";
import AdminDashboard from "../../components/admin/AdminDashboard";
import AdminDashboardCandidateList from "@/components/admin/AdminDashboardCandidateListLatest";
import AssessmentPage from "@/components/assessment/AssessmentPage";
import AssessmentResultsPage from "@/components/assessmentResults/AssessmentResultsPage";
import ViewYesterdayCandidates from "@/components/admin/ViewYesterdayCandidates";
import CandidateCalendarView from "@/components/admin/CandidateCalendarView";
import AddNewCandidate from "@/components/admin/AddNewCandidate";

function Admin() {
  const [activeScreen, setActiveScreen] = useState("dashboard");

  return (
    <AuthGuard role="admin">
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F4F6F9" }}>
        <AdminSidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* <AdminModuleTabs /> */}
          {activeScreen === "dashboard" && <AdminDashboard />}
          {activeScreen === "candidates" && <AdminDashboardCandidateList />}
          {activeScreen === "assessments" && <AssessmentPage />}
          {activeScreen==="viewYesterCandidates" && <ViewYesterdayCandidates />}
          {activeScreen==="addNewCandidate" && <AddNewCandidate />}
          {activeScreen==="viewHistoricalData" && <CandidateCalendarView />}
        </Box>
      </Box>
    </AuthGuard>
  );
}

export default Admin;