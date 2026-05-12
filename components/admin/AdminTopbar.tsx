"use client";

import { Box, InputBase, IconButton } from "@mui/material";
import { Search, Calendar, Bell, HelpCircle, Home, ChevronRight } from "lucide-react";

interface AdminTopbarProps {
  breadcrumb?: string;
}

export default function AdminTopbar({ breadcrumb = "Dashboard" }: AdminTopbarProps) {
  return (
    <Box
      sx={{
        height: 48,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: "12px",
        flexShrink: 0,
      }}
    >
      {/* Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", color: "text.secondary" }}>
        <Home size={11} />
        <ChevronRight size={11} />
        <Box sx={{ color: "text.primary", fontWeight: 500 }}>{breadcrumb}</Box>
      </Box>

      {/* Search */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 260,
          marginLeft: "auto",
          position: "relative",
        }}
      >
        <Search size={14} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "text.secondary" }} />
        <InputBase
          placeholder="Search candidates, modules…"
          sx={{
            width: "100%",
            padding: "5px 10px 5px 30px",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "4px",
            backgroundColor: "background.default",
            color: "text.primary",
          }}
        />
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <IconButton
          sx={{
            width: 30,
            height: 30,
            borderRadius: "4px",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "transparent",
            color: "text.secondary",
            "&:hover": { backgroundColor: "rgba(255, 214, 0, 0.1)" },
          }}
          aria-label="Calendar"
        >
          <Calendar size={14} />
        </IconButton>
        <IconButton
          sx={{
            width: 30,
            height: 30,
            borderRadius: "4px",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "transparent",
            color: "text.secondary",
            position: "relative",
            "&:hover": { backgroundColor: "rgba(255, 214, 0, 0.1)" },
          }}
          aria-label="Notifications"
        >
          <Bell size={14} />
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              position: "absolute",
              top: 4,
              right: 4,
              border: "1px solid",
              borderColor: "background.paper",
            }}
          />
        </IconButton>
        <IconButton
          sx={{
            width: 30,
            height: 30,
            borderRadius: "4px",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "transparent",
            color: "text.secondary",
            "&:hover": { backgroundColor: "rgba(255, 214, 0, 0.1)" },
          }}
          aria-label="Help"
        >
          <HelpCircle size={14} />
        </IconButton>
      </Box>
    </Box>
  );
}