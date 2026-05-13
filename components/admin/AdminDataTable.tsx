"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar,
  Button,
  InputBase,
} from "@mui/material";
import { Users, Settings, Columns, Search } from "lucide-react";

export interface Candidate {
  id: number;
  name: string;
  tier: string;
  department: string;
  modules: Record<string, number | null>;
  score: number;
  status: string;
  assignedBy:string,
  assignedOn:string
}

// Mock data
const candidates: Candidate[] = [
  {
    id: 1,
    name: "Rohan Sinha",
    tier: "Senior",
    department: "Engineering",
    modules: { attitude: 85, behavioral: 78, psychometric: 82, communication: 88 },
    score: 83,
    status: "completed",
    assignedBy:"Alice Johnson",
   assignedOn:"10 May, 2024"
  },
  {
    id: 2,
    name: "Priya Patel",
    tier: "Mid",
    department: "Marketing",
    modules: { attitude: 92, behavioral: 75, psychometric: null, communication: null },
    score: 46,
    status: "in-progress",
    assignedBy:"Bob Smith",
   assignedOn:"12 May, 2024"
  },
  {
    id: 3,
    name: "Arjun Kumar",
    tier: "Senior",
    department: "Sales",
    modules: { attitude: 78, behavioral: 85, psychometric: 80, communication: 90 },
    score: 83,
    status: "completed",
    assignedBy:"Charlie Davis",
   assignedOn:"8 May, 2024"
  },
  {
    id: 4,
    name: "Sneha Reddy",
    tier: "Junior",
    department: "Customer Support",
    modules: { attitude: 88, behavioral: null, psychometric: null, communication: null },
    score: 20,
    status: "pending",
    assignedBy:"Diana Wilson",
   assignedOn:"15 May, 2024",
  },
  {
    id: 5,
    name: "Vikram Singh",
    tier: "Mid",  
    department: "Engineering",
    modules: { attitude: 80, behavioral: 70, psychometric: 75, communication: null },
    score: 56,
    status: "in-progress",
    assignedBy:"Ethan Brown",
   assignedOn:"11 May, 2024"
  }
];

interface AdminDataTableProps {
  selectedCandidateId?: number;
  onRowSelect?: (candidate: Candidate) => void;
}

export default function AdminDataTable({ selectedCandidateId, onRowSelect }: AdminDataTableProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [filterText, setFilterText] = useState("");

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? candidates.map(c => c.id) : []);
  };

  const handleSelect = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getStatusPill = (status: string) => {
    const styles = {
      completed: { bg: "rgba(76, 175, 80, 0.1)", color: "#4CAF50", text: "Completed" },
      "in-progress": { bg: "rgba(255, 152, 0, 0.1)", color: "#FF9800", text: "In Progress" },
      pending: { bg: "rgba(96, 125, 139, 0.1)", color: "#607D8B", text: "Pending" },
    };
    const style = styles[status as keyof typeof styles] || styles.pending;
    return (
      <Box
        sx={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: "3px",
          fontWeight: 500,
          backgroundColor: style.bg,
          color: style.color,
        }}
      >
        {style.text}
      </Box>
    );
  };

  const getScoreBar = (score: number | null) => {
    if (score === null) return <Box sx={{ width: 60, height: 4, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "2px" }} />;
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Box sx={{ width: 60, height: 4, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "2px", position: "relative" }}>
          <Box
            sx={{
              width: `${score}%`,
              height: "100%",
              backgroundColor: score >= 80 ? "#4CAF50" : score >= 70 ? "#FF9800" : "#F44336",
              borderRadius: "2px",
            }}
          />
        </Box>
        <Typography sx={{ color: "text.secondary" }}>{score}%</Typography>
      </Box>
    );
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ padding: "10px 14px", borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 500, color: "text.primary", display: "flex", alignItems: "center", gap: "6px" }}>
          <Users size={15}  />
          Recent candidates
        </Typography>
        <Box sx={{ display: "flex", gap: "6px" }}>
          <Box sx={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", color: "text.secondary" }} />
            <InputBase
              placeholder="Search by name…"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              sx={{
                padding: "4px 8px 4px 24px",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "4px",
                backgroundColor: "background.default",
                color: "text.primary",
              }}
            />
          </Box>
          <Button
            sx={{
              padding: "5px 9px",
              backgroundColor: "background.paper",
              color: "text.secondary",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "4px",
              minWidth: "auto",
              "&:hover": { backgroundColor: "rgba(255, 214, 0, 0.1)" },
            }}
          >
            <Settings size={14} />
          </Button>
          <Button
            sx={{
              padding: "5px 9px",
              backgroundColor: "background.paper",
              color: "text.secondary",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "4px",
              minWidth: "auto",
              "&:hover": { backgroundColor: "rgba(255, 214, 0, 0.1)" },
            }}
          >
            <Columns size={14} />
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(255, 214, 0, 0.05)", borderBottom: "1px solid", borderColor: "divider" }} >
              {/* <TableCell sx={{ padding: "7px 10px", color: "text.secondary", fontWeight: 500 }}>
                <Checkbox
                  size="small"
                  checked={selected.length === candidates.length}
                  indeterminate={selected.length > 0 && selected.length < candidates.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell> */}
              <TableCell sx={{ padding: "7px 10px", color: "text.secondary", fontWeight: 500 }}>
                Candidate
              </TableCell>
              <TableCell sx={{ padding: "7px 10px", color: "text.secondary", fontWeight: 500 }}>
                Tier
              </TableCell>
              <TableCell sx={{ padding: "7px 10px", color: "text.secondary", fontWeight: 500 }}>
                Department
              </TableCell>
              <TableCell sx={{ padding: "7px 10px", color: "text.secondary", fontWeight: 500 }}>
                Modules
              </TableCell>
              <TableCell sx={{ padding: "7px 10px", color: "text.secondary", fontWeight: 500 }}>
                Score
              </TableCell>
              <TableCell sx={{ padding: "7px 10px", color: "text.secondary", fontWeight: 500 }}>
                Status
              </TableCell>
              {/* <TableCell sx={{ padding: "7px 10px", color: "text.secondary", fontWeight: 500 }}>
                Action
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCandidates.map((candidate) => (
              <TableRow
                key={candidate.id}
                sx={{
                  cursor: "pointer",
                  transition: "background .12s",
                  "&:hover": { backgroundColor: "rgba(255, 214, 0, 0.05)" },
                  backgroundColor: selected.includes(candidate.id) ? "rgba(255, 214, 0, 0.1)" : "transparent",
                }}
                onClick={() => onRowSelect && onRowSelect(candidate)}
              >
                {/* <TableCell sx={{ padding: "8px 10px", borderBottom: "1px solid", borderColor: "rgba(255, 255, 255, 0.12)" }}>
                  <Checkbox
                    size="small"
                    checked={selected.includes(candidate.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelect(candidate.id);
                    }}
                  />
                </TableCell> */}
                <TableCell sx={{ padding: "8px 10px", borderBottom: "1px solid", borderColor: "rgba(255, 255, 255, 0.12)", color: "text.primary", verticalAlign: "middle" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Avatar sx={{ width: 26, height: 26, fontWeight: 500, fontSize: "14px" }}>
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </Avatar>
                    <Typography sx={{ fontWeight: 500 }}>
                      {candidate.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ padding: "8px 10px", borderBottom: "1px solid", borderColor: "rgba(255, 255, 255, 0.12)", color: "text.primary" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "3px",
                      fontWeight: 500,
                      backgroundColor: "rgba(255, 214, 0, 0.1)",
                    }}
                  >
                    {candidate.tier}
                  </Box>
                </TableCell>
                <TableCell sx={{ padding: "8px 10px", borderBottom: "1px solid", borderColor: "rgba(255, 255, 255, 0.12)", color: "text.primary" }}>
                  {candidate.department}
                </TableCell>
                <TableCell sx={{ padding: "8px 10px" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {/* {Object.entries(candidate.modules).map(([key, value]) => (
                      <Box key={key} sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Typography sx={{ color: "text.secondary", minWidth: "60px" }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Typography>
                        {getScoreBar(value)}
                      </Box>
                    ))} */}
                    {Object.values(candidate.modules).filter((v) => v && v > 0).length}/4

                  </Box>
                </TableCell>
                <TableCell sx={{ padding: "8px 10px", borderBottom: "1px solid", borderColor: "rgba(255, 255, 255, 0.12)", color: "text.primary", fontWeight: 500 }}>
                  {getScoreBar(candidate.score)}
                </TableCell>
                <TableCell sx={{ padding: "8px 10px", borderBottom: "1px solid", borderColor: "rgba(255, 255, 255, 0.12)", color: "text.primary" }}>
                  {getStatusPill(candidate.status)}
                </TableCell>
                {/* <TableCell sx={{ padding: "8px 10px", borderBottom: "1px solid", borderColor: "rgba(255, 255, 255, 0.12)", color: "text.primary" }}>
                  <Button
                    sx={{
                      padding: "4px 8px",
                      minWidth: "auto",
                      backgroundColor: "background.paper",
                      color: "text.secondary",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "3px",
                      "&:hover": { backgroundColor: "rgba(255, 214, 0, 0.1)" },
                    }}
                  >
                    View
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box sx={{ padding: "8px 14px", borderTop: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", color: "text.secondary" }}>
        <Typography>{filteredCandidates.length} of {candidates.length} candidates</Typography>
        {/* <Box sx={{ display: "flex", gap: "4px" }}>
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              sx={{
                padding: "3px 8px",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "3px",
                // backgroundColor: page === 1 ? "secondary.main" : "background.paper",
                color: page === 1 ? "primary.main" : "text.secondary",
                minWidth: "auto",
                "&:hover": { backgroundColor: page === 1 ? "secondary.light" : "rgba(255, 214, 0, 0.1)" },
              }}
            >
              {page}
            </Button>
          ))}
        </Box> */}
      </Box>
    </Box>
  );
}