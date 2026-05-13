"use client";

import { useMemo, useState, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputBase,
  Paper,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { Search, ChevronLeft, ChevronRight, X, Upload, FileText } from "lucide-react";

// ─── Email helper ─────────────────────────────────────────────────────────────
// Calls the Next.js API route /api/send-candidate-email.
// Returns true on success, throws on failure.
async function sendCandidateEmail(candidate: {
  name: string;
  email: string;
  tier: string;
  experience: string;
}): Promise<void> {
  const res = await fetch("/api/send-candidate-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Failed to send email");
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Candidate {
  id: number;
  name: string;
  email: string;
  tier: string;
  experience: string;
  department: string;
  attitude: number;
  behavioral: number;
  psychometric: number | null;
  communication: number;
  overall: number;
  status: "completed" | "in-progress" | "pending";
  resume?: File | null;
}

interface FormValues {
  name: string;
  email: string;
  experience: string;
  resume: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  experience?: string;
  resume?: string;
}

// ─── Static seed data ─────────────────────────────────────────────────────────

const initialCandidates: Candidate[] = [
  { id: 1, name: "Rohan Sinha",   email: "rohan@example.com",   tier: "Senior",     experience: "3–5 yrs",  department: "Engineering", attitude: 78, behavioral: 71, psychometric: null, communication: 82, overall: 76, status: "in-progress" },
  { id: 2, name: "Priya Mehta",   email: "priya@example.com",   tier: "Lead",       experience: "5–7 yrs",  department: "Product",     attitude: 78, behavioral: 71, psychometric: null, communication: 82, overall: 88, status: "completed"   },
  { id: 3, name: "Arjun Kapoor",  email: "arjun@example.com",   tier: "Leadership", experience: "12+ yrs",  department: "Strategy",    attitude: 78, behavioral: 71, psychometric: null, communication: 82, overall: 91, status: "completed"   },
  { id: 4, name: "Sneha Rao",     email: "sneha@example.com",   tier: "Manager",    experience: "7–12 yrs", department: "Operations",  attitude: 78, behavioral: 71, psychometric: null, communication: 82, overall: 69, status: "in-progress" },
  { id: 5, name: "Vikram Nair",   email: "vikram@example.com",  tier: "Fresher",    experience: "0–3 yrs",  department: "Sales",       attitude: 78, behavioral: 71, psychometric: null, communication: 82, overall: 62, status: "pending"     },
  { id: 6, name: "Divya Joshi",   email: "divya@example.com",   tier: "Senior",     experience: "3–5 yrs",  department: "Engineering", attitude: 78, behavioral: 71, psychometric: null, communication: 82, overall: 74, status: "completed"   },
  { id: 7, name: "Karan Desai",   email: "karan@example.com",   tier: "Lead",       experience: "5–7 yrs",  department: "Marketing",   attitude: 78, behavioral: 71, psychometric: null, communication: 82, overall: 83, status: "completed"   },
  { id: 8, name: "Meera Pillai",  email: "meera@example.com",   tier: "Leadership", experience: "12+ yrs",  department: "Leadership",  attitude: 78, behavioral: 71, psychometric: null, communication: 82, overall: 94, status: "completed"   },
];

const statusStyles = {
  completed:   { bg: "rgba(92, 184, 92, 0.12)",   color: "#32A852", label: "Completed"   },
  "in-progress": { bg: "rgba(255, 193, 7, 0.12)", color: "#E1A500", label: "In Progress" },
  pending:     { bg: "rgba(108, 117, 125, 0.12)", color: "#6C757D", label: "Pending"     },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY_FORM: FormValues = { name: "", email: "", experience: "", resume: null };

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.experience.trim()) {
    errors.experience = "Experience is required.";
  } else if (isNaN(Number(values.experience)) || Number(values.experience) < 0) {
    errors.experience = "Enter a valid number of years (e.g. 3).";
  }

  if (!values.resume) {
    errors.resume = "Resume is required.";
  } else {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(values.resume.type)) {
      errors.resume = "Only PDF or Word documents are accepted.";
    } else if (values.resume.size > 5 * 1024 * 1024) {
      errors.resume = "File size must not exceed 5 MB.";
    }
  }

  return errors;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Drag-and-drop / click-to-upload resume field */
function ResumeUpload({
  value,
  error,
  onChange,
}: {
  value: File | null;
  error?: string;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", mb: 0.5 }}>
        Resume <Box component="span" sx={{ color: "error.main" }}>*</Box>
      </Typography>

      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        sx={{
          border: "1.5px dashed",
          borderColor: error ? "error.main" : dragging ? "#0F63FF" : "divider",
          borderRadius: 2,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          bgcolor: dragging ? "rgba(15,99,255,0.04)" : error ? "rgba(211,47,47,0.03)" : "#FAFBFC",
          transition: "all 0.2s ease",
          "&:hover": { borderColor: "#0F63FF", bgcolor: "rgba(15,99,255,0.04)" },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".pdf,.doc,.docx"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />

        {value ? (
          /* File selected state */
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: 1.5,
                bgcolor: "rgba(15,99,255,0.1)", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <FileText size={18} color="#0F63FF" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value.name}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                {formatBytes(value.size)}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
              sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
            >
              <X size={14} />
            </IconButton>
          </Box>
        ) : (
          /* Empty state */
          <>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: 2,
                bgcolor: "rgba(15,99,255,0.08)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Upload size={18} color="#0F63FF" />
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
              Click to upload or drag & drop
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              PDF or Word — max 5 MB
            </Typography>
          </>
        )}
      </Box>

      {error && (
        <Typography sx={{ fontSize: 11.5, color: "error.main", mt: 0.5 }}>{error}</Typography>
      )}
    </Box>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function AdminDashboardCandidateList() {
  // ── Table state ──────────────────────────────────────────────────────────
  const [candidateList, setCandidateList] = useState<Candidate[]>(initialCandidates);
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // ── Dialog state ─────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // ── Snackbar state ───────────────────────────────────────────────────────
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({
    open: false, message: "", severity: "success",
  });

  // ── Filtered / paginated rows ────────────────────────────────────────────
  const filteredCandidates = useMemo(
    () => candidateList.filter((c) =>
      c.name.toLowerCase().includes(filterText.toLowerCase()) ||
      c.department.toLowerCase().includes(filterText.toLowerCase()) ||
      c.tier.toLowerCase().includes(filterText.toLowerCase())
    ),
    [candidateList, filterText]
  );

  const paginatedCandidates = useMemo(
    () => filteredCandidates.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [filteredCandidates, page]
  );

  const pageCount = Math.ceil(filteredCandidates.length / rowsPerPage) || 1;

  // ── Dialog handlers ──────────────────────────────────────────────────────
  const openDialog = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const handleFieldChange = (field: keyof FormValues, value: string | File | null) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    // Re-validate touched field immediately
    if (touched[field]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({ name: true, email: true, experience: true, resume: true });
    const newErrors = validate(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Stop if errors

    // Build new candidate row
    const expYears = Number(form.experience);
    const tier =
      expYears === 0 ? "Fresher" :
      expYears <= 3  ? "Junior"  :
      expYears <= 5  ? "Senior"  :
      expYears <= 7  ? "Lead"    :
      expYears <= 12 ? "Manager" : "Leadership";

    const expLabel =
      expYears === 0  ? "0–3 yrs"  :
      expYears <= 3   ? "0–3 yrs"  :
      expYears <= 5   ? "3–5 yrs"  :
      expYears <= 7   ? "5–7 yrs"  :
      expYears <= 12  ? "7–12 yrs" : "12+ yrs";

    const newCandidate: Candidate = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      tier,
      experience: expLabel,
      department: "—",
      attitude: 0,
      behavioral: 0,
      psychometric: null,
      communication: 0,
      overall: 0,
      status: "pending",
      resume: form.resume,
    };

    setSubmitting(true);

    try {
      // 1. Trigger welcome email to the candidate
      await sendCandidateEmail({
        name: newCandidate.name,
        email: newCandidate.email,
        tier: newCandidate.tier,
        experience: newCandidate.experience,
      });

      // 2. Add to table only after email succeeds
      setCandidateList((prev) => [newCandidate, ...prev]);
      setPage(0);
      closeDialog();

      setSnackbar({
        open: true,
        message: `${newCandidate.name} added & welcome email sent to ${newCandidate.email}`,
        severity: "success",
      });
    } catch (err) {
      // Email failed — still add the candidate but warn the user
      setCandidateList((prev) => [newCandidate, ...prev]);
      setPage(0);
      closeDialog();

      setSnackbar({
        open: true,
        message: `${newCandidate.name} added, but email failed: ${(err as Error).message}`,
        severity: "warning",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>

      {/* ── Page header ── */}
      <Box sx={{ display: "flex", p: 2, flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2 }}>
        <Typography variant="h5" sx={{ color: "text.primary" }}>
          All candidates
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: 2, borderColor: "divider", color: "text.primary", minWidth: 110 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            onClick={openDialog}
            sx={{ textTransform: "none", borderRadius: 2, minWidth: 150, backgroundColor: "#0F63FF", color: "#fff", "&:hover": { backgroundColor: "#0B54D6" } }}
          >
            Add candidate
          </Button>
        </Box>
      </Box>

      {/* ── Table card ── */}
      <Paper
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.06)",
          background: "linear-gradient(180deg,#FFFFFF 0%,#FBFCFE 100%)",
          overflow: "hidden",
        }}
      >
        {/* Filter bar */}
        <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
              Candidates
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", mt: 0.5 }}>
              {candidateList.length} records
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
            <Box
              sx={{
                display: "flex", alignItems: "center", gap: 1,
                px: 2, py: 1, borderRadius: 2,
                backgroundColor: "background.default",
                border: "1px solid", borderColor: "divider", minWidth: 240,
              }}
            >
              <Search size={16} color="currentColor" />
              <InputBase
                placeholder="Filter candidates..."
                value={filterText}
                onChange={(e) => { setFilterText(e.target.value); setPage(0); }}
                fullWidth
                sx={{ color: "text.primary" }}
              />
            </Box>
            <Button variant="outlined" sx={{ textTransform: "none", borderRadius: 2, color: "text.primary", borderColor: "divider" }}>Tier</Button>
            <Button variant="outlined" sx={{ textTransform: "none", borderRadius: 2, color: "text.primary", borderColor: "divider" }}>Status</Button>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer sx={{ backgroundColor: "background.paper" }}>
          <Table
            size="small"
            sx={{
              tableLayout: "fixed",
              "& .MuiTableCell-root": { fontSize: "12px", py: 1, px: 1.5, borderColor: "rgba(0,0,0,0.06)", whiteSpace: "nowrap" },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#FAFBFC",
                  "& .MuiTableCell-root": { fontWeight: 600, fontSize: "10px", letterSpacing: "0.04em", textTransform: "uppercase", color: "text.secondary" },
                }}
              >
                <TableCell align="center" sx={{ px: 2, py: 2, width: 160, borderBottom: "1px solid", borderColor: "divider" }}>Candidate</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, width: 180, borderBottom: "1px solid", borderColor: "divider" }}>Experience tier</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, width: 130, borderBottom: "1px solid", borderColor: "divider" }}>Email</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, width: 100, borderBottom: "1px solid", borderColor: "divider" }}>Department</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, width: 100, borderBottom: "1px solid", borderColor: "divider" }}>Attitude</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, width: 100, borderBottom: "1px solid", borderColor: "divider" }}>Behavioral</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, width: 100, borderBottom: "1px solid", borderColor: "divider" }}>Psychometric</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, width: 120, borderBottom: "1px solid", borderColor: "divider" }}>Communication</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2, width: 80,  borderBottom: "1px solid", borderColor: "divider" }}>Overall</TableCell>
                <TableCell align="center" sx={{ px: 2, py: 2,             borderBottom: "1px solid", borderColor: "divider" }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedCandidates.map((candidate) => {
                const status = statusStyles[candidate.status as keyof typeof statusStyles];
                return (
                  <TableRow
                    hover
                    key={candidate.id}
                    sx={{ cursor: "pointer", transition: "all 0.15s ease", "&:hover": { backgroundColor: "#F5F8FF" } }}
                  >
                    <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: "10px" }}>
                          {candidate.name.split(" ").map((p) => p[0]).join("")}
                        </Avatar>
                        <Typography sx={{ color: "text.primary", fontSize: 12 }}>{candidate.name}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.75, borderRadius: 12, backgroundColor: "rgba(15,99,255,0.08)", color: "primary.main", fontWeight: 600 }}>
                        {candidate.tier}
                        <Typography component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
                          {candidate.experience}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.secondary", fontSize: 12 }}>
                      {candidate.email}
                    </TableCell>

                    <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>{candidate.department}</TableCell>
                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>{candidate.attitude ? `${candidate.attitude}%` : "—"}</TableCell>
                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>{candidate.behavioral ? `${candidate.behavioral}%` : "—"}</TableCell>
                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>
                      {candidate.psychometric != null ? `${candidate.psychometric}%` : "—"}
                    </TableCell>
                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", color: "text.primary" }}>{candidate.communication ? `${candidate.communication}%` : "—"}</TableCell>
                    <TableCell align="center" sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", fontWeight: 700, color: candidate.overall >= 85 ? "#2ECC71" : candidate.overall >= 70 ? "#E1A500" : candidate.overall > 0 ? "#F39C12" : "text.secondary" }}>
                      {candidate.overall ? `${candidate.overall}%` : "—"}
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Box sx={{ display: "inline-block", px: 1.5, py: 0.25, borderRadius: 6, bgcolor: status.bg, color: status.color, fontWeight: 600, fontSize: 11 }}>
                        {status.label}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
            Showing {paginatedCandidates.length} of {filteredCandidates.length} candidates
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton size="small" onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <ChevronLeft size={16} />
            </IconButton>
            {Array.from({ length: pageCount }, (_, i) => (
              <Button
                key={i}
                onClick={() => setPage(i)}
                sx={{
                  minWidth: 38, px: 1.5,
                  color: i === page ? "#fff" : "text.primary",
                  backgroundColor: i === page ? "primary.main" : "background.paper",
                  borderRadius: 1.5, border: "1px solid", borderColor: "divider",
                  "&:hover": { backgroundColor: i === page ? "primary.dark" : "rgba(15,99,255,0.08)" },
                }}
              >
                {i + 1}
              </Button>
            ))}
            <IconButton size="small" onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))} disabled={page === pageCount - 1} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <ChevronRight size={16} />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* ── Add Candidate Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: { sx: { borderRadius: 3, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" } },
        }}
      >
        {/* Dialog Header */}
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 17, color: "text.primary" }}>
                Add Candidate
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.3 }}>
                Fill in the details below to add a new candidate.
              </Typography>
            </Box>
            <IconButton size="small" onClick={closeDialog} disabled={submitting} sx={{ color: "text.secondary", bgcolor: "#F4F6F8", "&:hover": { bgcolor: "#E8EAED" } }}>
              <X size={16} />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        {/* Dialog Body */}
        <DialogContent sx={{ pt: 2.5, pb: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>

          {/* Name */}
          <TextField
            label="Full Name"
            placeholder="e.g. Rohan Sinha"
            fullWidth
            required
            size="small"
            value={form.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            slotProps={{ input: { sx: { borderRadius: 1.5 } } }}
          />

          {/* Email */}
          <TextField
            label="Email Address"
            placeholder="e.g. rohan@company.com"
            type="email"
            fullWidth
            required
            size="small"
            value={form.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            slotProps={{ input: { sx: { borderRadius: 1.5 } } }}
          />

          {/* Experience */}
          <TextField
            label="Years of Experience"
            placeholder="e.g. 4"
            type="number"
            fullWidth
            required
            size="small"
            value={form.experience}
            onChange={(e) => handleFieldChange("experience", e.target.value)}
            onBlur={() => handleBlur("experience")}
            error={touched.experience && !!errors.experience}
            helperText={
              (touched.experience && errors.experience) ||
              "Enter total years — tier will be assigned automatically."
            }
            slotProps={{ htmlInput: { min: 0, step: 1 }, input: { sx: { borderRadius: 1.5 } } }}
          />

          {/* Resume upload */}
          <ResumeUpload
            value={form.resume}
            error={touched.resume ? errors.resume : undefined}
            onChange={(file) => {
              handleFieldChange("resume", file);
              setTouched((prev) => ({ ...prev, resume: true }));
            }}
          />
        </DialogContent>

        {/* Dialog Footer */}
        <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
          <Button
            onClick={closeDialog}
            disabled={submitting}
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: 2, borderColor: "divider", color: "text.primary", minWidth: 90, "&:hover": { borderColor: "#bbb" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : null}
            sx={{ textTransform: "none", borderRadius: 2, minWidth: 130, bgcolor: "#0F63FF", "&:hover": { bgcolor: "#0B54D6" }, "&.Mui-disabled": { bgcolor: "#0F63FF", opacity: 0.7 } }}
          >
            {submitting ? "Saving..." : "Save Candidate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontSize: 13, alignItems: "center" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}