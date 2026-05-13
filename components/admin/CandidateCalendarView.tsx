"use client";

import { useState, useMemo } from "react";
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
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
  ChevronLeft,
  ChevronRight,
  Close,
  PersonOutlined,
  CalendarTodayOutlined,
} from "@mui/icons-material";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Candidate {
  id: number;
  name: string;
  email: string;
  tier: string;
  experience: string;
  department: string;
  status: "completed" | "in-progress" | "pending";
  registeredAt: string; // ISO date string "YYYY-MM-DD"
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TODAY = new Date();
const YYYY = TODAY.getFullYear();
const MM = TODAY.getMonth();

function iso(day: number) {
  return `${YYYY}-${String(MM + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MOCK_CANDIDATES: Candidate[] = [
  { id: 1,  name: "Rohan Sinha",      email: "rohan@acme.com",    tier: "Leadership", experience: "12+ yrs", department: "Engineering",  status: "completed",   registeredAt: iso(2)  },
  { id: 2,  name: "Priya Nair",       email: "priya@acme.com",    tier: "Senior",     experience: "3–5 yrs", department: "Design",        status: "in-progress", registeredAt: iso(2)  },
  { id: 3,  name: "Amit Kulkarni",    email: "amit@acme.com",     tier: "Manager",    experience: "7–12 yrs",department: "Product",       status: "completed",   registeredAt: iso(5)  },
  { id: 4,  name: "Sneha Reddy",      email: "sneha@acme.com",    tier: "Junior",     experience: "0–3 yrs", department: "Engineering",  status: "pending",     registeredAt: iso(5)  },
  { id: 5,  name: "Vikram Sharma",    email: "vikram@acme.com",   tier: "Lead",       experience: "5–7 yrs", department: "Data",          status: "in-progress", registeredAt: iso(5)  },
  { id: 6,  name: "Divya Menon",      email: "divya@acme.com",    tier: "Senior",     experience: "3–5 yrs", department: "Engineering",  status: "completed",   registeredAt: iso(8)  },
  { id: 7,  name: "Karan Mehta",      email: "karan@acme.com",    tier: "Junior",     experience: "0–3 yrs", department: "HR",            status: "pending",     registeredAt: iso(10) },
  { id: 8,  name: "Ananya Iyer",      email: "ananya@acme.com",   tier: "Manager",    experience: "7–12 yrs",department: "Finance",       status: "completed",   registeredAt: iso(10) },
  { id: 9,  name: "Rahul Verma",      email: "rahul@acme.com",    tier: "Lead",       experience: "5–7 yrs", department: "Engineering",  status: "in-progress", registeredAt: iso(13) },
  { id: 10, name: "Meera Pillai",     email: "meera@acme.com",    tier: "Fresher",    experience: "0–3 yrs", department: "Design",        status: "pending",     registeredAt: iso(14) },
  { id: 11, name: "Suresh Babu",      email: "suresh@acme.com",   tier: "Senior",     experience: "3–5 yrs", department: "Product",       status: "completed",   registeredAt: iso(14) },
  { id: 12, name: "Lakshmi Rao",      email: "lakshmi@acme.com",  tier: "Leadership", experience: "12+ yrs", department: "Engineering",  status: "completed",   registeredAt: iso(17) },
  { id: 13, name: "Arun Kumar",       email: "arun@acme.com",     tier: "Junior",     experience: "0–3 yrs", department: "Data",          status: "pending",     registeredAt: iso(19) },
  { id: 14, name: "Nisha Joshi",      email: "nisha@acme.com",    tier: "Manager",    experience: "7–12 yrs",department: "Finance",       status: "in-progress", registeredAt: iso(21) },
  { id: 15, name: "Deepak Pillai",    email: "deepak@acme.com",   tier: "Lead",       experience: "5–7 yrs", department: "Engineering",  status: "completed",   registeredAt: iso(21) },
  { id: 16, name: "Pooja Tiwari",     email: "pooja@acme.com",    tier: "Senior",     experience: "3–5 yrs", department: "HR",            status: "completed",   registeredAt: iso(23) },
  { id: 17, name: "Rajesh Nambiar",   email: "rajesh@acme.com",   tier: "Fresher",    experience: "0–3 yrs", department: "Design",        status: "pending",     registeredAt: iso(TODAY.getDate()) },
  { id: 18, name: "Kavitha Subbu",    email: "kavitha@acme.com",  tier: "Junior",     experience: "0–3 yrs", department: "Engineering",  status: "in-progress", registeredAt: iso(TODAY.getDate()) },
  { id: 19, name: "Manoj Hegde",      email: "manoj@acme.com",    tier: "Lead",       experience: "5–7 yrs", department: "Product",       status: "completed",   registeredAt: iso(TODAY.getDate()) },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const STATUS_MAP = {
  completed:   { bg: "rgba(59,109,17,0.10)",  color: "#3B6D11", label: "Completed"   },
  "in-progress": { bg: "rgba(186,117,23,0.12)", color: "#854F0B", label: "In Progress" },
  pending:     { bg: "rgba(108,117,125,0.10)", color: "#555E68", label: "Pending"     },
};

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  Fresher:    { bg: "rgba(108,117,125,0.10)", color: "#555E68" },
  Junior:     { bg: "rgba(15,99,255,0.10)",   color: "#0F63FF" },
  Senior:     { bg: "rgba(91,163,100,0.12)",  color: "#3B6D11" },
  Lead:       { bg: "rgba(186,117,23,0.12)",  color: "#854F0B" },
  Manager:    { bg: "rgba(147,51,234,0.10)",  color: "#7C3AED" },
  Leadership: { bg: "rgba(226,75,74,0.10)",   color: "#A32D2D" },
};

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function avatarColor(name: string) {
  const colors = ["#0F63FF","#3B6D11","#854F0B","#A32D2D","#7C3AED","#0891B2"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

// ─── Day Cell ─────────────────────────────────────────────────────────────────

interface DayCellProps {
  day: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  count: number;
  onClick: () => void;
}

function DayCell({ day, isToday, isCurrentMonth, count, onClick }: DayCellProps) {
  const hasAny = count > 0;

  const bgColor = !isCurrentMonth
    ? "transparent"
    : isToday
    ? "#0F63FF"
    : hasAny
    ? "rgba(15,99,255,0.07)"
    : "transparent";

  const textColor = !isCurrentMonth
    ? "text.disabled"
    : isToday
    ? "#fff"
    : "text.primary";

  const dotColor = isToday ? "rgba(255,255,255,0.85)" : "#0F63FF";

  return (
    <Box
      onClick={isCurrentMonth ? onClick : undefined}
      sx={{
        position: "relative",
        height: 36,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 1.5,
        cursor: isCurrentMonth ? "pointer" : "default",
        bgcolor: bgColor,
        border: isToday ? "none" : hasAny && isCurrentMonth ? "1px solid rgba(15,99,255,0.22)" : isCurrentMonth ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent",
        transition: "all 0.15s ease",
        "&:hover": isCurrentMonth && !isToday
          ? { bgcolor: hasAny ? "rgba(15,99,255,0.12)" : "action.hover", borderColor: "rgba(15,99,255,0.25)" }
          : {},
        gap: "2px",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 11, sm: 12 },
          fontWeight: isToday ? 600 : 400,
          color: textColor,
          lineHeight: 1,
        }}
      >
        {day}
      </Typography>

      {hasAny && isCurrentMonth && (
        <Box sx={{ display: "flex", gap: "2px" }}>
          {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                bgcolor: dotColor,
                opacity: isToday ? 0.85 : 0.7,
              }}
            />
          ))}
          {count > 3 && (
            <Typography sx={{ fontSize: 7, color: isToday ? "rgba(255,255,255,0.8)" : "#0F63FF", lineHeight: 1, ml: "1px" }}>
              +{count - 3}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

// ─── Day Dialog ───────────────────────────────────────────────────────────────

interface DayDialogProps {
  open: boolean;
  date: string;
  candidates: Candidate[];
  onClose: () => void;
}

function DayDialog({ open, date, candidates, onClose }: DayDialogProps) {
  const d = new Date(date + "T00:00:00");
  const label = `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              bgcolor: "rgba(15,99,255,0.09)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarTodayOutlined sx={{ fontSize: 17, color: "#0F63FF" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
              {label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} registered
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "text.secondary" }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {candidates.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonOutlined sx={{ fontSize: 26, color: "text.disabled" }} />
            </Box>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              No candidates registered on this day
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      fontSize: 11,
                      fontWeight: 500,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 1.25,
                      px: 2,
                      bgcolor: "action.hover",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <TableCell>Candidate</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Tier</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((c) => {
                  const statusStyle = STATUS_MAP[c.status];
                  const tierStyle = TIER_COLORS[c.tier] ?? { bg: "rgba(108,117,125,0.10)", color: "#555E68" };
                  const color = avatarColor(c.name);

                  return (
                    <TableRow
                      key={c.id}
                      sx={{
                        "&:last-child td": { border: 0 },
                        "&:hover": { bgcolor: "action.hover" },
                        transition: "background 0.12s",
                      }}
                    >
                      {/* Candidate */}
                      <TableCell sx={{ py: 1.5, px: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: 12,
                              fontWeight: 600,
                              bgcolor: color,
                              flexShrink: 0,
                            }}
                          >
                            {initials(c.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{c.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{c.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Department */}
                      <TableCell sx={{ py: 1.5, px: 2 }}>
                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{c.department}</Typography>
                      </TableCell>

                      {/* Tier */}
                      <TableCell sx={{ py: 1.5, px: 2 }}>
                        <Box
                          component="span"
                          sx={{
                            fontSize: 11,
                            fontWeight: 500,
                            px: 1.25,
                            py: 0.4,
                            borderRadius: 10,
                            bgcolor: tierStyle.bg,
                            color: tierStyle.color,
                            display: "inline-block",
                          }}
                        >
                          {c.tier}
                        </Box>
                      </TableCell>

                      {/* Experience */}
                      <TableCell sx={{ py: 1.5, px: 2 }}>
                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{c.experience}</Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ py: 1.5, px: 2 }}>
                        <Box
                          component="span"
                          sx={{
                            fontSize: 11,
                            fontWeight: 500,
                            px: 1.25,
                            py: 0.4,
                            borderRadius: 10,
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            display: "inline-block",
                          }}
                        >
                          {statusStyle.label}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap" }}>
      {[
        { label: "Has registrations", swatch: "rgba(15,99,255,0.07)", border: "rgba(15,99,255,0.18)" },
        { label: "Today",             swatch: "#0F63FF",               border: "transparent"         },
        { label: "No registrations",  swatch: "transparent",           border: "transparent", muted: true },
      ].map((l) => (
        <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: 0.75,
              bgcolor: l.swatch,
              border: `1px solid ${l.border || "rgba(0,0,0,0.12)"}`,
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: 12, color: l.muted ? "text.disabled" : "text.secondary" }}>
            {l.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────

export default function CandidateCalendar() {
  const [viewYear, setViewYear] = useState(YYYY);
  const [viewMonth, setViewMonth] = useState(MM);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Map: "YYYY-MM-DD" -> candidates[]
  const candidateMap = useMemo(() => {
    const map: Record<string, Candidate[]> = {};
    for (const c of MOCK_CANDIDATES) {
      if (!map[c.registeredAt]) map[c.registeredAt] = [];
      map[c.registeredAt].push(c);
    }
    return map;
  }, []);

  // Build calendar grid
  const { cells, totalDays } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevTotal = new Date(viewYear, viewMonth, 0).getDate();

    const cells: { day: number; month: "prev" | "cur" | "next" }[] = [];

    // Leading days from previous month
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevTotal - i, month: "prev" });

    // Current month days
    for (let d = 1; d <= totalDays; d++) cells.push({ day: d, month: "cur" });

    // Trailing days to complete grid (multiple of 7)
    let trail = 1;
    while (cells.length % 7 !== 0) cells.push({ day: trail++, month: "next" });

    return { cells, totalDays };
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const isToday = (day: number) =>
    viewYear === TODAY.getFullYear() &&
    viewMonth === TODAY.getMonth() &&
    day === TODAY.getDate();

  const dateKey = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const dialogCandidates = selectedDate ? (candidateMap[selectedDate] ?? []) : [];

  // Month summary stats
  const monthTotal = useMemo(() => {
    let n = 0;
    for (let d = 1; d <= totalDays; d++) {
      n += (candidateMap[dateKey(d)] ?? []).length;
    }
    return n;
  }, [viewYear, viewMonth, candidateMap, totalDays]);

  const activeDays = useMemo(() => {
    let n = 0;
    for (let d = 1; d <= totalDays; d++) {
      if ((candidateMap[dateKey(d)] ?? []).length > 0) n++;
    }
    return n;
  }, [viewYear, viewMonth, candidateMap, totalDays]);

  return (
    <Box sx={{ flex: 1, p: "16px 18px", bgcolor: "background.default", display: "flex", flexDirection: "column", gap: 2 }}>

      {/* KPI strip */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
        {[
          { label: "Total this month", value: monthTotal, color: "#0F63FF", bg: "rgba(15,99,255,0.07)" },
          { label: "Active days",       value: activeDays,  color: "#3B6D11", bg: "rgba(59,109,17,0.08)" },
        //   { label: "Avg per day",       value: activeDays ? (monthTotal / activeDays).toFixed(1) : "0", color: "#854F0B", bg: "rgba(133,79,11,0.08)" },
        ].map((k) => (
          <Paper
            key={k.label}
            elevation={0}
            variant="outlined"
            sx={{ borderRadius: 2.5, p: "14px 16px" }}
          >
            <Typography sx={{ fontSize: 11, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>
              {k.label}
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 600, color: k.color, lineHeight: 1 }}>
              {k.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Calendar card */}
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>

        {/* Calendar header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 1.75,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton size="small" onClick={prevMonth} sx={{ color: "text.secondary" }}>
              <ChevronLeft fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={nextMonth} sx={{ color: "text.secondary" }}>
              <ChevronRight fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Day-name header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            px: 1.5,
            pt: 1.25,
            pb: 0.5,
          }}
        >
          {DAY_NAMES.map((d) => (
            <Typography
              key={d}
              sx={{
                textAlign: "center",
                fontSize: 11,
                fontWeight: 500,
                color: "text.disabled",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {d}
            </Typography>
          ))}
        </Box>

        {/* Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "3px",
            p: 1,
          }}
        >
          {cells.map((cell, idx) => {
            const isCur = cell.month === "cur";
            const key = isCur ? dateKey(cell.day) : "";
            const count = isCur ? (candidateMap[key] ?? []).length : 0;

            return (
              <DayCell
                key={idx}
                day={cell.day}
                isToday={isCur && isToday(cell.day)}
                isCurrentMonth={isCur}
                count={count}
                onClick={() => isCur && setSelectedDate(dateKey(cell.day))}
              />
            );
          })}
        </Box>

        {/* Legend */}
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Legend />
        </Box>
      </Paper>

      {/* Day Dialog */}
      {selectedDate && (
        <DayDialog
          open={!!selectedDate}
          date={selectedDate}
          candidates={dialogCandidates}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </Box>
  );
}