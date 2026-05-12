"use client";

import { useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { Filter, Plus } from "lucide-react";
import AdminDataTable, { Candidate } from "./AdminDataTable";
import AdminKpiRow from "./AdminKpiRow";
import AdminTierSelector from "./AdminTierSelector";
import AdminDetailPanel from "./AdminDetailPanel";
import AdminDetailPanelDialog from "./AdminDetailPanelDialog";
import AdminModuleTabs from "./AdminModuleTabs";

export default function ViewYesterdayCandidates() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate((prev) => (prev?.id === candidate.id ? null : candidate));
  };

  return (
    <>
        {/* <AdminModuleTabs /> */}
        <Box sx={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px", backgroundColor: "background.default" }}>
        {/* Table + Panel */}
        <Grid container spacing={2}>
            <Grid  size={{xs:12,md:selectedCandidate ? 8 : 12}} >
            <AdminDataTable selectedCandidateId={selectedCandidate?.id} onRowSelect={handleRowClick} />
            </Grid>
            {/* {selectedCandidate && (
            <Grid size={{xs:12,md:4}}>
                <AdminDetailPanel candidate={selectedCandidate} />
            </Grid>
            )} */}
            {
                selectedCandidate && <AdminDetailPanelDialog open candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
            }
        </Grid>

        </Box>
    </>
  );
}