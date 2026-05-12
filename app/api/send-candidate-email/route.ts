// app/api/send-candidate-email/route.ts
//
// .env.local required keys:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
//   EMAIL_FROM="Talent Team <sender@company.com>"
//   ADMIN_EMAIL=admin@company.com          (optional BCC)
//   NEXT_PUBLIC_APP_URL=https://yourapp.com (used to build the registration link)

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Email template ────────────────────────────────────────────────────────────
function buildEmailHtml(
  name: string,
  tier: string,
  experience: string,
  registrationLink: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to the Assessment</title>
</head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0F63FF 0%,#0040CC 100%);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:0.1em;
                         text-transform:uppercase;color:rgba(255,255,255,0.7);">
                Talent Assessment Platform
              </p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.3px;">
                Welcome to the Assessment 🎯
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">
                Congratulations — your application has been received and you have been
                shortlisted to complete our online assessment. This is your next step
                toward joining our team!
              </p>

              <!-- CTA box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#F0F6FF;border:1.5px solid #C7DCFF;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0F63FF;">
                      📋 Begin Your Registration &amp; Test
                    </p>
                    <p style="margin:0 0 20px;font-size:13.5px;color:#555;line-height:1.6;">
                      Please click the button below to complete your registration and
                      begin your assessment. The link is unique to you — do not share it.
                    </p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:8px;background:#0F63FF;">
                          <a href="${registrationLink}"
                            style="display:inline-block;padding:13px 32px;font-size:14px;
                                   font-weight:700;color:#ffffff;text-decoration:none;
                                   letter-spacing:0.02em;">
                            Proceed to Registration →
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:14px 0 0;font-size:11.5px;color:#999;">
                      Or copy this link into your browser:<br/>
                      <a href="${registrationLink}" style="color:#0F63FF;word-break:break-all;">
                        ${registrationLink}
                      </a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Profile summary -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#FAFBFC;border:1px solid #ECEEF1;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:18px 22px;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.07em;
                               text-transform:uppercase;color:#888;">Your Profile</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:5px 0;font-size:13px;color:#888;width:140px;">Name</td>
                        <td style="padding:5px 0;font-size:13px;color:#333;font-weight:600;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;font-size:13px;color:#888;">Experience Tier</td>
                        <td style="padding:5px 0;font-size:13px;color:#333;font-weight:600;">${tier}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;font-size:13px;color:#888;">Experience Range</td>
                        <td style="padding:5px 0;font-size:13px;color:#333;font-weight:600;">${experience}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Important notice -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#FFF8E1;border-left:4px solid #F59E0B;border-radius:0 8px 8px 0;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#92400E;line-height:1.6;">
                      <strong>⚠️ Important:</strong> The assessment must be completed in one
                      sitting. Switching tabs, minimising the window, or using AI tools will
                      result in score deductions. Ensure you are in a quiet environment
                      before you begin.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13.5px;color:#888;line-height:1.6;">
                Questions? Contact us at
                <a href="mailto:talent@yourcompany.com" style="color:#0F63FF;text-decoration:none;">
                  talent@yourcompany.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#FAFBFC;border-top:1px solid #EEF0F3;padding:18px 40px;text-align:center;">
              <p style="margin:0;font-size:11.5px;color:#bbb;">
                © ${new Date().getFullYear()} Your Company · Automated message — please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ─── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, tier, experience } = body as {
      name: string;
      email: string;
      tier: string;
      experience: string;
    };

    if (!name || !email || !tier || !experience) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Build a unique registration link using the candidate's email as token
    // In production replace this with a signed JWT or UUID stored in your DB
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const token = Buffer.from(JSON.stringify({ email, name, tier, experience })).toString(
      "base64url"
    );
    const registrationLink = `${appUrl}/assessment/register?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
      to: email,
      bcc: process.env.ADMIN_EMAIL,
      subject: `Welcome to the Assessment — complete your registration, ${name}!`,
      html: buildEmailHtml(name, tier, experience, registrationLink),
      text: `Hi ${name},\n\nYou have been shortlisted for our assessment.\n\nRegister and begin your test here:\n${registrationLink}\n\nNote: Do not switch tabs or use AI tools during the test — this will deduct your score.\n\nBest,\nThe Talent Team`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-candidate-email]", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}