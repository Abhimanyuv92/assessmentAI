// "use client";

// import { useState } from "react";
// import { Box, Button, Typography, Grid } from "@mui/material";
// import { Filter, Plus } from "lucide-react";
// import AdminDataTable, { Candidate } from "./AdminDataTable";
// import AdminKpiRow from "./AdminKpiRow";
// import AdminTierSelector from "./AdminTierSelector";
// import AdminDetailPanel from "./AdminDetailPanel";
// import AdminDetailPanelDialog from "./AdminDetailPanelDialog";
// import AdminModuleTabs from "./AdminModuleTabs";

// export default function AdminDashboard() {
//   const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

//   const handleRowClick = (candidate: Candidate) => {
//     setSelectedCandidate((prev) => (prev?.id === candidate.id ? null : candidate));
//   };

//   return (
//     <>
//         {/* <AdminModuleTabs /> */}
//         <Box sx={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px", backgroundColor: "background.default" }}>
//         {/* Action Bar */}
//         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <Typography sx={{ fontWeight: 500, color: "text.primary" }}>
//                 Assessment Dashboard
//             </Typography>
//             <Box
//                 sx={{
//                 backgroundColor: "rgba(255, 214, 0, 0.1)",
//                 borderRadius: "3px",
//                 padding: "2px 8px",
//                 fontWeight: 500,
//                 }}
//             >
//                 Q2 2025
//             </Box>
//             </Box>
//             <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <Button
//                 variant="outlined"
//                 startIcon={<Filter size={14} />}
//                 sx={{
//                 padding: "6px 14px",
//                 backgroundColor: "background.paper",
//                 color: "text.primary",
//                 border: "1px solid",
//                 borderColor: "divider",
//                 borderRadius: "4px",
//                 textTransform: "none",
//                 "&:hover": { backgroundColor: "rgba(255, 214, 0, 0.1)" },
//                 }}
//             >
//                 Filter
//             </Button>
//             <Button
//                 variant="contained"
//                 startIcon={<Plus size={14} />}
//                 sx={{
//                 padding: "6px 14px",
//                 borderRadius: "4px",
//                 textTransform: "none",
//                 //   "&:hover": { backgroundColor: "secondary.light" },
//                 }}
//             >
//                 New Assessment
//             </Button>
//             </Box>
//         </Box>

//         {/* KPI Row */}
//         <AdminKpiRow />

//         {/* <Grid container spacing={2}>
//             <Grid  size={{xs:12,md:selectedCandidate ? 8 : 12}} >
//             <AdminDataTable selectedCandidateId={selectedCandidate?.id} onRowSelect={handleRowClick} />
//             </Grid>
            
//             {
//                 selectedCandidate && <AdminDetailPanelDialog open candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
//             }
//         </Grid>*/}

//         {/* Tier Selector */}
//         <AdminTierSelector />
//         </Box>
//     </>
//   );
// }
"use client";

import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  AssignmentOutlined,
  AssignmentTurnedInOutlined,
  CalendarTodayOutlined,
  CheckCircleOutlineOutlined,
  EmojiEventsOutlined,
  FilterListOutlined,
  GroupOutlined,
  HourglassEmptyOutlined,
  MoreHorizOutlined,
  PendingOutlined,
  PersonAddOutlined,
  ScheduleOutlined,
  StarBorderOutlined,
  TrendingUpOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";

// ─── Mock data ────────────────────────────────────────────────────────────────

const TIERS = [
  { id: 1, name: "Fresher",    range: "0–2 yrs",  color: "#378ADD", bg: "rgba(55,138,221,0.09)",  count: 28, completed: 18, avg: 68 },
  { id: 2, name: "Junior",     range: "3–5 yrs",  color: "#3B6D11", bg: "rgba(59,109,17,0.09)",   count: 41, completed: 29, avg: 72 },
  { id: 3, name: "Senior",     range: "6–8 yrs",  color: "#854F0B", bg: "rgba(133,79,11,0.09)",   count: 35, completed: 25, avg: 76 },
  { id: 4, name: "Lead",       range: "9–11 yrs", color: "#7C3AED", bg: "rgba(124,58,237,0.09)",  count: 26, completed: 20, avg: 79 },
  { id: 5, name: "Leadership", range: "12+ yrs",  color: "#A32D2D", bg: "rgba(163,45,45,0.09)",   count: 18, completed: 14, avg: 83 },
];

const RECENT_CANDIDATES = [
  { id: 1,  name: "Rohan Sinha",    email: "rohan@acme.com",    tier: "Leadership", dept: "Engineering", status: "completed",   score: 87, added: "Today, 9:41 am"  },
  { id: 2,  name: "Priya Nair",     email: "priya@acme.com",    tier: "Senior",     dept: "Design",      status: "in-progress", score: 71, added: "Today, 8:15 am"  },
  { id: 3,  name: "Amit Kulkarni",  email: "amit@acme.com",     tier: "Lead",       dept: "Product",     status: "completed",   score: 79, added: "Yesterday"       },
  { id: 4,  name: "Sneha Reddy",    email: "sneha@acme.com",    tier: "Junior",     dept: "Engineering", status: "pending",     score: null, added: "Yesterday"     },
  { id: 5,  name: "Vikram Sharma",  email: "vikram@acme.com",   tier: "Lead",       dept: "Data",        status: "in-progress", score: 65, added: "2 days ago"      },
  { id: 6,  name: "Divya Menon",    email: "divya@acme.com",    tier: "Senior",     dept: "Engineering", status: "completed",   score: 82, added: "2 days ago"      },
  { id: 7,  name: "Karan Mehta",    email: "karan@acme.com",    tier: "Fresher",    dept: "HR",          status: "pending",     score: null, added: "3 days ago"    },
];

const ACTIVITY = [
  { icon: AssignmentTurnedInOutlined, color: "#3B6D11", bg: "rgba(59,109,17,0.09)", text: "Rohan Sinha completed assessment", time: "9 min ago" },
  { icon: PersonAddOutlined,          color: "#0F63FF", bg: "rgba(15,99,255,0.09)", text: "New candidate Priya Nair registered", time: "42 min ago" },
  { icon: ScheduleOutlined,           color: "#854F0B", bg: "rgba(133,79,11,0.09)", text: "Test link sent to Amit Kulkarni", time: "1 hr ago" },
  { icon: CheckCircleOutlineOutlined, color: "#3B6D11", bg: "rgba(59,109,17,0.09)", text: "Divya Menon scored 82% — shortlisted", time: "3 hrs ago" },
  { icon: HourglassEmptyOutlined,     color: "#7C3AED", bg: "rgba(124,58,237,0.09)", text: "Vikram Sharma test in progress", time: "5 hrs ago" },
  { icon: StarBorderOutlined,         color: "#A32D2D", bg: "rgba(163,45,45,0.09)", text: "Leadership pool updated — 18 candidates", time: "Yesterday" },
];

const PIPELINE = [
  { label: "Registered",   count: 148, color: "#0F63FF" },
  { label: "Link sent",    count: 121, color: "#378ADD" },
  { label: "In progress",  count: 32,  color: "#854F0B" },
  { label: "Completed",    count: 94,  color: "#3B6D11" },
  { label: "Shortlisted",  count: 47,  color: "#7C3AED" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  completed:     { bg: "rgba(59,109,17,0.10)",   color: "#3B6D11", label: "Completed"   },
  "in-progress": { bg: "rgba(133,79,11,0.10)",   color: "#854F0B", label: "In Progress" },
  pending:       { bg: "rgba(108,117,125,0.10)", color: "#555E68", label: "Pending"     },
};

const TIER_COLOR: Record<string, { color: string; bg: string }> = {
  Fresher:    { color: "#378ADD", bg: "rgba(55,138,221,0.10)"  },
  Junior:     { color: "#3B6D11", bg: "rgba(59,109,17,0.10)"   },
  Senior:     { color: "#854F0B", bg: "rgba(133,79,11,0.10)"   },
  Lead:       { color: "#7C3AED", bg: "rgba(124,58,237,0.10)"  },
  Leadership: { color: "#A32D2D", bg: "rgba(163,45,45,0.10)"   },
};

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function avatarBg(name: string) {
  const pool = ["#0F63FF","#3B6D11","#854F0B","#A32D2D","#7C3AED","#0891B2"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return pool[Math.abs(h) % pool.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled", mb: 1.25 }}>
      {children}
    </Typography>
  );
}

function Pill({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <Box component="span" sx={{ display: "inline-block", fontSize: 11, fontWeight: 500, px: 1.25, py: 0.35, borderRadius: 10, bgcolor: bg, color }}>
      {label}
    </Box>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────

function KpiStrip() {
  const kpis = [
    { icon: GroupOutlined,              label: "Total candidates", value: "148", delta: "+12%", up: true,  sub: "Across all tiers"   },
    { icon: AssignmentTurnedInOutlined, label: "Completed",        value: "94",  delta: "+8%",  up: true,  sub: "63% completion rate" },
    { icon: HourglassEmptyOutlined,     label: "In progress",      value: "32",  delta: null,   up: null,  sub: "Avg. 2.4 days"       },
    { icon: StarBorderOutlined,         label: "Avg. score",        value: "74%", delta: "+3%",  up: true,  sub: "All modules"         },
    { icon: EmojiEventsOutlined,        label: "Shortlisted",       value: "47",  delta: "+5",   up: true,  sub: "Ready for interview" },
  ];

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1.5 }}>
      {kpis.map((k, i) => (
        <Paper
          key={i}
          elevation={0}
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            p: "14px 16px",
            position: "relative",
            overflow: "hidden",
            transition: "box-shadow 0.15s",
            "&:hover": { boxShadow: "0 2px 12px rgba(0,0,0,0.07)" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <k.icon sx={{ fontSize: 16, color: "text.secondary" }} />
            </Box>
            {k.delta && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, fontSize: 11, fontWeight: 600, color: k.up ? "#3B6D11" : "#A32D2D", bgcolor: k.up ? "rgba(59,109,17,0.09)" : "rgba(163,45,45,0.09)", px: 0.9, py: 0.3, borderRadius: 1 }}>
                {k.up ? <ArrowUpwardOutlined sx={{ fontSize: 11 }} /> : <ArrowDownwardOutlined sx={{ fontSize: 11 }} />}
                <span style={{ fontSize: 11 }}>{k.delta}</span>
              </Box>
            )}
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 600, lineHeight: 1, color: "text.primary" }}>{k.value}</Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>{k.label}</Typography>
          <Typography sx={{ fontSize: 11, color: "text.disabled", mt: 0.25 }}>{k.sub}</Typography>
        </Paper>
      ))}
    </Box>
  );
}

// ─── Tier Breakdown ───────────────────────────────────────────────────────────

function TierBreakdown() {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...TIERS.map((t) => t.count));

  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2.5, p: "18px 20px", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <SectionLabel>Tier breakdown</SectionLabel>
        <Tooltip title="Candidates per experience tier">
          <IconButton size="small" sx={{ color: "text.disabled" }}><MoreHorizOutlined sx={{ fontSize: 16 }} /></IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {TIERS.map((t) => (
          <Box
            key={t.id}
            onClick={() => setActive(active === t.id ? null : t.id)}
            sx={{ cursor: "pointer", p: "10px 12px", borderRadius: 2, border: "1px solid", borderColor: active === t.id ? t.color : "divider", bgcolor: active === t.id ? t.bg : "transparent", transition: "all 0.15s" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: t.color, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{t.name}</Typography>
                <Typography sx={{ fontSize: 11, color: "text.disabled" }}>{t.range}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{t.completed}/{t.count}</Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: t.color }}>{t.avg}%</Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(t.count / max) * 100}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": { bgcolor: t.color, borderRadius: 2 },
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

// ─── Pipeline Funnel ─────────────────────────────────────────────────────────

function PipelineFunnel() {
  const max = PIPELINE[0].count;
  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2.5, p: "18px 20px", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <SectionLabel>Hiring pipeline</SectionLabel>
        <Chip label="Q2 2025" size="small" sx={{ fontSize: 11, height: 20, bgcolor: "rgba(255,214,0,0.12)", color: "#854F0B", fontWeight: 500 }} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {PIPELINE.map((p, i) => {
          const pct = Math.round((p.count / max) * 100);
          const dropPct = i > 0 ? Math.round(((PIPELINE[i - 1].count - p.count) / PIPELINE[i - 1].count) * 100) : null;
          return (
            <Box key={p.label}>
              {dropPct !== null && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1, mb: 0.5 }}>
                  <Box sx={{ width: 1, height: 12, bgcolor: "divider", mx: "auto", position: "relative", left: 0 }} />
                  <Typography sx={{ fontSize: 10, color: "text.disabled" }}>−{dropPct}% drop</Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Typography sx={{ fontSize: 12, color: "text.secondary", width: 80, flexShrink: 0 }}>{p.label}</Typography>
                <Box sx={{ flex: 1, height: 22, borderRadius: 1, bgcolor: "action.hover", position: "relative", overflow: "hidden" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0, top: 0, bottom: 0,
                      width: `${pct}%`,
                      bgcolor: p.color,
                      borderRadius: 1,
                      opacity: 0.85,
                      transition: "width 0.4s ease",
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: p.color, width: 30, textAlign: "right", flexShrink: 0 }}>{p.count}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Overall conversion</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#3B6D11" }}>
          {Math.round((PIPELINE[4].count / PIPELINE[0].count) * 100)}%
        </Typography>
      </Box>
    </Paper>
  );
}

// ─── Recent Candidates ────────────────────────────────────────────────────────

function RecentCandidates() {
  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2.5, overflow: "hidden" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.75, borderBottom: "1px solid", borderColor: "divider" }}>
        <SectionLabel>Recent candidates</SectionLabel>
        <Button size="small" sx={{ textTransform: "none", fontSize: 12, color: "#0F63FF", p: 0, minWidth: 0 }}>View all →</Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { fontSize: 11, fontWeight: 500, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.05em", py: 1, px: 2, bgcolor: "action.hover", borderBottom: "1px solid", borderColor: "divider" } }}>
              <TableCell>Candidate</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell>Dept</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Added</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RECENT_CANDIDATES.map((c) => {
              const ss = STATUS_STYLE[c.status];
              const ts = TIER_COLOR[c.tier] ?? { color: "#555E68", bg: "rgba(108,117,125,0.10)" };
              return (
                <TableRow key={c.id} sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: "action.hover" }, cursor: "pointer", transition: "background 0.1s" }}>
                  <TableCell sx={{ py: 1.25, px: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: 10, fontWeight: 600, bgcolor: avatarBg(c.name), flexShrink: 0 }}>{initials(c.name)}</Avatar>
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{c.name}</Typography>
                        <Typography variant="caption" color="text.disabled">{c.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ px: 2 }}><Pill label={c.tier} bg={ts.bg} color={ts.color} /></TableCell>
                  <TableCell sx={{ px: 2 }}><Typography sx={{ fontSize: 13, color: "text.secondary" }}>{c.dept}</Typography></TableCell>
                  <TableCell sx={{ px: 2 }}><Pill label={ss.label} bg={ss.bg} color={ss.color} /></TableCell>
                  <TableCell align="right" sx={{ px: 2 }}>
                    {c.score !== null ? (
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: c.score >= 80 ? "#3B6D11" : c.score >= 65 ? "#854F0B" : "#A32D2D" }}>
                        {c.score}%
                      </Typography>
                    ) : (
                      <Typography sx={{ fontSize: 12, color: "text.disabled" }}>—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ px: 2 }}>
                    <Typography sx={{ fontSize: 11, color: "text.disabled", whiteSpace: "nowrap" }}>{c.added}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

function ActivityFeed() {
  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2.5, p: "18px 20px", height: "100%" }}>
      <SectionLabel>Activity</SectionLabel>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {ACTIVITY.map((a, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.25, py: 1.25, borderBottom: i < ACTIVITY.length - 1 ? "1px solid" : "none", borderColor: "divider" }}>
            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.25 }}>
              <a.icon sx={{ fontSize: 14, color: a.color }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 12.5, color: "text.primary", lineHeight: 1.45 }}>{a.text}</Typography>
              <Typography sx={{ fontSize: 11, color: "text.disabled", mt: 0.25 }}>{a.time}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

// ─── Module Score Summary ─────────────────────────────────────────────────────

function ModuleScores() {
  const modules = [
    { name: "SJT",           avg: 76, color: "#0F63FF" },
    { name: "Psychometric",  avg: 71, color: "#3B6D11" },
    { name: "Behavioural",   avg: 74, color: "#854F0B" },
    { name: "Communication", avg: 80, color: "#7C3AED" },
  ];

  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2.5, p: "18px 20px" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <SectionLabel>Module performance</SectionLabel>
        <Typography sx={{ fontSize: 11, color: "text.disabled" }}>Avg across 94 completed</Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5 }}>
        {modules.map((m) => (
          <Box key={m.name} sx={{ textAlign: "center", p: "12px 8px", borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "transparent", transition: "all 0.15s", "&:hover": { bgcolor: `${m.color}0D`, borderColor: m.color } }}>
            {/* Circular score */}
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                bgcolor: `${m.color}14`,
                border: `2.5px solid ${m.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1,
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.avg}%</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: "text.primary" }}>{m.name}</Typography>
            <LinearProgress
              variant="determinate"
              value={m.avg}
              sx={{ height: 3, borderRadius: 2, mt: 1, bgcolor: "action.hover", "& .MuiLinearProgress-bar": { bgcolor: m.color } }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

// ─── Score Distribution ───────────────────────────────────────────────────────

function ScoreDistribution() {
  const buckets = [
    { range: "90–100", count: 8,  color: "#3B6D11" },
    { range: "80–89",  count: 14, color: "#5A8F20" },
    { range: "70–79",  count: 27, color: "#854F0B" },
    { range: "60–69",  count: 22, color: "#B07320" },
    { range: "50–59",  count: 14, color: "#A32D2D" },
    { range: "<50",    count: 9,  color: "#C0392B" },
  ];
  const max = Math.max(...buckets.map((b) => b.count));

  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2.5, p: "18px 20px" }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2 }}>
        <SectionLabel>Score distribution</SectionLabel>
        <Typography sx={{ fontSize: 11, color: "text.disabled" }}>94 completed assessments</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 80 }}>
        {buckets.map((b) => (
          <Tooltip key={b.range} title={`${b.range}%: ${b.count} candidates`}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, cursor: "default" }}>
              <Typography sx={{ fontSize: 10, color: "text.disabled" }}>{b.count}</Typography>
              <Box
                sx={{
                  width: "100%",
                  height: `${(b.count / max) * 56}px`,
                  bgcolor: b.color,
                  borderRadius: "3px 3px 0 0",
                  opacity: 0.82,
                  transition: "opacity 0.15s",
                  "&:hover": { opacity: 1 },
                }}
              />
            </Box>
          </Tooltip>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        {buckets.map((b) => (
          <Typography key={b.range} sx={{ flex: 1, textAlign: "center", fontSize: 9.5, color: "text.disabled" }}>{b.range}</Typography>
        ))}
      </Box>
    </Paper>
  );
}

// ─── Top Performers ───────────────────────────────────────────────────────────

function TopPerformers() {
  const top = [
    { name: "Rohan Sinha",   tier: "Leadership", score: 92, dept: "Engineering" },
    { name: "Divya Menon",   tier: "Senior",     score: 88, dept: "Engineering" },
    { name: "Lakshmi Rao",   tier: "Leadership", score: 87, dept: "Finance"     },
    { name: "Amit Kulkarni", tier: "Lead",       score: 84, dept: "Product"     },
  ];

  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2.5, p: "18px 20px", height: "100%" }}>
      <SectionLabel>Top performers</SectionLabel>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
        {top.map((c, i) => {
          const ts = TIER_COLOR[c.tier] ?? { color: "#555E68", bg: "rgba(108,117,125,0.10)" };
          return (
            <Box key={c.name} sx={{ display: "flex", alignItems: "center", gap: 1.25, p: "8px 10px", borderRadius: 1.5, "&:hover": { bgcolor: "action.hover" }, cursor: "pointer" }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: i === 0 ? "#854F0B" : "text.disabled", width: 16, flexShrink: 0 }}>#{i + 1}</Typography>
              <Avatar sx={{ width: 28, height: 28, fontSize: 10, fontWeight: 600, bgcolor: avatarBg(c.name), flexShrink: 0 }}>{initials(c.name)}</Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{c.name}</Typography>
                <Typography sx={{ fontSize: 11, color: "text.disabled" }}>{c.dept}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Pill label={c.tier} bg={ts.bg} color={ts.color} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#3B6D11", minWidth: 36, textAlign: "right" }}>{c.score}%</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function RecruiterDashboard() {
  return (
    <Box sx={{ flex: 1, p: "16px 18px", display: "flex", flexDirection: "column", gap: 2, bgcolor: "background.default", minHeight: "100vh" }}>

      {/* Top bar */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, color: "text.primary" }}>Assessment Dashboard</Typography>
          <Chip
            label="Q2 2025"
            size="small"
            sx={{ fontSize: 11, height: 20, bgcolor: "rgba(255,214,0,0.12)", color: "#854F0B", fontWeight: 500, borderRadius: 1 }}
          />
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#3B6D11", animation: "pulse 2s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } } }} />
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Live</Typography>
        </Box>
        {/* <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListOutlined sx={{ fontSize: 14 }} />}
            sx={{ textTransform: "none", fontSize: 13, borderColor: "divider", color: "text.secondary", "&:hover": { bgcolor: "action.hover", borderColor: "divider" } }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            size="small"
            disableElevation
            startIcon={<AddOutlined sx={{ fontSize: 14 }} />}
            sx={{ textTransform: "none", fontSize: 13, bgcolor: "#0F63FF", "&:hover": { bgcolor: "#0B54D6" } }}
          >
            New candidate
          </Button>
        </Box> */}
      </Box>

      {/* KPI strip */}
      <KpiStrip />

      {/* Module scores */}
      <ModuleScores />

      {/* Middle row — Tier breakdown | Pipeline | Activity */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 280px", gap: 2 }}>
        <TierBreakdown />
        <PipelineFunnel />
        <ActivityFeed />
      </Box>

      {/* Bottom row — Recent candidates + Score distribution + Top performers */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 2 }}>
        <RecentCandidates />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <ScoreDistribution />
          <TopPerformers />
        </Box>
      </Box>

    </Box>
  );
}