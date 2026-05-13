"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Code, Zap, Users, BarChart3 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <Code size={32} />,
      title: "Coding Assessments",
      description: "Create and manage coding challenges with real-time evaluation.",
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Feedback",
      description: "Get immediate results and detailed performance insights.",
    },
    {
      icon: <Users size={32} />,
      title: "Candidate Management",
      description: "Track and manage candidates through the hiring pipeline.",
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Analytics & Reports",
      description: "Comprehensive reports and analytics for data-driven decisions.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#202A42" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #202A42 0%, #273453 100%)",
          py: { xs: 6, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              color: "#E6EBF4",
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Assess Talent with{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #FFD600, #FFF9C4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI-Powered Precision
            </Box>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#B0B8D1",
              mb: 6,
              maxWidth: 700,
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.25rem" },
              lineHeight: 1.6,
            }}
          >
            A modern coding assessment platform for recruiters and candidates. Create, manage, and evaluate technical skills with real-time feedback.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ mb: 2, justifyContent: "center" }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/auth")}
              sx={{
                backgroundColor: "#FFD600",
                color: "#202A42",
                px: 5,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                minWidth: 180,
                "&:hover": {
                  backgroundColor: "#FFE66D",
                },
              }}
            >
              Get Started Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#E6EBF4",
                color: "#E6EBF4",
                px: 5,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                minWidth: 180,
                "&:hover": {
                  backgroundColor: "rgba(255, 214, 0, 0.1)",
                  borderColor: "#FFD600",
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              color: "#E6EBF4",
              mb: 3,
              textAlign: "center",
            }}
          >
            Why Choose Nexon AI?
          </Typography>
          <Typography
            sx={{
              color: "#B0B8D1",
              mb: 6,
              textAlign: "center",
              fontSize: "1.1rem",
            }}
          >
            Everything you need for smarter hiring decisions
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid key={index} size={{xs:12, sm: 6, md: 3}}>
                <Card
                  sx={{
                    backgroundColor: "#273453",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, boxShadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(255, 214, 0, 0.15)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        color: "#FFD600",
                        mb: 2,
                        display: "flex",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#E6EBF4",
                        mb: 1,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#B0B8D1",
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #273453 0%, #28365A 100%)",
          py: { xs: 6, md: 8 },
          textAlign: "center",
          borderTop: "1px solid rgba(255, 214, 0, 0.1)",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#E6EBF4",
              mb: 3,
            }}
          >
            Ready to Transform Your Hiring Process?
          </Typography>
          <Typography
            sx={{
              color: "#B0B8D1",
              mb: 4,
              fontSize: "1.05rem",
            }}
          >
            Join hundreds of companies using Nexon AI to find and assess top talent.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/auth")}
            sx={{
              backgroundColor: "#FFD600",
              color: "#202A42",
              px: 6,
              py: 1.8,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#FFE66D",
              },
            }}
          >
            Start Your Free Trial
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#1F2937",
          py: 4,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "flex-start" },
              gap: 3,
            }}
          >
            <Typography sx={{ color: "#B0B8D1" }}>
              © 2026 Nexon AI. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Button
                color="inherit"
                sx={{ textTransform: "none", color: "#B0B8D1" }}
              >
                Privacy Policy
              </Button>
              <Button
                color="inherit"
                sx={{ textTransform: "none", color: "#B0B8D1" }}
              >
                Terms of Service
              </Button>
              <Button
                color="inherit"
                sx={{ textTransform: "none", color: "#B0B8D1" }}
              >
                Contact
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

