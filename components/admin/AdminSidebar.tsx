// "use client";

// import { Add, CalendarViewMonth, Preview, ViewAgenda } from "@mui/icons-material";
// import { Box, Typography, Avatar } from "@mui/material";
// import { LayoutDashboard, Users, ClipboardList, ChartBar, Smile, Microscope, Brain, MessageCircle, Building, Settings, ChevronDown, View } from "lucide-react";

// interface AdminSidebarProps {
//   activeScreen: string;
//   setActiveScreen: (screen: string) => void;
// }

// export default function AdminSidebar({ activeScreen, setActiveScreen }: AdminSidebarProps) {
//   const mainItems = [
//     { id: "addNewCandidate", label: "Add New Candidate", icon: Add },
//     { id: "viewYesterCandidates", label: "View Yesterday's Candidates", icon: Preview, badge:5 },
//     { id: "viewHistoricalData", label: "View Historical Data", icon: CalendarViewMonth },
//     // { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
//     // { id: "candidates", label: "Candidates", icon: Users, badge: "24" },
//     // { id: "assessments", label: "Assessments", icon: ClipboardList },
//     { id: "dashboard", label: "Results & Reports", icon: ChartBar },
//   ];

//   return (
//     <Box
//       sx={{
//         width: 210,
//         minWidth: 210,
//         backgroundColor: "background.paper",
//         display: "flex",
//         flexDirection: "column",
//         color: "text.secondary",
//         borderRight: "1px solid",
//         borderColor: "divider",
//       }}
//     >
    

//       {/* Main Section */}
//       <Box sx={{ padding: "10px 0 4px", borderBottom: "1px solid", borderColor: "divider" }}>
//         <Typography sx={{display:'flex', alignItems: 'center', 
//           color: "text.secondary", letterSpacing: ".08em", padding: "4px 14px 6px", fontWeight: 500,mb:2 }}>
//           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIxyaUGIqsWet2DBlKxu5xwOlGaKkGh3seKA&s" alt="Facebook" style={{ width: 24, height: 24, marginRight: 8 }} />
//           Facebook
//         </Typography>
//         {mainItems.map((item) => (
//           <Box
//             key={item.id}
//             onClick={() => setActiveScreen(item.id)}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: "9px",
//               padding: "7px 14px",
//               cursor: "pointer",
//               color: activeScreen === item.id ? "text.primary" : "text.secondary",
//               backgroundColor: activeScreen === item.id ? "rgba(255, 214, 0, 0.1)" : "transparent",
//               borderLeft: activeScreen === item.id ? "2px solid" : "2px solid transparent",
//               borderColor: activeScreen === item.id ? "secondary.main" : "transparent",
//               transition: "all 0.15s",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 214, 0, 0.05)",
//                 color: "text.primary",
//               },
//               position: "relative",
//               fontSize: 14,
//             }}
//           >
//             <item.icon size={15} style={{ width: 16, flexShrink: 0 }} />
//             {item.label}
//             {item?.badge && (
//               <Box
//                 sx={{
//                   marginLeft: "auto",
//                   color: "primary.main",
//                   borderRadius: "10px",
//                   padding: "1px 6px",
//                   fontWeight: 500,
//                 }}
//               >
//                 {item.badge}
//               </Box>
//             )}
//           </Box>
//         ))}
//       </Box>


//       {/* User Section */}
//       <Box sx={{ marginTop: "auto", padding: "12px 0", borderTop: "1px solid", borderColor: "divider" }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 14px", cursor: "pointer" }}>
//           <Avatar sx={{  width: 26, height: 26, fontWeight: 500, fontSize: "14px"  }}>
//             AS
//           </Avatar>
//           <Box sx={{ flex: 1, minWidth: 0 }}>
//             <Typography sx={{ color: "text.primary", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//               Ananya Sharma
//             </Typography>
//             <Typography sx={{ color: "text.secondary" }}>
//               HR Manager Admin
//             </Typography>
//           </Box>
//           <ChevronDown size={12} style={{ color: "text.secondary" }} />
//         </Box>
//       </Box>
//     </Box>
//   );
// }

"use client";

import { Add, CalendarViewMonth, Preview } from "@mui/icons-material";
import { Box, Typography, Avatar, Tooltip } from "@mui/material";
import { ChartBar, ChevronDown } from "lucide-react";

interface AdminSidebarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

// ─── Facebook Logo ────────────────────────────────────────────────────────────

function FacebookLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect width="36" height="36" rx="8" fill="#1877F2" />
      <path
        d="M25 18C25 14.134 21.866 11 18 11C14.134 11 11 14.134 11 18C11 21.493 13.457 24.417 16.75 25V19.906H14.719V18H16.75V16.247C16.75 14.241 17.944 13.125 19.772 13.125C20.647 13.125 21.563 13.281 21.563 13.281V15.25H20.554C19.56 15.25 19.25 15.867 19.25 16.5V18H21.469L21.114 19.906H19.25V25C22.543 24.417 25 21.493 25 18Z"
        fill="white"
      />
    </svg>
  );
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function NavItem({
  id,
  label,
  icon: Icon,
  badge,
  active,
  onClick,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip title={label} placement="right" disableHoverListener>
      <Box
        onClick={onClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          mx: "8px",
          px: "10px",
          py: "7px",
          borderRadius: "7px",
          cursor: "pointer",
          color: active ? "primary.main" : "text.secondary",
          bgcolor: active ? "action.selected" : "transparent",
          border: "1px solid",
          borderColor: active ? "primary.main" : "transparent",
          transition: "all 0.15s ease",
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          position: "relative",
          "&:hover": {
            bgcolor: "action.hover",
            color: active ? "primary.main" : "text.primary",
            borderColor: active ? "primary.main" : "divider",
          },
        }}
      >
        {/* Active indicator bar */}
        {active && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: "20%",
              height: "60%",
              width: "3px",
              bgcolor: "primary.main",
              borderRadius: "0 3px 3px 0",
              ml: "-10px",
            }}
          />
        )}

        <Icon
          size={15}
          style={{ flexShrink: 0 }}
          color={active ? "inherit" : "inherit"}
        />

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: active ? 500 : 400,
            color: "inherit",
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </Typography>

        {badge !== undefined && (
          <Box
            sx={{
              ml: "auto",
              flexShrink: 0,
              minWidth: 18,
              height: 18,
              px: 0.6,
              borderRadius: "9px",
              bgcolor: active ? "primary.main" : "action.selected",
              color: active ? "primary.contrastText" : "text.secondary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {badge}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.09em",
        color: "text.disabled",
        px: "18px",
        mb: 0.75,
        mt: 0.5,
      }}
    >
      {children}
    </Typography>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminSidebar({ activeScreen, setActiveScreen }: AdminSidebarProps) {
  const mainItems = [
    { id: "addNewCandidate",      label: "Add Candidate",       icon: Add,              badge: undefined },
    { id: "viewYesterCandidates", label: "Yesterday's Results", icon: Preview,          badge: 5         },
    { id: "viewHistoricalData",   label: "Historical Data",     icon: CalendarViewMonth, badge: undefined },
    { id: "dashboard",            label: "Results & Reports",   icon: ChartBar,         badge: undefined },
  ];

  return (
    <Box
      sx={{
        width: 220,
        minWidth: 220,
        height: "100%",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >

      {/* ── Brand header ── */}
      <Box
        sx={{
          px: "16px",
          py: "14px",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <FacebookLogo size={28} />
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
              color: "text.primary",
            }}
          >
            Facebook
          </Typography>
          <Typography
            sx={{
              fontSize: "0.58rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "text.disabled",
              lineHeight: 1,
              mt: "2px",
            }}
          >
            Admin Console
          </Typography>
        </Box>
      </Box>

      {/* ── Nav items ── */}
      <Box sx={{ flex: 1, pt: 1.5, pb: 1, overflow: "auto" }}>
        <SectionLabel>Workspace</SectionLabel>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {mainItems.map((item) => (
            <NavItem
              key={item.id}
              {...item}
              active={activeScreen === item.id}
              onClick={() => setActiveScreen(item.id)}
            />
          ))}
        </Box>
      </Box>

      {/* ── User section ── */}
      <Box sx={{ borderTop: "1px solid", borderColor: "divider", p: "10px 8px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            px: "10px",
            py: "8px",
            borderRadius: "7px",
            cursor: "pointer",
            transition: "background 0.15s",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 11,
              fontWeight: 700,
              bgcolor: "action.selected",
              color: "text.secondary",
              border: "1.5px solid",
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            AS
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: "text.primary",
                fontWeight: 500,
                fontSize: 13,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.3,
              }}
            >
              Ananya Sharma
            </Typography>
            <Typography
              sx={{
                color: "text.disabled",
                fontSize: 11,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.2,
              }}
            >
              HR Manager · Admin
            </Typography>
          </Box>
          <ChevronDown size={12} style={{ flexShrink: 0, color: "inherit", opacity: 0.4 }} />
        </Box>
      </Box>

    </Box>
  );
}