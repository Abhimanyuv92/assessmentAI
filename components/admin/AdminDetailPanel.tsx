"use client";

import { Box, Typography, Avatar } from "@mui/material";
import { Check, Play, Mail } from "lucide-react";
import { Candidate } from "./AdminDataTable";

export default function AdminDetailPanel({candidate}: { candidate: Candidate }) {
  const modules = [
    { name: "Attitude", score: 85, status: "completed" },
    { name: "Behavioral", score: 78, status: "completed" },
    { name: "Psychometric", score: 82, status: "completed" },
    { name: "Communication", score: 88, status: "completed" },
  ];

  const activities = [
    {
      icon: Check,
      color: "#EBF2FF",
      iconColor: "#1560BD",
      text: "Completed Attitude Assessment",
      time: "Today, 10:22 AM",
    },
    {
      icon: Play,
      color: "#FFF3E0",
      iconColor: "#B7660A",
      text: "Started Behavioral Assessment",
      time: "Today, 9:54 AM",
    },
    {
      icon: Mail,
      color: "#E6F5EC",
      iconColor: "#1E8C45",
      text: "Invitation email sent",
      time: "12 May, 2:10 PM",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "6px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ padding: "12px 14px", borderBottom: "1px solid", borderColor: "divider", backgroundColor: "rgba(255, 214, 0, 0.05)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" }}>
          <Avatar sx={{ width: 38, height: 38, backgroundColor: "rgba(255, 214, 0, 0.1)", fontWeight: 500 }}>
             {candidate.name.split(" ").map(n => n[0]).join("")}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 500, color: "text.primary" }}>
              {candidate.name}
            </Typography>
            <Typography sx={{ color: "text.secondary", marginTop: "1px" }}>
              Senior Engineer · 4.5 yrs
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Profile Section */}
      <Box sx={{ padding: "10px 14px", borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "8px", fontWeight: 500 }}>
          Profile
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <Typography sx={{ color: "text.secondary" }}>Department</Typography>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>{candidate.department}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <Typography sx={{ color: "text.secondary" }}>Tier</Typography>
          <Box
            sx={{
              backgroundColor: "rgba(255, 214, 0, 0.1)",
              padding: "2px 8px",
              borderRadius: "3px",
              fontWeight: 500,
            }}
          >
            {candidate.tier}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <Typography sx={{ color: "text.secondary" }}>Assigned by</Typography>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>{candidate.assignedBy}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ color: "text.secondary" }}>Start date</Typography>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>{candidate.assignedOn}</Typography>
        </Box>
      </Box>

      {/* Module Progress */}
      <Box sx={{ padding: "10px 14px", borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "8px", fontWeight: 500 }}>
          Module progress
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {modules.map((module, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: module.status === "completed" ? "rgba(76, 175, 80, 0.1)" : "rgba(96, 125, 139, 0.1)",
                  color: module.status === "completed" ? "#4CAF50" : "#607D8B",
                  flexShrink: 0,
                }}
              >
                {module.name.charAt(0)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: "text.primary" }}>{module.name}</Typography>
              </Box>
              <Box sx={{ width: 50, height: 4, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "2px", position: "relative" }}>
                <Box
                  sx={{
                    width: `${module.score}%`,
                    height: "100%",
                    backgroundColor: module.score >= 80 ? "#4CAF50" : "#FF9800",
                    borderRadius: "2px",
                  }}
                />
              </Box>
              <Typography sx={{ color: "text.secondary", minWidth: "28px", textAlign: "right" }}>
                {module.score}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Recent Activity */}
      <Box sx={{ padding: "10px 14px" }}>
        <Typography sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "8px", fontWeight: 500 }}>
          Recent activity
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {activities.map((activity, index) => (
            <Box key={index} sx={{ display: "flex", gap: "9px", padding: "8px 0", borderBottom: index < activities.length - 1 ? "1px solid" : "none", borderColor: "rgba(255, 255, 255, 0.12)" }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: activity.color,
                  color: activity.iconColor,
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                <activity.icon size={11} />
              </Box>
              <Box>
                <Typography sx={{ color: "text.primary", lineHeight: 1.5 }}>
                  {activity.text}
                </Typography>
                <Typography sx={{ color: "text.secondary", marginTop: "2px" }}>
                  {activity.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}