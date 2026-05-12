// app/api/submit-assessment-result/route.ts
//
// POST /api/submit-assessment-result
//
// Receives the candidate's final assessment result, stores it (or forwards
// to your DB), and sends a formatted email to the HR team.
//
// Expected body:
// {
//   name: string
//   email: string
//   tier: string
//   overallScore: number
//   categoryScores: { name: string; score: number; weight: number }[]
//   violations: number
//   completedAt: string  // ISO date
// }

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryScore {
  name: string;
  score: number;
  weight: number;
}

interface AssessmentResult {
  name: string;
  email: string;
  tier: string;
  overallScore: number;
  categoryScores: CategoryScore[];
  violations: number;
  completedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGrade(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Excellent",         color: "#2E7D32" };
  if (score >= 65) return { label: "Good",              color: "#E65100" };
  if (score >= 50) return { label: "Average",           color: "#1565C0" };
  return              { label: "Needs Improvement",  color: "#C62828" };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

// ─── Email HTML ───────────────────────────────────────────────────────────────

function buildHrEmailHtml(result: AssessmentResult): string {
  const grade = getGrade(result.overallScore);

  const categoryRows = result.categoryScores
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;">${c.name}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;text-align:center;">${Math.round(c.weight * 100)}%</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:600;text-align:center;color:${c.score >= 75 ? "#2E7D32" : c.score >= 55 ? "#E65100" : "#C62828"};">${c.score}%</td>
      </tr>`
    )
    .join("");

  const violationBadge =
    result.violations > 0
      ? `<tr><td colspan="2" style="padding:0 0 16px;">
           <div style="background:#FFF3E0;border:1px solid #FFB74D;border-radius:6px;padding:10px 14px;font-size:13px;color:#E65100;">
             ⚠️ <strong>${result.violations} proctoring violation${result.violations > 1 ? "s" : ""}</strong> detected during this session.
           </div>
         </td></tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:580px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8e8e8;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0F63FF 0%,#1a3fa8 100%);padding:28px 32px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.6);">Assessment Result</p>
      <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;">${result.name}</h1>
      <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">${result.email}</p>
      <div style="margin-top:12px;display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);color:#fff;font-size:12px;font-weight:600;padding:3px 12px;border-radius:20px;">
        ${result.tier} Role
      </div>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">

      <!-- Overall score -->
      <table width="100%" style="margin-bottom:24px;border-collapse:collapse;">
        <tr>
          <td style="background:#F8F9FB;border-radius:10px;padding:20px 24px;text-align:center;border:1px solid #ececec;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#999;">Overall Score</p>
            <p style="margin:0;font-size:48px;font-weight:800;color:#0F63FF;line-height:1;">${result.overallScore}<span style="font-size:22px;font-weight:500;color:#999;">%</span></p>
            <div style="display:inline-block;margin-top:8px;background:${grade.color}18;color:${grade.color};font-size:12px;font-weight:700;padding:3px 12px;border-radius:20px;">
              ${grade.label}
            </div>
          </td>
        </tr>
      </table>

      ${violationBadge ? `<table width="100%">${violationBadge}</table>` : ""}

      <!-- Category breakdown -->
      <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#999;margin:0 0 10px;">Category Breakdown</p>
      <table width="100%" style="border-collapse:collapse;border:1px solid #ececec;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <thead>
          <tr style="background:#F8F9FB;">
            <th style="padding:10px 14px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#999;text-align:left;border-bottom:1px solid #ececec;">Category</th>
            <th style="padding:10px 14px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#999;text-align:center;border-bottom:1px solid #ececec;">Weight</th>
            <th style="padding:10px 14px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#999;text-align:center;border-bottom:1px solid #ececec;">Score</th>
          </tr>
        </thead>
        <tbody>${categoryRows}</tbody>
      </table>

      <!-- Meta info -->
      <table width="100%" style="border-collapse:collapse;margin-bottom:8px;">
        <tr>
          <td style="padding:6px 0;font-size:12px;color:#999;">Completed at</td>
          <td style="padding:6px 0;font-size:12px;color:#333;text-align:right;font-weight:500;">${formatDate(result.completedAt)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:12px;color:#999;">Candidate email</td>
          <td style="padding:6px 0;font-size:12px;color:#0F63FF;text-align:right;">${result.email}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:12px;color:#999;">Proctoring violations</td>
          <td style="padding:6px 0;font-size:12px;font-weight:600;text-align:right;color:${result.violations > 0 ? "#E65100" : "#2E7D32"};">${result.violations}</td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;background:#F8F9FB;border-top:1px solid #ececec;text-align:center;">
      <p style="margin:0;font-size:11px;color:#bbb;">This result was automatically generated by the Nexon AI Assessment Platform.</p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: AssessmentResult;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Basic validation
  const { name, email, tier, overallScore, categoryScores, violations, completedAt } = body;
  if (!name || !email || !tier || overallScore === undefined || !categoryScores || !completedAt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // ── Optional: persist to DB here ──────────────────────────────────────────
  // e.g. await db.assessmentResults.create({ data: body });
  // ─────────────────────────────────────────────────────────────────────────

  // ── Send email to HR ──────────────────────────────────────────────────────
  const HR_EMAIL = process.env.HR_EMAIL ?? "hr@yourcompany.com";
  const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.yourprovider.com";
  const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
  const SMTP_USER = process.env.SMTP_USER ?? "";
  const SMTP_PASS = process.env.SMTP_PASS ?? "";
  const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@yourcompany.com";

  // Skip email in dev if SMTP not configured
  const smtpConfigured = Boolean(SMTP_USER && SMTP_PASS);

  if (smtpConfigured) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const grade = getGrade(overallScore);

    await transporter.sendMail({
      from: `"Nexon AI Assessment" <${FROM_EMAIL}>`,
      to: HR_EMAIL,
      subject: `[Assessment Result] ${name} — ${overallScore}% (${grade.label}) · ${tier}`,
      html: buildHrEmailHtml(body),
    });
  } else {
    // Dev fallback: log to console
    console.log("[submit-assessment-result] SMTP not configured. Result payload:", {
      name, email, tier, overallScore, categoryScores, violations, completedAt,
    });
  }

  return NextResponse.json({ success: true });
}