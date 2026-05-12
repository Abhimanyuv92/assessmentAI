"use client";

import { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Settings } from "lucide-react";

export default function AdminTierSelector() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tiers = [
    { id: 1, name: "Entry Level", years: "0-2 years", color: "#EBF2FF", textColor: "#1560BD" },
    { id: 2, name: "Mid Level", years: "3-5 years", color: "#FFF3E0", textColor: "#B7660A" },
    { id: 3, name: "Senior Level", years: "6-8 years", color: "#E6F5EC", textColor: "#1E8C45" },
    { id: 4, name: "Lead Level", years: "9-11 years", color: "#F5F0FF", textColor: "#6B21A8" },
    { id: 5, name: "Executive", years: "12+ years", color: "#FDEDEC", textColor: "#C0392B" },
  ];

  if (!mounted) {
    return (
      <Box
        sx={{
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "6px",
          padding: "14px",
          minHeight: "120px",
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "6px",
        padding: "14px",
      }}
    >
      <Typography
        sx={{
          fontWeight: 500,
          color: "text.primary",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <Settings size={15} />
        Experience tier configuration
      </Typography>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))", lg: "repeat(5, minmax(0, 1fr))" }, gap: "10px" }}>
        {tiers.map((tier) => (
          <Box
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "8px 10px",
              border: "1px solid",
              borderColor: selectedTier === tier.id ? "secondary.main" : "divider",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all .15s",
              backgroundColor: selectedTier === tier.id ? "rgba(255, 214, 0, 0.05)" : "background.paper",
              "&:hover": {
                borderColor: "secondary.light",
                backgroundColor: "rgba(255, 214, 0, 0.1)",
              },
            }}
          >
           
             <Typography
                sx={{
                  fontWeight: 500,
                  color: selectedTier === tier.id ? "secondary.main" : "text.primary",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                 <Box
                    sx={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: tier.color,
                    }}
                />
                {tier.name}
              </Typography>
              <Typography
                sx={{
                  color: selectedTier === tier.id ? "secondary.main" : "text.secondary",
                }}
              >
                {tier.years}
              </Typography> 
          </Box>
        ))}
      </Box>
    </Box>
  );
}