"use client";

import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const candidates = [
  {
    id: 1,
    name: "Rohan Sinha",
    tier: "Senior",
    experience: "3–5 yrs",
    department: "Engineering",
    attitude: 78,
    behavioral: 71,
    psychometric: null,
    communication: 82,
    overall: 76,
    status: "in-progress",
  },
  {
    id: 2,
    name: "Priya Mehta",
    tier: "Lead",
    experience: "5–7 yrs",
    department: "Product",
    attitude: 78,
    behavioral: 71,
    psychometric: null,
    communication: 82,
    overall: 88,
    status: "completed",
  },
  {
    id: 3,
    name: "Arjun Kapoor",
    tier: "Leadership",
    experience: "12+ yrs",
    department: "Strategy",
    attitude: 78,
    behavioral: 71,
    psychometric: null,
    communication: 82,
    overall: 91,
    status: "completed",
  },
  {
    id: 4,
    name: "Sneha Rao",
    tier: "Manager",
    experience: "7–12 yrs",
    department: "Operations",
    attitude: 78,
    behavioral: 71,
    psychometric: null,
    communication: 82,
    overall: 69,
    status: "in-progress",
  },
  {
    id: 5,
    name: "Vikram Nair",
    tier: "Fresher",
    experience: "0–3 yrs",
    department: "Sales",
    attitude: 78,
    behavioral: 71,
    psychometric: null,
    communication: 82,
    overall: 62,
    status: "pending",
  },
  {
    id: 6,
    name: "Divya Joshi",
    tier: "Senior",
    experience: "3–5 yrs",
    department: "Engineering",
    attitude: 78,
    behavioral: 71,
    psychometric: null,
    communication: 82,
    overall: 74,
    status: "completed",
  },
  {
    id: 7,
    name: "Karan Desai",
    tier: "Lead",
    experience: "5–7 yrs",
    department: "Marketing",
    attitude: 78,
    behavioral: 71,
    psychometric: null,
    communication: 82,
    overall: 83,
    status: "completed",
  },
  {
    id: 8,
    name: "Meera Pillai",
    tier: "Leadership",
    experience: "12+ yrs",
    department: "Leadership",
    attitude: 78,
    behavioral: 71,
    psychometric: null,
    communication: 82,
    overall: 94,
    status: "completed",
  },
];

const statusStyles = {
  completed: {
    bg: "rgba(92, 184, 92, 0.12)",
    color: "#32A852",
    label: "Completed",
  },
  "in-progress": {
    bg: "rgba(255, 193, 7, 0.12)",
    color: "#E1A500",
    label: "In Progress",
  },
  pending: {
    bg: "rgba(108, 117, 125, 0.12)",
    color: "#6C757D",
    label: "Pending",
  },
};

export default function AdminDashboardCandidateList() {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const filteredCandidates = useMemo(
    () =>
      candidates.filter((candidate) =>
        candidate.name.toLowerCase().includes(filterText.toLowerCase()) ||
        candidate.department.toLowerCase().includes(filterText.toLowerCase()) ||
        candidate.tier.toLowerCase().includes(filterText.toLowerCase())
      ),
    [filterText]
  );

  const paginatedCandidates = useMemo(
    () =>
      filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredCandidates, page]
  );

  const pageCount = Math.ceil(filteredCandidates.length / rowsPerPage) || 1;

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", p: 2, flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{  color: "text.primary" }}>
            All candidates
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: "divider",
              color: "text.primary",
              minWidth: 110,
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              minWidth: 150,
              backgroundColor: "#0F63FF",
              color: "#fff",
              '&:hover': { backgroundColor: "#0B54D6" },
            }}
          >
            Add candidate
          </Button>
        </Box>
      </Box>

       <Paper sx={{
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.06)',
            background:
            'linear-gradient(180deg,#FFFFFF 0%,#FBFCFE 100%)',
            mb:4
        }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "text.primary" }}>Candidate registry</Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", mt: 0.5 }}>
              {candidates.length} records
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: "background.default",
                border: "1px solid",
                borderColor: "divider",
                minWidth: 240,
              }}
            >
              <Search size={16} color="currentColor" />
              <InputBase
                placeholder="Filter candidates..."
                value={filterText}
                onChange={(event) => {
                  setFilterText(event.target.value);
                  setPage(0);
                }}
                fullWidth
                sx={{ color: "text.primary" }}
              />
            </Box>
            <Button
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: 2, color: "text.primary", borderColor: "divider" }}
            >
              Tier
            </Button>
            <Button
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: 2, color: "text.primary", borderColor: "divider" }}
            >
              Status
            </Button>
          </Box>
        </Box>

        <TableContainer sx={{ backgroundColor: "background.paper" }}>
          <Table
            size="small"
            sx={{
                tableLayout: "fixed",

                '& .MuiTableCell-root': {
                fontSize: '12px',
                py: 1,
                px: 1.5,
                borderColor: 'rgba(0,0,0,0.06)',
                whiteSpace: 'nowrap',
                },
            }}
            >
            <TableHead>
             <TableRow
                sx={{
                    backgroundColor: '#FAFBFC',

                    '& .MuiTableCell-root': {
                    fontWeight: 600,
                    fontSize: '10px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    },
                }}
                >
                {/* <TableCell sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, border: "1px solid", borderColor: "divider", borderRadius: 0.5 }} />
                  </Box>
                </TableCell> */}
                <TableCell align="center" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider",width:140 }}>Candidate</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider",width:180 }}>Experience tier</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider", width:100 }}>Department</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider", width:100 }}>Attitude</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider", width:100 }}>Behavioral</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider", width:100 }}>Psychometric</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider", width:120 }}>Communication</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider", width:120 }}>Overall</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 700, borderBottom: "1px solid", borderColor: "divider" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {paginatedCandidates.map((candidate) => {
                const status = statusStyles[candidate.status as keyof typeof statusStyles];
                return (
                 
                    <TableRow
                        hover
                        key={candidate.id}
                        sx={{
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',

                            '&:hover': {
                            backgroundColor: '#F5F8FF',
                            },
                        }}
                    >
                    {/* <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Box sx={{ width: 16, height: 16, border: "1px solid", borderColor: "divider", borderRadius: 0.5 }} />
                    </TableCell> */}
                    <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                            sx={{
                                width: 24,
                                height: 24,
                                fontSize: '10px',
                            }}
                            >
                          {candidate.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </Avatar>
                        <Typography sx={{ color: "text.primary" }}>{candidate.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align='center' sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.75, borderRadius: 12, backgroundColor: "rgba(15, 99, 255, 0.08)", color: "primary.main", fontWeight: 600 }}>
                        {candidate.tier}
                        <Typography component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
                          {candidate.experience}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>{candidate.department}</TableCell>
                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>{candidate.attitude}%</TableCell>
                    <TableCell  align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>{candidate.behavioral}%</TableCell>
                    <TableCell align="center"  sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>
                      {candidate.psychometric != null ? `${candidate.psychometric}%` : "—"}
                    </TableCell>
                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>{candidate.communication}%</TableCell>
                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: candidate.overall >= 85 ? "#2ECC71" : candidate.overall >= 70 ? "#E1A500" : "#F39C12", fontWeight: 700 }}>
                      {candidate.overall}%
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider" }}>
                        <Box
                        sx={{
                            px: 1.5,
                            py: 0.25,
                            borderRadius: 6,
                            letterSpacing: '0.02em',
                        }}
                        > {status.label}
                        </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
            Showing {paginatedCandidates.length} of {filteredCandidates.length} candidates
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
            >
              <ChevronLeft size={16} />
            </IconButton>
            {Array.from({ length: pageCount }, (_, index) => (
              <Button
                key={index}
                onClick={() => setPage(index)}
                sx={{
                  minWidth: 38,
                  px: 1.5,
                  color: index === page ? "#fff" : "text.primary",
                  backgroundColor: index === page ? "primary.main" : "background.paper",
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  '&:hover': { backgroundColor: index === page ? "primary.dark" : "rgba(15, 99, 255, 0.08)" },
                }}
              >
                {index + 1}
              </Button>
            ))}
            <IconButton
              size="small"
              onClick={() => setPage((prev) => Math.min(prev + 1, pageCount - 1))}
              disabled={page === pageCount - 1}
              sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
            >
              <ChevronRight size={16} />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
