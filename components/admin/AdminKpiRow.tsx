"use client";

import { Box, Typography } from "@mui/material";
import { Users, ClipboardCheck, Clock, Star, Award } from "lucide-react";

export default function AdminKpiRow() {
  const kpis = [
    {
      icon: Users,
      label: "Total candidates",
      value: "148",
      sub: "Across all tiers",
      badge: { text: "+12%", type: "up" },
      active: true,
    },
    {
      icon: ClipboardCheck,
      label: "Completed",
      value: "94",
      sub: "63% completion rate",
      badge: { text: "+8%", type: "up" },
    },
    {
      icon: Clock,
      label: "In progress",
      value: "32",
      sub: "Avg. 2.4 days",
      badge: { text: "Active", type: "neutral" },
    },
    {
      icon: Star,
      label: "Avg. score",
      value: "74%",
      sub: "All modules combined",
      badge: { text: "+3%", type: "up" },
    },
    {
      icon: Award,
      label: "Leadership tier",
      value: "18",
      sub: "12+ yr candidates",
      badge: { text: "-2", type: "down" },
    },
  ];

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "up":
        return { backgroundColor: "rgba(46, 125, 50, 0.1)", color: "#4CAF50" };
      case "down":
        return { backgroundColor: "rgba(211, 47, 47, 0.1)", color: "#F44336" };
      case "neutral":
        return { backgroundColor: "rgba(183, 109, 10, 0.1)", color: "#FF9800" };
      default:
        return { backgroundColor: "rgba(96, 125, 139, 0.1)", color: "#607D8B" };
    }
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(1, minmax(0, 1fr))", md: "repeat(2, minmax(0, 1fr))", lg: "repeat(5, minmax(0, 1fr))" }, gap: "10px" }}>
      {kpis.map((kpi, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "6px",
            padding: "12px 14px",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            transition: "border-color .15s",
            borderTop: kpi.active ? "3px solid" : "1px solid",
            borderTopColor: kpi.active ? "secondary.main" : "divider",
            borderLeft: "1px solid",
            borderLeftColor: "divider",
            borderRight: "1px solid",
            borderRightColor: "divider",
            borderBottom: "1px solid",
            borderBottomColor: "divider",
            "&:hover": { borderColor: "secondary.light" },
          }}
        >
          <Typography
            sx={{
              color: "text.secondary",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
            }}
          >
            <kpi.icon size={12} />
            {kpi.label}
          </Typography>
          <Typography sx={{ fontWeight: 500, color: "text.primary", lineHeight: 1, fontSize: "20px" }}>
            {kpi.value}
          </Typography>
          <Typography sx={{ color: "text.secondary", marginTop: "3px", fontSize: "12px", }}>
            {kpi.sub}
          </Typography>
          {kpi.badge && (
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "2px 6px",
                borderRadius: "3px",
                fontWeight: 500,
                ...getBadgeStyles(kpi.badge.type),
              }}
            >
              {kpi.badge.text}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}