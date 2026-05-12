"use client";

import { Box, Typography } from "@mui/material";
import { LayoutDashboard, Users, ClipboardCheck, PieChart, FileText } from "lucide-react";

interface AdminModuleTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function AdminModuleTabs({ activeTab = "overview", onTabChange }: AdminModuleTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    // { id: "candidates", label: "Candidates", icon: Users, count: 24 },
    { id: "sessions", label: "Active Sessions", icon: ClipboardCheck, count: 6 },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "export", label: "Export", icon: FileText },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: 0,
        flexShrink: 0,
      }}
    >
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          onClick={() => onTabChange?.(tab.id)}
          sx={{
            padding: "10px 14px",
            color: activeTab === tab.id ? "text.primary" : "text.secondary",
            cursor: "pointer",
            borderBottom: activeTab === tab.id ? "2px solid" : "2px solid transparent",
            borderColor: activeTab === tab.id ? "secondary.main" : "transparent",
            whiteSpace: "nowrap",
            transition: "color .15s",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: activeTab === tab.id ? 500 : 400,
            "&:hover": {
              color: "text.primary",
            },
          }}
        >
          <tab.icon size={13} />
          {tab.label}
          {tab.count && (
            <Box
              sx={{
                color: "primary.main",
                borderRadius: "10px",
                padding: "1px 5px",
              }}
            >
              {tab.count}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}