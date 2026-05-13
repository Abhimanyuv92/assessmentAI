// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   Alert,
//   Box,
//   Button,
//   Chip,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   LinearProgress,
//   Paper,
//   Typography,
// } from "@mui/material";
// import {
//   Camera,
//   CheckCircle2,
//   Clock,
//   AlertTriangle,
//   Ban,
//   ChevronRight,
//   ChevronLeft,
//   Send,
//   ShieldAlert,
// } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Option { text: string; score: number; }
// interface Question { id: number; text: string; options: Option[]; }
// interface TokenPayload { name: string; email: string; tier: string; experience: string; }
// interface CategoryResult { name: string; score: number; weight: number; }
// interface ScoreResult { categories: CategoryResult[]; rawOverall: number; penalty: number; overall: number; }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const TOTAL_SECONDS = 60 * 60; // 1 hour

// const CATEGORIES: { key: string; label: string; weight: number; color: string; bg: string }[] = [
//   { key: "sjt",           label: "SJT",           weight: 0.40, color: "#0F63FF", bg: "rgba(15,99,255,0.09)"  },
//   { key: "psychometric",  label: "Psychometric",  weight: 0.25, color: "#3B6D11", bg: "rgba(59,109,17,0.09)"  },
//   { key: "behavioural",   label: "Behavioural",   weight: 0.25, color: "#854F0B", bg: "rgba(133,79,11,0.09)"  },
//   { key: "communication", label: "Communication", weight: 0.10, color: "#A32D2D", bg: "rgba(163,45,45,0.09)"  },
// ];

// // ─── Questions ────────────────────────────────────────────────────────────────

// const QUESTIONS: Record<string, Question[]> = {
//   sjt: [
//     {
//       id: 1,
//       text: "Two senior team members are in a heated disagreement during a critical project meeting, stalling progress. As the team lead, what do you do?",
//       options: [
//         { text: "Acknowledge both perspectives, pause the debate, and schedule a focused resolution session after the meeting.", score: 4 },
//         { text: "Side with the more experienced member to maintain authority and move the meeting along.", score: 1 },
//         { text: "Let them work it out — healthy debate leads to better decisions.", score: 2 },
//         { text: "Escalate immediately to your manager so the issue is documented.", score: 2 },
//       ],
//     },
//     {
//       id: 2,
//       text: "A high-performing team member repeatedly misses deadlines despite multiple one-on-ones. The upcoming delivery is critical. How do you handle this?",
//       options: [
//         { text: "Have a candid conversation exploring underlying blockers, reassign tasks temporarily, and create a structured improvement plan.", score: 4 },
//         { text: "Issue a formal written warning to trigger HR processes and create accountability.", score: 2 },
//         { text: "Reassign their tasks to others without explanation to protect the delivery.", score: 1 },
//         { text: "Give them one final chance to self-correct with no further intervention.", score: 2 },
//       ],
//     },
//     {
//       id: 3,
//       text: "Your team is about to ship a feature on a tight deadline when a junior developer discovers a potential security vulnerability. Fixing it requires 2 extra days. What do you do?",
//       options: [
//         { text: "Delay the release, immediately brief stakeholders with a risk assessment and revised timeline.", score: 4 },
//         { text: "Ship on time and schedule a hotfix for next sprint — velocity must be maintained.", score: 1 },
//         { text: "Ask the junior developer to validate further before escalating — it might be a false alarm.", score: 2 },
//         { text: "Ship a limited rollout to internal users only while the fix is prepared.", score: 3 },
//       ],
//     },
//     {
//       id: 4,
//       text: "A key stakeholder demands a major scope change one week before launch. Your team has no capacity for it. How do you respond?",
//       options: [
//         { text: "Present a detailed impact analysis of the change, propose a post-launch roadmap item, and align on what can be deprioritised if they insist.", score: 4 },
//         { text: "Accept the request and push the team to find a way — stakeholders must be satisfied.", score: 1 },
//         { text: "Refuse flatly, citing the signed-off scope document.", score: 2 },
//         { text: "Agree verbally to avoid conflict but plan to address it after launch.", score: 1 },
//       ],
//     },
//     {
//       id: 5,
//       text: "Two departments need the same senior engineer for different critical initiatives. You cannot split their time. How do you decide resource allocation?",
//       options: [
//         { text: "Facilitate a cross-functional meeting to evaluate strategic priority, document the decision, and define a clear timeline for the other initiative.", score: 4 },
//         { text: "Assign the resource to whichever initiative has the nearest deadline.", score: 2 },
//         { text: "Let the two department heads negotiate directly — it's their call.", score: 2 },
//         { text: "Hire a contractor for one initiative immediately to sidestep the conflict.", score: 3 },
//       ],
//     },
//   ],

//   psychometric: [
//     {
//       id: 1,
//       text: "When given an ambiguous problem with no clear solution, your natural tendency is to:",
//       options: [
//         { text: "Break it into smaller hypotheses, test assumptions iteratively, and synthesise findings into a structured recommendation.", score: 4 },
//         { text: "Seek expert guidance immediately before acting — accuracy trumps speed.", score: 2 },
//         { text: "Trust your instincts and move decisively, course-correcting as needed.", score: 3 },
//         { text: "Wait for more information before committing to any direction.", score: 1 },
//       ],
//     },
//     {
//       id: 2,
//       text: "You are under significant pressure with multiple competing priorities. You typically:",
//       options: [
//         { text: "Systematically triage tasks by impact and urgency, communicate revised expectations proactively, and protect focus time.", score: 4 },
//         { text: "Work longer hours to get everything done — letting things slip sets a bad precedent.", score: 2 },
//         { text: "Focus on whatever feels most urgent at the moment and adapt as things unfold.", score: 2 },
//         { text: "Delegate everything possible and check in frequently to maintain oversight.", score: 3 },
//       ],
//     },
//     {
//       id: 3,
//       text: "Your preferred approach to leadership is best described as:",
//       options: [
//         { text: "Situational — adapting your style to each individual's maturity, motivation, and the task at hand.", score: 4 },
//         { text: "Directive — setting clear expectations and holding people strictly accountable.", score: 2 },
//         { text: "Collaborative — building consensus before decisions to ensure buy-in.", score: 3 },
//         { text: "Hands-off — trusting people to own their work without interference.", score: 2 },
//       ],
//     },
//     {
//       id: 4,
//       text: "When you receive critical feedback about your work from a peer, your first reaction is to:",
//       options: [
//         { text: "Listen actively, ask clarifying questions to fully understand the concern, then reflect before responding.", score: 4 },
//         { text: "Evaluate whether the feedback source has sufficient expertise before taking it seriously.", score: 2 },
//         { text: "Acknowledge it in the moment, but rely on your own judgment to decide what to act on.", score: 3 },
//         { text: "Feel defensive initially, but work through it and incorporate what's valid.", score: 3 },
//       ],
//     },
//     {
//       id: 5,
//       text: "When making a significant decision with incomplete information, you typically:",
//       options: [
//         { text: "Define the minimum information needed for a reversible decision, make a call, and build in review checkpoints.", score: 4 },
//         { text: "Gather as much data as possible before committing — poor data leads to poor decisions.", score: 2 },
//         { text: "Consult widely and let the consensus guide the decision.", score: 2 },
//         { text: "Go with the option that feels most aligned with long-term principles, even without full data.", score: 3 },
//       ],
//     },
//   ],

//   behavioural: [
//     {
//       id: 1,
//       text: "Describe how you have led a team through significant organisational change that faced internal resistance.",
//       options: [
//         { text: "I mapped stakeholder concerns early, co-designed the change roadmap with key influencers, communicated the 'why' consistently, and tracked adoption milestones.", score: 4 },
//         { text: "I focused on quick wins to demonstrate value and used momentum to bring resistors along.", score: 3 },
//         { text: "I relied on the formal change management process and let the framework handle resistance.", score: 2 },
//         { text: "I escalated persistent resistance to leadership and let them manage it while I focused on execution.", score: 1 },
//       ],
//     },
//     {
//       id: 2,
//       text: "Tell us about a time you failed to meet an important goal. How did you handle it?",
//       options: [
//         { text: "I conducted a thorough retrospective, owned the failure transparently with stakeholders, identified systemic causes, and implemented specific preventive measures.", score: 4 },
//         { text: "I acknowledged the failure, apologised to stakeholders, and redoubled effort to recover lost ground.", score: 3 },
//         { text: "I analysed what went wrong and made sure to set more realistic targets going forward.", score: 2 },
//         { text: "External factors largely drove the failure, so I documented the context for future reference.", score: 1 },
//       ],
//     },
//     {
//       id: 3,
//       text: "Describe a situation where you influenced a major decision without having direct authority.",
//       options: [
//         { text: "I built a data-driven case, identified the right stakeholders, understood their priorities, and framed the proposal in terms of their goals — securing alignment bottom-up.", score: 4 },
//         { text: "I leveraged relationships and informal influence to get people on board before the formal decision point.", score: 3 },
//         { text: "I presented my recommendation clearly to the decision-maker and let the data speak for itself.", score: 2 },
//         { text: "I flagged the issue repeatedly until the right people took notice.", score: 1 },
//       ],
//     },
//     {
//       id: 4,
//       text: "How have you handled a situation where a key stakeholder consistently undermined your team's work?",
//       options: [
//         { text: "I sought a private conversation to understand their concerns, established mutual expectations, created shared success metrics, and escalated only when repeated attempts failed.", score: 4 },
//         { text: "I documented incidents and escalated formally to protect the team's credibility.", score: 2 },
//         { text: "I worked around them by building a coalition of other stakeholders to support the work.", score: 3 },
//         { text: "I adjusted the team's communication style to reduce the stakeholder's surface area for criticism.", score: 2 },
//       ],
//     },
//     {
//       id: 5,
//       text: "Give an example of how you drove innovation in a team that was resistant to change.",
//       options: [
//         { text: "I created a safe-to-fail environment with bounded experiments, celebrated small wins publicly, and gradually shifted the team's default from 'we've always done it this way' to 'what could we try?'.", score: 4 },
//         { text: "I introduced external benchmarks and competitive threat data to create urgency for change.", score: 3 },
//         { text: "I brought in a guest speaker or external consultant to validate the need for change.", score: 2 },
//         { text: "I assigned innovation as a dedicated OKR with clear accountability.", score: 2 },
//       ],
//     },
//   ],

//   communication: [
//     {
//       id: 1,
//       text: "You need to present a complex technical failure and its business impact to the board. How do you structure your communication?",
//       options: [
//         { text: "Lead with the business impact and timeline, present root cause concisely, follow with remediation plan and prevention measures, and close with clear asks.", score: 4 },
//         { text: "Start with a detailed technical explanation so the board understands the full picture before the impact.", score: 1 },
//         { text: "Use a consultant-style deck with an executive summary, then let the appendix carry the detail.", score: 3 },
//         { text: "Keep it short and verbal — boards don't want documentation overhead.", score: 2 },
//       ],
//     },
//     {
//       id: 2,
//       text: "A team member tells you a critical message you sent was misunderstood by the wider group. You would:",
//       options: [
//         { text: "Acknowledge the ambiguity, send a concise clarification immediately, and reflect on what made the original message unclear.", score: 4 },
//         { text: "Clarify verbally in the next meeting — written corrections can compound confusion.", score: 2 },
//         { text: "Ask the team member to explain the correct interpretation to their peers so it spreads naturally.", score: 2 },
//         { text: "Review the original message with the team member to jointly decide the best way to correct it.", score: 3 },
//       ],
//     },
//     {
//       id: 3,
//       text: "Which approach best describes effective written communication in a leadership context?",
//       options: [
//         { text: "Concise, structured, and audience-adapted — with the most important point first and supporting detail accessible but not forced on the reader.", score: 4 },
//         { text: "Comprehensive — the more context provided, the less chance of misunderstanding.", score: 1 },
//         { text: "Conversational and warm — building rapport matters more than formal structure.", score: 2 },
//         { text: "Precise and technically complete — ambiguity in leadership communication is always costly.", score: 2 },
//       ],
//     },
//     {
//       id: 4,
//       text: "During a presentation, you realise your audience is confused and disengaged. What do you do?",
//       options: [
//         { text: "Pause, acknowledge the disconnect openly, ask a targeted question to re-anchor the audience, and adjust your pace and framing based on their response.", score: 4 },
//         { text: "Slow down and repeat the key points more carefully — they may just need more time to absorb it.", score: 2 },
//         { text: "Skip to the conclusion and offer to walk through the detail offline for those who want it.", score: 3 },
//         { text: "Continue as planned — deviating from the structure mid-presentation undermines credibility.", score: 1 },
//       ],
//     },
//     {
//       id: 5,
//       text: "A peer needs to hear difficult feedback about behaviour that is damaging team morale. How do you approach the conversation?",
//       options: [
//         { text: "Arrange a private conversation, focus on specific observed behaviours and their impact (not traits), listen to their perspective, and agree on concrete next steps together.", score: 4 },
//         { text: "Mention it casually in a 1:1 to keep it low-stakes and preserve the relationship.", score: 1 },
//         { text: "Send a thoughtful written message so they have time to process without feeling put on the spot.", score: 2 },
//         { text: "Raise it in a team retrospective so it's addressed in a structured, neutral context.", score: 2 },
//       ],
//     },
//   ],
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function decodeToken(token: string): TokenPayload | null {
//   try { return JSON.parse(atob(token.replace(/-/g, "+").replace(/_/g, "/"))); }
//   catch { return null; }
// }

// function pad(n: number) { return String(n).padStart(2, "0"); }

// function formatTime(secs: number) {
//   const h = Math.floor(secs / 3600);
//   const m = Math.floor((secs % 3600) / 60);
//   const s = secs % 60;
//   return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
// }

// // Penalty: 3 points per violation, capped at 15 points total
// const PENALTY_PER_VIOLATION = 3;
// const MAX_PENALTY = 15;

// function calcPenalty(violations: number): number {
//   return Math.min(violations * PENALTY_PER_VIOLATION, MAX_PENALTY);
// }

// function calcScore(
//   answers: Record<string, Record<number, number>>,
//   violations: number
// ): { categories: CategoryResult[]; rawOverall: number; penalty: number; overall: number } {
//   const categories = CATEGORIES.map((cat) => {
//     const qs = QUESTIONS[cat.key];
//     const totalPossible = qs.length * 4;
//     const earned = qs.reduce((sum, q) => sum + (answers[cat.key]?.[q.id] ?? 0), 0);
//     return { name: cat.label, score: Math.round((earned / totalPossible) * 100), weight: cat.weight };
//   });
//   const rawOverall = Math.round(categories.reduce((sum, c) => sum + c.score * c.weight, 0));
//   const penalty = calcPenalty(violations);
//   const overall = Math.max(0, rawOverall - penalty);
//   return { categories, rawOverall, penalty, overall };
// }

// // ─── Proctoring hook ──────────────────────────────────────────────────────────

// function useProctoring(active: boolean) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const [violations, setViolations] = useState(0);
//   const [camError, setCamError] = useState(false);
//   const [lastViolation, setLastViolation] = useState<string | null>(null);

//   // Start webcam
//   useEffect(() => {
//     if (!active) return;
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: false })
//       .then((stream) => {
//         streamRef.current = stream;
//         if (videoRef.current) videoRef.current.srcObject = stream;
//       })
//       .catch(() => setCamError(true));
//     return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
//   }, [active]);

//   // Tab / window visibility
//   useEffect(() => {
//     if (!active) return;
//     const onHide = () => {
//       if (document.visibilityState === "hidden") {
//         setViolations((v) => v + 1);
//         setLastViolation("Tab switch detected");
//       }
//     };
//     document.addEventListener("visibilitychange", onHide);
//     return () => document.removeEventListener("visibilitychange", onHide);
//   }, [active]);

//   // Right-click / copy-paste prevention
//   useEffect(() => {
//     if (!active) return;
//     const block = (e: Event) => e.preventDefault();
//     document.addEventListener("contextmenu", block);
//     document.addEventListener("copy", block);
//     document.addEventListener("cut", block);
//     return () => {
//       document.removeEventListener("contextmenu", block);
//       document.removeEventListener("copy", block);
//       document.removeEventListener("cut", block);
//     };
//   }, [active]);

//   // Key combos (PrintScreen, F12, etc.)
//   useEffect(() => {
//     if (!active) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (
//         e.key === "PrintScreen" ||
//         (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
//         e.key === "F12"
//       ) {
//         e.preventDefault();
//         setViolations((v) => v + 1);
//         setLastViolation("Restricted key detected");
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [active]);

//   return { videoRef, violations, camError, lastViolation };
// }

// // ─── Timer component ──────────────────────────────────────────────────────────

// function Timer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
//   const urgent = seconds <= 300;
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         gap: 0.75,
//         px: 1.5,
//         py: 0.75,
//         borderRadius: 2,
//         border: "1px solid",
//         borderColor: urgent ? "error.main" : "divider",
//         bgcolor: urgent ? "rgba(211,47,47,0.06)" : "background.paper",
//         transition: "all 0.3s",
//       }}
//     >
//       <Clock size={14} color={urgent ? "#D32F2F" : undefined} />
//       <Typography
//         sx={{
//           fontFamily: "monospace",
//           fontSize: 15,
//           fontWeight: 700,
//           color: urgent ? "error.main" : "text.primary",
//           letterSpacing: "0.05em",
//         }}
//       >
//         {formatTime(seconds)}
//       </Typography>
//     </Box>
//   );
// }

// // ─── Category sidebar ─────────────────────────────────────────────────────────

// function CategorySidebar({
//   currentCat,
//   answers,
//   onSelect,
// }: {
//   currentCat: string;
//   answers: Record<string, Record<number, number>>;
//   onSelect: (key: string) => void;
// }) {
//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
//       {CATEGORIES.map((cat) => {
//         const qs = QUESTIONS[cat.key];
//         const answered = qs.filter((q) => answers[cat.key]?.[q.id] !== undefined).length;
//         const complete = answered === qs.length;
//         const active = currentCat === cat.key;
//         return (
//           <Box
//             key={cat.key}
//             onClick={() => onSelect(cat.key)}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1.25,
//               px: 1.5,
//               py: 1,
//               borderRadius: 2,
//               cursor: "pointer",
//               border: "1px solid",
//               borderColor: active ? cat.color : "divider",
//               bgcolor: active ? `${cat.color}0D` : "transparent",
//               transition: "all 0.15s",
//               "&:hover": { bgcolor: `${cat.color}0A`, borderColor: cat.color },
//             }}
//           >
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{cat.label}</Typography>
//               <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
//                 {answered}/{qs.length} answered
//               </Typography>
//             </Box>
//             {complete ? (
//               <CheckCircle2 size={14} color="#3B6D11" />
//             ) : (
//               <Box
//                 component="span"
//                 sx={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   px: 0.9,
//                   py: 0.3,
//                   borderRadius: 1,
//                   bgcolor: `${cat.color}14`,
//                   color: cat.color,
//                 }}
//               >
//                 {Math.round(cat.weight * 100)}%
//               </Box>
//             )}
//           </Box>
//         );
//       })}
//     </Box>
//   );
// }

// // ─── Question card ────────────────────────────────────────────────────────────

// function QuestionCard({
//   question,
//   catKey,
//   qIndex,
//   totalQ,
//   selected,
//   onSelect,
//   catColor,
// }: {
//   question: Question;
//   catKey: string;
//   qIndex: number;
//   totalQ: number;
//   selected: number | undefined;
//   onSelect: (score: number) => void;
//   catColor: string;
// }) {
//   const labels = ["A", "B", "C", "D"];
//   return (
//     <Box>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//         <Box
//           sx={{
//             px: 1.25,
//             py: 0.35,
//             borderRadius: 1,
//             fontSize: 11,
//             fontWeight: 600,
//             bgcolor: `${catColor}14`,
//             color: catColor,
//           }}
//         >
//           Q{qIndex + 1} / {totalQ}
//         </Box>
//       </Box>

//       <Typography sx={{ fontSize: 15, fontWeight: 500, lineHeight: 1.65, mb: 3, color: "text.primary" }}>
//         {question.text}
//       </Typography>

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
//         {question.options.map((opt, i) => {
//           const isSelected = selected === opt.score && selected !== undefined;
//           // We compare by index to handle duplicate scores
//           const isSelectedByIndex = i === question.options.findIndex((o) => o.score === selected) && selected !== undefined;
//           const sel = answers_hack_idx[catKey]?.[question.id] === i;

//           return (
//             <Box
//               key={i}
//               onClick={() => onSelect_with_idx(i, opt.score)}
//               sx={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: 1.5,
//                 p: "12px 14px",
//                 borderRadius: 2,
//                 border: "1px solid",
//                 borderColor: sel ? catColor : "divider",
//                 bgcolor: sel ? `${catColor}0D` : "background.default",
//                 cursor: "pointer",
//                 transition: "all 0.15s",
//                 "&:hover": { borderColor: catColor, bgcolor: `${catColor}08` },
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 22,
//                   height: 22,
//                   borderRadius: "50%",
//                   flexShrink: 0,
//                   border: "2px solid",
//                   borderColor: sel ? catColor : "divider",
//                   bgcolor: sel ? catColor : "transparent",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   mt: 0.15,
//                   transition: "all 0.15s",
//                 }}
//               >
//                 {sel && <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#fff" }} />}
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <Typography sx={{ fontSize: 12, fontWeight: 600, color: sel ? catColor : "text.secondary", mb: 0.25 }}>
//                   {labels[i]}
//                 </Typography>
//                 <Typography sx={{ fontSize: 13.5, lineHeight: 1.55, color: "text.primary" }}>{opt.text}</Typography>
//               </Box>
//             </Box>
//           );
//         })}
//       </Box>
//     </Box>
//   );
// }

// // Hack: we need index-based selection to handle options with identical scores
// // This will be resolved inside AssessmentPage via closure
// let answers_hack_idx: Record<string, Record<number, number>> = {};
// let onSelect_with_idx: (idx: number, score: number) => void = () => {};

// // ─── Results screen ───────────────────────────────────────────────────────────

// const VIOLATION_PENALTY_TABLE = [
//   { violations: 0, penalty: 0,  label: "No deduction"   },
//   { violations: 1, penalty: 3,  label: "−3 pts"          },
//   { violations: 2, penalty: 6,  label: "−6 pts"          },
//   { violations: 3, penalty: 9,  label: "−9 pts"          },
//   { violations: 4, penalty: 12, label: "−12 pts"         },
//   { violations: 5, penalty: 15, label: "−15 pts (cap)"   },
// ];

// function ResultsScreen({
//   name,
//   email,
//   categories,
//   rawOverall,
//   penalty,
//   overall,
//   violations,
//   submitting,
//   submitted,
//   error,
//   onSubmit,
// }: {
//   name: string;
//   email: string;
//   categories: CategoryResult[];
//   rawOverall: number;
//   penalty: number;
//   overall: number;
//   violations: number;
//   submitting: boolean;
//   submitted: boolean;
//   error: string | null;
//   onSubmit: () => void;
// }) {
//   const grade = overall >= 80 ? { label: "Excellent",        color: "#3B6D11", bg: "rgba(59,109,17,0.09)"  }
//     : overall >= 65           ? { label: "Good",             color: "#854F0B", bg: "rgba(133,79,11,0.09)"  }
//     : overall >= 50           ? { label: "Average",          color: "#0F63FF", bg: "rgba(15,99,255,0.09)"  }
//     :                           { label: "Needs Improvement", color: "#A32D2D", bg: "rgba(163,45,45,0.09)" };

//   return (
//     <Box sx={{ maxWidth: 600, mx: "auto", py: 5, px: 2 }}>

//       {/* Header */}
//       <Box sx={{ textAlign: "center", mb: 3.5 }}>
//         <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "primary.main", display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 1.5 }}>
//           <CheckCircle2 size={30} color="#fff" />
//         </Box>
//         <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Assessment Complete</Typography>
//         <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
//           Thank you, {name}. Here is your detailed scorecard.
//         </Typography>
//       </Box>

//       {/* ── Score hero card ── */}
//       <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", mb: 2 }}>

//         {/* Score strip */}
//         <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", bgcolor: "background.paper" }}>
//           {[
//             { label: "Raw score",       value: `${rawOverall}%`, sub: "Before deductions",   color: "text.primary"  },
//             null,
//             { label: "Penalty",         value: penalty > 0 ? `−${penalty} pts` : "None", sub: `${violations} violation${violations !== 1 ? "s" : ""}`, color: penalty > 0 ? "error.main" : "success.main" },
//             null,
//             { label: "Final score",     value: `${overall}%`,    sub: grade.label,           color: "primary.main"  },
//           ].map((item, i) =>
//             item === null ? (
//               <Box key={i} sx={{ bgcolor: "divider", width: "1px" }} />
//             ) : (
//               <Box key={i} sx={{ textAlign: "center", py: 2.5, px: 1.5 }}>
//                 <Typography sx={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled", mb: 0.75 }}>
//                   {item.label}
//                 </Typography>
//                 <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: item.color, mb: 0.4 }}>
//                   {item.value}
//                 </Typography>
//                 <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{item.sub}</Typography>
//               </Box>
//             )
//           )}
//         </Box>

//         {/* Grade bar */}
//         <Box sx={{ px: 2.5, py: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "action.hover" }}>
//           <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Overall grade</Typography>
//           <Chip
//             label={grade.label}
//             size="small"
//             sx={{ bgcolor: grade.bg, color: grade.color, fontWeight: 700, fontSize: 12 }}
//           />
//         </Box>
//       </Paper>

//       {/* ── Category scores ── */}
//       <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: "20px 22px", mb: 2 }}>
//         <Typography sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled", mb: 2 }}>
//           Category scores & weighted contribution
//         </Typography>

//         <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
//           {categories.map((c) => {
//             const cat = CATEGORIES.find((x) => x.label === c.name)!;
//             const contribution = Math.round(c.score * c.weight);
//             return (
//               <Box key={c.name}>
//                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.6 }}>
//                   {/* Left: name + weight */}
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: cat.color, flexShrink: 0 }} />
//                     <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{c.name}</Typography>
//                     <Box component="span" sx={{ fontSize: 10.5, fontWeight: 600, px: 0.9, py: 0.2, borderRadius: 1, bgcolor: cat.bg, color: cat.color }}>
//                       {Math.round(c.weight * 100)}%
//                     </Box>
//                   </Box>
//                   {/* Right: raw score + contribution */}
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                     <Typography sx={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{c.score}%</Typography>
//                     <Typography sx={{ fontSize: 11, color: "text.disabled" }}>→</Typography>
//                     <Box
//                       component="span"
//                       sx={{
//                         fontSize: 12,
//                         fontWeight: 600,
//                         px: 1,
//                         py: 0.25,
//                         borderRadius: 1,
//                         bgcolor: "action.hover",
//                         color: "text.secondary",
//                         minWidth: 42,
//                         textAlign: "center",
//                         display: "inline-block",
//                       }}
//                     >
//                       +{contribution} pts
//                     </Box>
//                   </Box>
//                 </Box>
//                 <LinearProgress
//                   variant="determinate"
//                   value={c.score}
//                   sx={{
//                     height: 6,
//                     borderRadius: 3,
//                     bgcolor: "action.hover",
//                     "& .MuiLinearProgress-bar": { bgcolor: cat.color, borderRadius: 3 },
//                   }}
//                 />
//               </Box>
//             );
//           })}
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         {/* Total row */}
//         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary" }}>Weighted total (before penalty)</Typography>
//           <Typography sx={{ fontSize: 15, fontWeight: 700, color: "primary.main" }}>{rawOverall}%</Typography>
//         </Box>
//         {penalty > 0 && (
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.75 }}>
//             <Typography sx={{ fontSize: 13, color: "error.main" }}>Proctoring penalty ({violations} violation{violations !== 1 ? "s" : ""})</Typography>
//             <Typography sx={{ fontSize: 14, fontWeight: 700, color: "error.main" }}>−{penalty} pts</Typography>
//           </Box>
//         )}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             mt: 1,
//             pt: 1.25,
//             borderTop: "1px solid",
//             borderColor: "divider",
//           }}
//         >
//           <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Final score</Typography>
//           <Typography sx={{ fontSize: 17, fontWeight: 800, color: "primary.main" }}>{overall}%</Typography>
//         </Box>
//       </Paper>

//       {/* ── Proctoring impact table ── */}
//       <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", mb: 2 }}>
//         <Box sx={{ px: 2.5, py: 1.75, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
//           <AlertTriangle size={14} color="#E65100" />
//           <Typography sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled" }}>
//             How violations affect your score
//           </Typography>
//         </Box>
//         <Box sx={{ overflow: "auto" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//             <thead>
//               <tr>
//                 {["Violations", "Deduction", "Impact"].map((h) => (
//                   <th
//                     key={h}
//                     style={{
//                       padding: "8px 16px",
//                       textAlign: "left",
//                       fontSize: 11,
//                       fontWeight: 600,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.05em",
//                       color: "#999",
//                       background: "var(--mui-palette-action-hover, #f5f5f5)",
//                       borderBottom: "1px solid var(--mui-palette-divider, #e0e0e0)",
//                     }}
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {VIOLATION_PENALTY_TABLE.map((row) => {
//                 const isYou = row.violations === Math.min(violations, 5);
//                 return (
//                   <tr
//                     key={row.violations}
//                     style={{
//                       background: isYou ? "rgba(15,99,255,0.06)" : "transparent",
//                     }}
//                   >
//                     <td style={{ padding: "9px 16px", borderBottom: "1px solid var(--mui-palette-divider, #e0e0e0)", fontWeight: isYou ? 600 : 400 }}>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <span>{row.violations === 0 ? "0 (clean)" : row.violations >= 5 ? "5+" : row.violations}</span>
//                         {isYou && (
//                           <Box component="span" sx={{ fontSize: 10, fontWeight: 700, px: 0.9, py: 0.2, borderRadius: 1, bgcolor: "primary.main", color: "#fff" }}>
//                             you
//                           </Box>
//                         )}
//                       </Box>
//                     </td>
//                     <td style={{ padding: "9px 16px", borderBottom: "1px solid var(--mui-palette-divider, #e0e0e0)", color: row.penalty === 0 ? "#2E7D32" : "#C62828", fontWeight: 600 }}>
//                       {row.label}
//                     </td>
//                     <td style={{ padding: "9px 16px", borderBottom: "1px solid var(--mui-palette-divider, #e0e0e0)", fontSize: 12, color: "#888" }}>
//                       {row.penalty === 0
//                         ? "No impact on final score"
//                         : row.violations >= 5
//                         ? "Maximum cap — worst case scenario"
//                         : `e.g. 80% raw → ${80 - row.penalty}% final`}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </Box>
//         <Box sx={{ px: 2.5, py: 1.25, bgcolor: "action.hover", borderTop: "1px solid", borderColor: "divider" }}>
//           <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
//             Each violation deducts <strong>3 points</strong> from your final score. Penalty is capped at <strong>15 points</strong> (5+ violations).
//           </Typography>
//         </Box>
//       </Paper>

//       {/* ── Submit to HR ── */}
//       {submitted ? (
//         <Alert severity="success" sx={{ borderRadius: 2, fontSize: 13 }}>
//           Results sent to HR successfully. You will be contacted within 3 business days.
//         </Alert>
//       ) : (
//         <Box>
//           {error && <Alert severity="error" sx={{ borderRadius: 2, mb: 1.5, fontSize: 13 }}>{error}</Alert>}
//           <Button
//             onClick={onSubmit}
//             disabled={submitting}
//             variant="contained"
//             size="large"
//             fullWidth
//             disableElevation
//             startIcon={submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Send size={16} />}
//             sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1.4 }}
//           >
//             {submitting ? "Sending to HR…" : "Submit results to HR"}
//           </Button>
//           <Typography sx={{ textAlign: "center", mt: 1.5, fontSize: 12, color: "text.disabled" }}>
//             Results will be sent to the HR team at your organisation.
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function AssessmentPage() {
//   const params = useSearchParams();
//   const router = useRouter();

//   const [payload, setPayload] = useState<TokenPayload | null>(null);
//   const [tokenError, setTokenError] = useState(false);

//   // answers[catKey][questionId] = optionIndex
//   const [answerIdxMap, setAnswerIdxMap] = useState<Record<string, Record<number, number>>>({});
//   // answers[catKey][questionId] = score
//   const [answerScoreMap, setAnswerScoreMap] = useState<Record<string, Record<number, number>>>({});

//   const [currentCat, setCurrentCat] = useState(CATEGORIES[0].key);
//   const [currentQIdx, setCurrentQIdx] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
//   const [screen, setScreen] = useState<"cam-check" | "testing" | "results">("cam-check");
//   const [camReady, setCamReady] = useState(false);

//   // results state
//   const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   // violation warning dialog
//   const [violationDialog, setViolationDialog] = useState(false);

//   // Camera permission state — checked BEFORE entering the test
//   const [camStatus, setCamStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
//   const previewVideoRef = useRef<HTMLVideoElement>(null);
//   const previewStreamRef = useRef<MediaStream | null>(null);

//   const requestCamera = async () => {
//     setCamStatus("requesting");
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//       previewStreamRef.current = stream;
//       if (previewVideoRef.current) previewVideoRef.current.srcObject = stream;
//       setCamStatus("granted");
//     } catch {
//       setCamStatus("denied");
//     }
//   };

//   // Stop preview stream once test begins (proctoring hook takes over)
//   const stopPreviewStream = () => {
//     previewStreamRef.current?.getTracks().forEach((t) => t.stop());
//     previewStreamRef.current = null;
//   };

//   const { videoRef, violations, camError, lastViolation } = useProctoring(screen === "testing");

//   // Wire up the global closure refs used by QuestionCard
//   answers_hack_idx = answerIdxMap;
//   onSelect_with_idx = (idx: number, score: number) => {
//     const q = QUESTIONS[currentCat][currentQIdx];
//     setAnswerIdxMap((prev) => ({ ...prev, [currentCat]: { ...(prev[currentCat] ?? {}), [q.id]: idx } }));
//     setAnswerScoreMap((prev) => ({ ...prev, [currentCat]: { ...(prev[currentCat] ?? {}), [q.id]: score } }));
//   };

//   // Decode token
//   useEffect(() => {
//     const token = params.get("token");
//     if (!token) { setTokenError(true); return; }
//     const decoded = decodeToken(token);
//     if (!decoded) { setTokenError(true); return; }
//     setPayload(decoded);
//   }, [params]);

//   // Timer
//   useEffect(() => {
//     if (screen !== "testing") return;
//     if (timeLeft <= 0) { handleAutoSubmit(); return; }
//     const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
//     return () => clearInterval(id);
//   }, [screen, timeLeft]);

//   // Violation warning
//   useEffect(() => {
//     if (violations > 0 && screen === "testing") setViolationDialog(true);
//   }, [violations]);

//   const handleAutoSubmit = useCallback(() => {
//     const result = calcScore(answerScoreMap, violations);
//     setScoreResult(result);
//     setScreen("results");
//   }, [answerScoreMap, violations]);

//   const handleStartTest = () => {
//     if (camStatus !== "granted") return; // hard gate
//     stopPreviewStream();
//     setCamReady(true);
//     setScreen("testing");
//   };

//   const handleSubmitTest = () => {
//     const result = calcScore(answerScoreMap, violations);
//     setScoreResult(result);
//     setScreen("results");
//   };

//   const handleSendToHR = async () => {
//     if (!payload || !scoreResult) return;
//     setSubmitting(true);
//     setSubmitError(null);
//     try {
//       await fetch("/api/submit-assessment-result", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: payload.name,
//           email: payload.email,
//           tier: payload.tier,
//           rawScore: scoreResult.rawOverall,
//           penalty: scoreResult.penalty,
//           overallScore: scoreResult.overall,
//           categoryScores: scoreResult.categories,
//           violations,
//           completedAt: new Date().toISOString(),
//         }),
//       });
//       setSubmitted(true);
//     } catch (e) {
//       setSubmitError("Failed to send results. Please try again or contact support.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Total answered count
//   const totalAnswered = CATEGORIES.reduce(
//     (sum, cat) => sum + (Object.keys(answerIdxMap[cat.key] ?? {}).length), 0
//   );
//   const totalQuestions = CATEGORIES.length * 5;

//   // ── Token error ──
//   if (tokenError) {
//     return (
//       <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
//         <Alert severity="error" sx={{ maxWidth: 420 }}>
//           Invalid or expired assessment link. Contact talent@yourcompany.com.
//         </Alert>
//       </Box>
//     );
//   }

//   if (!payload) {
//     return (
//       <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // ── Results screen ──
//   if (screen === "results" && scoreResult) {
//     return (
//       <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//         <ResultsScreen
//           name={payload.name}
//           email={payload.email}
//           categories={scoreResult.categories}
//           rawOverall={scoreResult.rawOverall}
//           penalty={scoreResult.penalty}
//           overall={scoreResult.overall}
//           violations={violations}
//           submitting={submitting}
//           submitted={submitted}
//           error={submitError}
//           onSubmit={handleSendToHR}
//         />
//       </Box>
//     );
//   }

//   // ── Camera permission check ──
//   if (screen === "cam-check") {
//     return (
//       <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
//         <Box sx={{ maxWidth: 480, width: "100%", textAlign: "center" }}>

//           {/* Icon */}
//           <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: camStatus === "granted" ? "success.main" : camStatus === "denied" ? "error.main" : "primary.main", display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 2, transition: "background 0.3s" }}>
//             <Camera size={26} color="#fff" />
//           </Box>

//           <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.75 }}>
//             {camStatus === "granted" ? "Camera ready" : camStatus === "denied" ? "Camera access denied" : "Camera permission required"}
//           </Typography>
//           <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 3 }}>
//             {camStatus === "granted"
//               ? "Your webcam is active. You may now start the assessment."
//               : camStatus === "denied"
//               ? "Camera access was blocked. Enable it in your browser settings and refresh the page."
//               : "This assessment is proctored. Your webcam must be active before you can begin."}
//           </Typography>

//           {/* Live preview */}
//           <Box
//             sx={{
//               width: "100%",
//               aspectRatio: "16/9",
//               borderRadius: 3,
//               overflow: "hidden",
//               border: "2px solid",
//               borderColor: camStatus === "granted" ? "success.main" : camStatus === "denied" ? "error.main" : "divider",
//               bgcolor: "action.hover",
//               mb: 2.5,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//               transition: "border-color 0.3s",
//             }}
//           >
//             <video
//               ref={previewVideoRef}
//               autoPlay
//               muted
//               playsInline
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 display: camStatus === "granted" ? "block" : "none",
//                 transform: "scaleX(-1)", // mirror effect
//               }}
//             />
//             {camStatus !== "granted" && (
//               <Box sx={{ textAlign: "center", p: 3 }}>
//                 <Camera size={32} color="#bbb" />
//                 <Typography sx={{ fontSize: 13, color: "text.disabled", mt: 1 }}>
//                   {camStatus === "denied" ? "Access blocked" : "Camera preview will appear here"}
//                 </Typography>
//               </Box>
//             )}
//             {camStatus === "granted" && (
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: 10,
//                   left: 10,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.75,
//                   bgcolor: "rgba(0,0,0,0.55)",
//                   px: 1.25,
//                   py: 0.5,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#4CAF50", animation: "pulse 1.5s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
//                 <Typography sx={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>Live</Typography>
//               </Box>
//             )}
//           </Box>

//           {/* Denied help */}
//           {camStatus === "denied" && (
//             <Alert severity="error" sx={{ borderRadius: 2, mb: 2.5, textAlign: "left", fontSize: 13 }}>
//               To enable: click the camera icon in your browser address bar → Allow → refresh this page.
//             </Alert>
//           )}

//           {/* Requirements list */}
//           <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 2.5, mb: 3, textAlign: "left" }}>
//             {[
//               { text: "Webcam must remain active throughout the test",  done: camStatus === "granted" },
//               { text: "Tab switching will be flagged as a violation",    done: false },
//               { text: "Right-click, copy, and paste are disabled",       done: false },
//               { text: "Test duration: 1 hour — auto-submits on timeout", done: false },
//               { text: "20 questions across 4 categories",                done: false },
//             ].map((r) => (
//               <Box key={r.text} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.75 }}>
//                 <CheckCircle2
//                   size={14}
//                   color={r.done ? "#2E7D32" : "#bbb"}
//                   style={{ flexShrink: 0 }}
//                 />
//                 <Typography sx={{ fontSize: 13, color: r.done ? "text.primary" : "text.secondary" }}>{r.text}</Typography>
//               </Box>
//             ))}
//           </Paper>

//           {/* Action buttons */}
//           {camStatus !== "granted" ? (
//             <Button
//               onClick={requestCamera}
//               disabled={camStatus === "requesting" || camStatus === "denied"}
//               variant="contained"
//               size="large"
//               fullWidth
//               disableElevation
//               startIcon={camStatus === "requesting" ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Camera size={16} />}
//               sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1.4 }}
//             >
//               {camStatus === "requesting" ? "Requesting access…" : camStatus === "denied" ? "Access denied — refresh to retry" : "Allow camera access"}
//             </Button>
//           ) : (
//             <Button
//               onClick={handleStartTest}
//               variant="contained"
//               size="large"
//               fullWidth
//               disableElevation
//               endIcon={<ChevronRight size={16} />}
//               sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1.4, bgcolor: "success.main", "&:hover": { bgcolor: "success.dark" } }}
//             >
//               Start Assessment
//             </Button>
//           )}

//         </Box>
//       </Box>
//     );
//   }

//   // ── Main test UI ──
//   const catMeta = CATEGORIES.find((c) => c.key === currentCat)!;
//   const questions = QUESTIONS[currentCat];
//   const currentQ = questions[currentQIdx];
//   const catAnswered = Object.keys(answerIdxMap[currentCat] ?? {}).length;

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>

//       {/* ── Top bar ── */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           px: 3,
//           py: 1.25,
//           bgcolor: "background.paper",
//           borderBottom: "1px solid",
//           borderColor: "divider",
//           flexWrap: "wrap",
//           gap: 1,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//           <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{payload.name}</Typography>
//           <Chip label={payload.tier} size="small" sx={{ fontSize: 11, height: 20 }} />
//         </Box>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//           {violations > 0 && (
//             <Chip
//               icon={<ShieldAlert size={12} />}
//               label={`${violations} violation${violations > 1 ? "s" : ""}`}
//               size="small"
//               color="error"
//               sx={{ fontSize: 11 }}
//             />
//           )}
//           <Timer seconds={timeLeft} onExpire={handleAutoSubmit} />
//           <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#3B6D11", animation: "pulse 2s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
//           <video ref={videoRef} autoPlay muted playsInline style={{ width: 52, height: 40, borderRadius: 6, objectFit: "cover", border: "1.5px solid", borderColor: "divider" }} />
//         </Box>
//       </Box>

//       {/* ── Progress bar ── */}
//       <LinearProgress
//         variant="determinate"
//         value={(totalAnswered / totalQuestions) * 100}
//         sx={{ height: 3, "& .MuiLinearProgress-bar": { bgcolor: "primary.main" } }}
//       />

//       {/* ── Body ── */}
//       <Box sx={{ flex: 1, display: "flex", maxWidth: 1100, mx: "auto", width: "100%", gap: 3, p: { xs: 2, md: 3 } }}>

//         {/* Sidebar */}
//         <Box sx={{ width: 200, flexShrink: 0, display: { xs: "none", md: "block" } }}>
//           <CategorySidebar
//             currentCat={currentCat}
//             answers={answerIdxMap}
//             onSelect={(key) => { setCurrentCat(key); setCurrentQIdx(0); }}
//           />
//           <Divider sx={{ my: 2 }} />
//           <Button
//             onClick={handleSubmitTest}
//             variant="contained"
//             size="small"
//             fullWidth
//             disableElevation
//             sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
//           >
//             Submit test
//           </Button>
//           <Typography sx={{ fontSize: 11, color: "text.disabled", mt: 1, textAlign: "center" }}>
//             {totalAnswered}/{totalQuestions} answered
//           </Typography>
//         </Box>

//         {/* Question area */}
//         <Box sx={{ flex: 1, minWidth: 0 }}>
//           {/* Category header */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.5 }}>
//             <Box
//               sx={{
//                 px: 1.5,
//                 py: 0.5,
//                 borderRadius: 1.5,
//                 bgcolor: catMeta.bg,
//                 border: `1px solid ${catMeta.color}30`,
//               }}
//             >
//               <Typography sx={{ fontSize: 12, fontWeight: 700, color: catMeta.color, letterSpacing: "0.04em" }}>
//                 {catMeta.label}
//               </Typography>
//             </Box>
//             <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
//               {catAnswered}/{questions.length} answered · {Math.round(catMeta.weight * 100)}% of total score
//             </Typography>
//           </Box>

//           {/* Question */}
//           <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: { xs: 2.5, md: 3.5 } }}>
//             <QuestionCard
//               question={currentQ}
//               catKey={currentCat}
//               qIndex={currentQIdx}
//               totalQ={questions.length}
//               selected={answerScoreMap[currentCat]?.[currentQ.id]}
//               onSelect={(score) => {}}
//               catColor={catMeta.color}
//             />
//           </Paper>

//           {/* Navigation */}
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
//             <Button
//               onClick={() => {
//                 if (currentQIdx > 0) { setCurrentQIdx((i) => i - 1); return; }
//                 const catIdx = CATEGORIES.findIndex((c) => c.key === currentCat);
//                 if (catIdx > 0) { setCurrentCat(CATEGORIES[catIdx - 1].key); setCurrentQIdx(4); }
//               }}
//               disabled={currentCat === CATEGORIES[0].key && currentQIdx === 0}
//               variant="outlined"
//               startIcon={<ChevronLeft size={15} />}
//               sx={{ textTransform: "none", borderRadius: 2 }}
//             >
//               Previous
//             </Button>

//             {/* Dot nav */}
//             <Box sx={{ display: "flex", gap: 0.75 }}>
//               {questions.map((q, i) => (
//                 <Box
//                   key={q.id}
//                   onClick={() => setCurrentQIdx(i)}
//                   sx={{
//                     width: i === currentQIdx ? 20 : 8,
//                     height: 8,
//                     borderRadius: 4,
//                     bgcolor: answerIdxMap[currentCat]?.[q.id] !== undefined
//                       ? catMeta.color
//                       : i === currentQIdx
//                       ? "text.secondary"
//                       : "divider",
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                   }}
//                 />
//               ))}
//             </Box>

//             <Button
//               onClick={() => {
//                 if (currentQIdx < questions.length - 1) { setCurrentQIdx((i) => i + 1); return; }
//                 const catIdx = CATEGORIES.findIndex((c) => c.key === currentCat);
//                 if (catIdx < CATEGORIES.length - 1) { setCurrentCat(CATEGORIES[catIdx + 1].key); setCurrentQIdx(0); }
//                 else handleSubmitTest();
//               }}
//               variant="contained"
//               disableElevation
//               endIcon={<ChevronRight size={15} />}
//               sx={{ textTransform: "none", borderRadius: 2 }}
//             >
//               {currentCat === CATEGORIES[CATEGORIES.length - 1].key && currentQIdx === questions.length - 1 ? "Finish" : "Next"}
//             </Button>
//           </Box>
//         </Box>
//       </Box>

//       {/* Violation dialog */}
//       <Dialog open={violationDialog} onClose={() => setViolationDialog(false)} PaperProps={{ sx: { borderRadius: 3, maxWidth: 380 } }}>
//         <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
//           <AlertTriangle size={18} color="#D32F2F" />
//           Proctoring Violation
//         </DialogTitle>
//         <DialogContent>
//           <Alert severity="error" sx={{ borderRadius: 2, mb: 1.5, fontSize: 13 }}>
//             {lastViolation ?? "A violation was detected."}
//           </Alert>
//           <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
//             This incident has been logged. {violations >= 3 ? "Repeated violations may result in disqualification." : "Please return to the test and avoid switching tabs or using restricted keys."}
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2.5 }}>
//           <Button onClick={() => setViolationDialog(false)} variant="contained" disableElevation sx={{ textTransform: "none", borderRadius: 2 }}>
//             Return to test
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }   
"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import {
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
  ChevronRight,
  ChevronLeft,
  Send,
  ShieldAlert,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Option { text: string; score: number; }
interface Question { id: number; text: string; options: Option[]; }
interface TokenPayload { name: string; email: string; tier: string; experience: string; }
interface CategoryResult { name: string; score: number; weight: number; }
interface ScoreResult { categories: CategoryResult[]; rawOverall: number; penalty: number; overall: number; }

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_SECONDS = 60 * 60; // 1 hour

const CATEGORIES: { key: string; label: string; weight: number; color: string; bg: string }[] = [
  { key: "sjt",           label: "SJT",           weight: 0.40, color: "#0F63FF", bg: "rgba(15,99,255,0.09)"  },
  { key: "psychometric",  label: "Psychometric",  weight: 0.25, color: "#3B6D11", bg: "rgba(59,109,17,0.09)"  },
  { key: "behavioural",   label: "Behavioural",   weight: 0.25, color: "#854F0B", bg: "rgba(133,79,11,0.09)"  },
  { key: "communication", label: "Communication", weight: 0.10, color: "#A32D2D", bg: "rgba(163,45,45,0.09)"  },
];

// ─── Questions ────────────────────────────────────────────────────────────────

const QUESTIONS: Record<string, Question[]> = {
  sjt: [
    {
      id: 1,
      text: "Two senior team members are in a heated disagreement during a critical project meeting, stalling progress. As the team lead, what do you do?",
      options: [
        { text: "Acknowledge both perspectives, pause the debate, and schedule a focused resolution session after the meeting.", score: 4 },
        { text: "Side with the more experienced member to maintain authority and move the meeting along.", score: 1 },
        { text: "Let them work it out — healthy debate leads to better decisions.", score: 2 },
        { text: "Escalate immediately to your manager so the issue is documented.", score: 2 },
      ],
    },
    {
      id: 2,
      text: "A high-performing team member repeatedly misses deadlines despite multiple one-on-ones. The upcoming delivery is critical. How do you handle this?",
      options: [
        { text: "Have a candid conversation exploring underlying blockers, reassign tasks temporarily, and create a structured improvement plan.", score: 4 },
        { text: "Issue a formal written warning to trigger HR processes and create accountability.", score: 2 },
        { text: "Reassign their tasks to others without explanation to protect the delivery.", score: 1 },
        { text: "Give them one final chance to self-correct with no further intervention.", score: 2 },
      ],
    },
    {
      id: 3,
      text: "Your team is about to ship a feature on a tight deadline when a junior developer discovers a potential security vulnerability. Fixing it requires 2 extra days. What do you do?",
      options: [
        { text: "Delay the release, immediately brief stakeholders with a risk assessment and revised timeline.", score: 4 },
        { text: "Ship on time and schedule a hotfix for next sprint — velocity must be maintained.", score: 1 },
        { text: "Ask the junior developer to validate further before escalating — it might be a false alarm.", score: 2 },
        { text: "Ship a limited rollout to internal users only while the fix is prepared.", score: 3 },
      ],
    },
    {
      id: 4,
      text: "A key stakeholder demands a major scope change one week before launch. Your team has no capacity for it. How do you respond?",
      options: [
        { text: "Present a detailed impact analysis of the change, propose a post-launch roadmap item, and align on what can be deprioritised if they insist.", score: 4 },
        { text: "Accept the request and push the team to find a way — stakeholders must be satisfied.", score: 1 },
        { text: "Refuse flatly, citing the signed-off scope document.", score: 2 },
        { text: "Agree verbally to avoid conflict but plan to address it after launch.", score: 1 },
      ],
    },
    {
      id: 5,
      text: "Two departments need the same senior engineer for different critical initiatives. You cannot split their time. How do you decide resource allocation?",
      options: [
        { text: "Facilitate a cross-functional meeting to evaluate strategic priority, document the decision, and define a clear timeline for the other initiative.", score: 4 },
        { text: "Assign the resource to whichever initiative has the nearest deadline.", score: 2 },
        { text: "Let the two department heads negotiate directly — it's their call.", score: 2 },
        { text: "Hire a contractor for one initiative immediately to sidestep the conflict.", score: 3 },
      ],
    },
  ],

  psychometric: [
    {
      id: 1,
      text: "When given an ambiguous problem with no clear solution, your natural tendency is to:",
      options: [
        { text: "Break it into smaller hypotheses, test assumptions iteratively, and synthesise findings into a structured recommendation.", score: 4 },
        { text: "Seek expert guidance immediately before acting — accuracy trumps speed.", score: 2 },
        { text: "Trust your instincts and move decisively, course-correcting as needed.", score: 3 },
        { text: "Wait for more information before committing to any direction.", score: 1 },
      ],
    },
    {
      id: 2,
      text: "You are under significant pressure with multiple competing priorities. You typically:",
      options: [
        { text: "Systematically triage tasks by impact and urgency, communicate revised expectations proactively, and protect focus time.", score: 4 },
        { text: "Work longer hours to get everything done — letting things slip sets a bad precedent.", score: 2 },
        { text: "Focus on whatever feels most urgent at the moment and adapt as things unfold.", score: 2 },
        { text: "Delegate everything possible and check in frequently to maintain oversight.", score: 3 },
      ],
    },
    {
      id: 3,
      text: "Your preferred approach to leadership is best described as:",
      options: [
        { text: "Situational — adapting your style to each individual's maturity, motivation, and the task at hand.", score: 4 },
        { text: "Directive — setting clear expectations and holding people strictly accountable.", score: 2 },
        { text: "Collaborative — building consensus before decisions to ensure buy-in.", score: 3 },
        { text: "Hands-off — trusting people to own their work without interference.", score: 2 },
      ],
    },
    {
      id: 4,
      text: "When you receive critical feedback about your work from a peer, your first reaction is to:",
      options: [
        { text: "Listen actively, ask clarifying questions to fully understand the concern, then reflect before responding.", score: 4 },
        { text: "Evaluate whether the feedback source has sufficient expertise before taking it seriously.", score: 2 },
        { text: "Acknowledge it in the moment, but rely on your own judgment to decide what to act on.", score: 3 },
        { text: "Feel defensive initially, but work through it and incorporate what's valid.", score: 3 },
      ],
    },
    {
      id: 5,
      text: "When making a significant decision with incomplete information, you typically:",
      options: [
        { text: "Define the minimum information needed for a reversible decision, make a call, and build in review checkpoints.", score: 4 },
        { text: "Gather as much data as possible before committing — poor data leads to poor decisions.", score: 2 },
        { text: "Consult widely and let the consensus guide the decision.", score: 2 },
        { text: "Go with the option that feels most aligned with long-term principles, even without full data.", score: 3 },
      ],
    },
  ],

  behavioural: [
    {
      id: 1,
      text: "Describe how you have led a team through significant organisational change that faced internal resistance.",
      options: [
        { text: "I mapped stakeholder concerns early, co-designed the change roadmap with key influencers, communicated the 'why' consistently, and tracked adoption milestones.", score: 4 },
        { text: "I focused on quick wins to demonstrate value and used momentum to bring resistors along.", score: 3 },
        { text: "I relied on the formal change management process and let the framework handle resistance.", score: 2 },
        { text: "I escalated persistent resistance to leadership and let them manage it while I focused on execution.", score: 1 },
      ],
    },
    {
      id: 2,
      text: "Tell us about a time you failed to meet an important goal. How did you handle it?",
      options: [
        { text: "I conducted a thorough retrospective, owned the failure transparently with stakeholders, identified systemic causes, and implemented specific preventive measures.", score: 4 },
        { text: "I acknowledged the failure, apologised to stakeholders, and redoubled effort to recover lost ground.", score: 3 },
        { text: "I analysed what went wrong and made sure to set more realistic targets going forward.", score: 2 },
        { text: "External factors largely drove the failure, so I documented the context for future reference.", score: 1 },
      ],
    },
    {
      id: 3,
      text: "Describe a situation where you influenced a major decision without having direct authority.",
      options: [
        { text: "I built a data-driven case, identified the right stakeholders, understood their priorities, and framed the proposal in terms of their goals — securing alignment bottom-up.", score: 4 },
        { text: "I leveraged relationships and informal influence to get people on board before the formal decision point.", score: 3 },
        { text: "I presented my recommendation clearly to the decision-maker and let the data speak for itself.", score: 2 },
        { text: "I flagged the issue repeatedly until the right people took notice.", score: 1 },
      ],
    },
    {
      id: 4,
      text: "How have you handled a situation where a key stakeholder consistently undermined your team's work?",
      options: [
        { text: "I sought a private conversation to understand their concerns, established mutual expectations, created shared success metrics, and escalated only when repeated attempts failed.", score: 4 },
        { text: "I documented incidents and escalated formally to protect the team's credibility.", score: 2 },
        { text: "I worked around them by building a coalition of other stakeholders to support the work.", score: 3 },
        { text: "I adjusted the team's communication style to reduce the stakeholder's surface area for criticism.", score: 2 },
      ],
    },
    {
      id: 5,
      text: "Give an example of how you drove innovation in a team that was resistant to change.",
      options: [
        { text: "I created a safe-to-fail environment with bounded experiments, celebrated small wins publicly, and gradually shifted the team's default from 'we've always done it this way' to 'what could we try?'.", score: 4 },
        { text: "I introduced external benchmarks and competitive threat data to create urgency for change.", score: 3 },
        { text: "I brought in a guest speaker or external consultant to validate the need for change.", score: 2 },
        { text: "I assigned innovation as a dedicated OKR with clear accountability.", score: 2 },
      ],
    },
  ],

  communication: [
    {
      id: 1,
      text: "You need to present a complex technical failure and its business impact to the board. How do you structure your communication?",
      options: [
        { text: "Lead with the business impact and timeline, present root cause concisely, follow with remediation plan and prevention measures, and close with clear asks.", score: 4 },
        { text: "Start with a detailed technical explanation so the board understands the full picture before the impact.", score: 1 },
        { text: "Use a consultant-style deck with an executive summary, then let the appendix carry the detail.", score: 3 },
        { text: "Keep it short and verbal — boards don't want documentation overhead.", score: 2 },
      ],
    },
    {
      id: 2,
      text: "A team member tells you a critical message you sent was misunderstood by the wider group. You would:",
      options: [
        { text: "Acknowledge the ambiguity, send a concise clarification immediately, and reflect on what made the original message unclear.", score: 4 },
        { text: "Clarify verbally in the next meeting — written corrections can compound confusion.", score: 2 },
        { text: "Ask the team member to explain the correct interpretation to their peers so it spreads naturally.", score: 2 },
        { text: "Review the original message with the team member to jointly decide the best way to correct it.", score: 3 },
      ],
    },
    {
      id: 3,
      text: "Which approach best describes effective written communication in a leadership context?",
      options: [
        { text: "Concise, structured, and audience-adapted — with the most important point first and supporting detail accessible but not forced on the reader.", score: 4 },
        { text: "Comprehensive — the more context provided, the less chance of misunderstanding.", score: 1 },
        { text: "Conversational and warm — building rapport matters more than formal structure.", score: 2 },
        { text: "Precise and technically complete — ambiguity in leadership communication is always costly.", score: 2 },
      ],
    },
    {
      id: 4,
      text: "During a presentation, you realise your audience is confused and disengaged. What do you do?",
      options: [
        { text: "Pause, acknowledge the disconnect openly, ask a targeted question to re-anchor the audience, and adjust your pace and framing based on their response.", score: 4 },
        { text: "Slow down and repeat the key points more carefully — they may just need more time to absorb it.", score: 2 },
        { text: "Skip to the conclusion and offer to walk through the detail offline for those who want it.", score: 3 },
        { text: "Continue as planned — deviating from the structure mid-presentation undermines credibility.", score: 1 },
      ],
    },
    {
      id: 5,
      text: "A peer needs to hear difficult feedback about behaviour that is damaging team morale. How do you approach the conversation?",
      options: [
        { text: "Arrange a private conversation, focus on specific observed behaviours and their impact (not traits), listen to their perspective, and agree on concrete next steps together.", score: 4 },
        { text: "Mention it casually in a 1:1 to keep it low-stakes and preserve the relationship.", score: 1 },
        { text: "Send a thoughtful written message so they have time to process without feeling put on the spot.", score: 2 },
        { text: "Raise it in a team retrospective so it's addressed in a structured, neutral context.", score: 2 },
      ],
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeToken(token: string): TokenPayload | null {
  try { return JSON.parse(atob(token.replace(/-/g, "+").replace(/_/g, "/"))); }
  catch { return null; }
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

// Penalty: 3 points per violation, capped at 15 points total
const PENALTY_PER_VIOLATION = 3;
const MAX_PENALTY = 15;

function calcPenalty(violations: number): number {
  return Math.min(violations * PENALTY_PER_VIOLATION, MAX_PENALTY);
}

function calcScore(
  answers: Record<string, Record<number, number>>,
  violations: number
): { categories: CategoryResult[]; rawOverall: number; penalty: number; overall: number } {
  const categories = CATEGORIES.map((cat) => {
    const qs = QUESTIONS[cat.key];
    const totalPossible = qs.length * 4;
    const earned = qs.reduce((sum, q) => sum + (answers[cat.key]?.[q.id] ?? 0), 0);
    return { name: cat.label, score: Math.round((earned / totalPossible) * 100), weight: cat.weight };
  });
  const rawOverall = Math.round(categories.reduce((sum, c) => sum + c.score * c.weight, 0));
  const penalty = calcPenalty(violations);
  const overall = Math.max(0, rawOverall - penalty);
  return { categories, rawOverall, penalty, overall };
}

// ─── Proctoring hook ──────────────────────────────────────────────────────────

function useProctoring(active: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [violations, setViolations] = useState(0);
  const [camError, setCamError] = useState(false);
  const [lastViolation, setLastViolation] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Enter fullscreen
  const enterFullscreen = async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) await (el as any).webkitRequestFullscreen();
      else if ((el as any).mozRequestFullScreen) await (el as any).mozRequestFullScreen();
      setIsFullscreen(true);
    } catch { /* user may have blocked it */ }
  };

  // Detect fullscreen exit and flag as violation
  useEffect(() => {
    if (!active) return;
    const onFsChange = () => {
      const inFs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement
      );
      setIsFullscreen(inFs);
      if (!inFs) {
        setViolations((v) => v + 1);
        setLastViolation("Exited fullscreen mode");
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    document.addEventListener("mozfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      document.removeEventListener("mozfullscreenchange", onFsChange);
    };
  }, [active]);

  // Start webcam
  useEffect(() => {
    if (!active) return;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCamError(true));
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, [active]);

  // Tab / window visibility
  useEffect(() => {
    if (!active) return;
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        setViolations((v) => v + 1);
        setLastViolation("Tab switch detected");
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [active]);

  // Right-click / copy-paste prevention
  useEffect(() => {
    if (!active) return;
    const block = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
    };
  }, [active]);

  // Key combos (PrintScreen, F12, Escape is handled by browser for fullscreen)
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        setViolations((v) => v + 1);
        setLastViolation("Restricted key detected");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return { videoRef, violations, camError, lastViolation, isFullscreen, enterFullscreen };
}

// ─── Timer component ──────────────────────────────────────────────────────────

function Timer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const urgent = seconds <= 300;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.5,
        py: 0.75,
        borderRadius: 2,
        border: "1px solid",
        borderColor: urgent ? "error.main" : "divider",
        bgcolor: urgent ? "rgba(211,47,47,0.06)" : "background.paper",
        transition: "all 0.3s",
      }}
    >
      <Clock size={14} color={urgent ? "#D32F2F" : undefined} />
      <Typography
        sx={{
          fontFamily: "monospace",
          fontSize: 15,
          fontWeight: 700,
          color: urgent ? "error.main" : "text.primary",
          letterSpacing: "0.05em",
        }}
      >
        {formatTime(seconds)}
      </Typography>
    </Box>
  );
}

// ─── Category sidebar ─────────────────────────────────────────────────────────

function CategorySidebar({
  currentCat,
  answers,
  onSelect,
}: {
  currentCat: string;
  answers: Record<string, Record<number, number>>;
  onSelect: (key: string) => void;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      {CATEGORIES.map((cat) => {
        const qs = QUESTIONS[cat.key];
        const answered = qs.filter((q) => answers[cat.key]?.[q.id] !== undefined).length;
        const complete = answered === qs.length;
        const active = currentCat === cat.key;
        return (
          <Box
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              cursor: "pointer",
              border: "1px solid",
              borderColor: active ? cat.color : "divider",
              bgcolor: active ? `${cat.color}0D` : "transparent",
              transition: "all 0.15s",
              "&:hover": { bgcolor: `${cat.color}0A`, borderColor: cat.color },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{cat.label}</Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                {answered}/{qs.length} answered
              </Typography>
            </Box>
            {complete ? (
              <CheckCircle2 size={14} color="#3B6D11" />
            ) : (
              <Box
                component="span"
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  px: 0.9,
                  py: 0.3,
                  borderRadius: 1,
                  bgcolor: `${cat.color}14`,
                  color: cat.color,
                }}
              >
                {Math.round(cat.weight * 100)}%
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// ─── Question card ────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  catKey,
  qIndex,
  totalQ,
  selected,
  onSelect,
  catColor,
}: {
  question: Question;
  catKey: string;
  qIndex: number;
  totalQ: number;
  selected: number | undefined;
  onSelect: (score: number) => void;
  catColor: string;
}) {
  const labels = ["A", "B", "C", "D"];
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box
          sx={{
            px: 1.25,
            py: 0.35,
            borderRadius: 1,
            fontSize: 11,
            fontWeight: 600,
            bgcolor: `${catColor}14`,
            color: catColor,
          }}
        >
          Q{qIndex + 1} / {totalQ}
        </Box>
      </Box>

      <Typography sx={{ fontSize: 15, fontWeight: 500, lineHeight: 1.65, mb: 3, color: "text.primary" }}>
        {question.text}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
        {question.options.map((opt, i) => {
          const isSelected = selected === opt.score && selected !== undefined;
          // We compare by index to handle duplicate scores
          const isSelectedByIndex = i === question.options.findIndex((o) => o.score === selected) && selected !== undefined;
          const sel = answers_hack_idx[catKey]?.[question.id] === i;

          return (
            <Box
              key={i}
              onClick={() => onSelect_with_idx(i, opt.score)}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: "12px 14px",
                borderRadius: 2,
                border: "1px solid",
                borderColor: sel ? catColor : "divider",
                bgcolor: sel ? `${catColor}0D` : "background.default",
                cursor: "pointer",
                transition: "all 0.15s",
                "&:hover": { borderColor: catColor, bgcolor: `${catColor}08` },
              }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  flexShrink: 0,
                  border: "2px solid",
                  borderColor: sel ? catColor : "divider",
                  bgcolor: sel ? catColor : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 0.15,
                  transition: "all 0.15s",
                }}
              >
                {sel && <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#fff" }} />}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: sel ? catColor : "text.secondary", mb: 0.25 }}>
                  {labels[i]}
                </Typography>
                <Typography sx={{ fontSize: 13.5, lineHeight: 1.55, color: "text.primary" }}>{opt.text}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// Hack: we need index-based selection to handle options with identical scores
// This will be resolved inside AssessmentPage via closure
let answers_hack_idx: Record<string, Record<number, number>> = {};
let onSelect_with_idx: (idx: number, score: number) => void = () => {};

// ─── Results screen ───────────────────────────────────────────────────────────

const VIOLATION_PENALTY_TABLE = [
  { violations: 0, penalty: 0,  label: "No deduction"   },
  { violations: 1, penalty: 3,  label: "−3 pts"          },
  { violations: 2, penalty: 6,  label: "−6 pts"          },
  { violations: 3, penalty: 9,  label: "−9 pts"          },
  { violations: 4, penalty: 12, label: "−12 pts"         },
  { violations: 5, penalty: 15, label: "−15 pts (cap)"   },
];

function ResultsScreen({
  name,
  email,
  categories,
  rawOverall,
  penalty,
  overall,
  violations,
  submitting,
  submitted,
  error,
  onSubmit,
}: {
  name: string;
  email: string;
  categories: CategoryResult[];
  rawOverall: number;
  penalty: number;
  overall: number;
  violations: number;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
  const grade = overall >= 80 ? { label: "Excellent",        color: "#3B6D11", bg: "rgba(59,109,17,0.09)"  }
    : overall >= 65           ? { label: "Good",             color: "#854F0B", bg: "rgba(133,79,11,0.09)"  }
    : overall >= 50           ? { label: "Average",          color: "#0F63FF", bg: "rgba(15,99,255,0.09)"  }
    :                           { label: "Needs Improvement", color: "#A32D2D", bg: "rgba(163,45,45,0.09)" };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 5, px: 2 }}>

      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 3.5 }}>
        <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "primary.main", display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 1.5 }}>
          <CheckCircle2 size={30} color="#fff" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Assessment Complete</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          Thank you, {name}. Here is your detailed scorecard.
        </Typography>
      </Box>

      {/* ── Score hero card ── */}
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", mb: 2 }}>

        {/* Score strip */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", bgcolor: "background.paper" }}>
          {[
            { label: "Raw score",       value: `${rawOverall}%`, sub: "Before deductions",   color: "text.primary"  },
            null,
            { label: "Penalty",         value: penalty > 0 ? `−${penalty} pts` : "None", sub: `${violations} violation${violations !== 1 ? "s" : ""}`, color: penalty > 0 ? "error.main" : "success.main" },
            null,
            { label: "Final score",     value: `${overall}%`,    sub: grade.label,           color: "primary.main"  },
          ].map((item, i) =>
            item === null ? (
              <Box key={i} sx={{ bgcolor: "divider", width: "1px" }} />
            ) : (
              <Box key={i} sx={{ textAlign: "center", py: 2.5, px: 1.5 }}>
                <Typography sx={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled", mb: 0.75 }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: item.color, mb: 0.4 }}>
                  {item.value}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{item.sub}</Typography>
              </Box>
            )
          )}
        </Box>

        {/* Grade bar */}
        <Box sx={{ px: 2.5, py: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "action.hover" }}>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Overall grade</Typography>
          <Chip
            label={grade.label}
            size="small"
            sx={{ bgcolor: grade.bg, color: grade.color, fontWeight: 700, fontSize: 12 }}
          />
        </Box>
      </Paper>

      {/* ── Category scores ── */}
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: "20px 22px", mb: 2 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled", mb: 2 }}>
          Category scores & weighted contribution
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
          {categories.map((c) => {
            const cat = CATEGORIES.find((x) => x.label === c.name)!;
            const contribution = Math.round(c.score * c.weight);
            return (
              <Box key={c.name}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.6 }}>
                  {/* Left: name + weight */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: cat.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{c.name}</Typography>
                    <Box component="span" sx={{ fontSize: 10.5, fontWeight: 600, px: 0.9, py: 0.2, borderRadius: 1, bgcolor: cat.bg, color: cat.color }}>
                      {Math.round(c.weight * 100)}%
                    </Box>
                  </Box>
                  {/* Right: raw score + contribution */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{c.score}%</Typography>
                    <Typography sx={{ fontSize: 11, color: "text.disabled" }}>→</Typography>
                    <Box
                      component="span"
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: "action.hover",
                        color: "text.secondary",
                        minWidth: 42,
                        textAlign: "center",
                        display: "inline-block",
                      }}
                    >
                      +{contribution} pts
                    </Box>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={c.score}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "action.hover",
                    "& .MuiLinearProgress-bar": { bgcolor: cat.color, borderRadius: 3 },
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Total row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary" }}>Weighted total (before penalty)</Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "primary.main" }}>{rawOverall}%</Typography>
        </Box>
        {penalty > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.75 }}>
            <Typography sx={{ fontSize: 13, color: "error.main" }}>Proctoring penalty ({violations} violation{violations !== 1 ? "s" : ""})</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "error.main" }}>−{penalty} pts</Typography>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1,
            pt: 1.25,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Final score</Typography>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: "primary.main" }}>{overall}%</Typography>
        </Box>
      </Paper>

      {/* ── Proctoring impact table ── */}
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", mb: 2 }}>
        <Box sx={{ px: 2.5, py: 1.75, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={14} color="#E65100" />
          <Typography sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled" }}>
            How violations affect your score
          </Typography>
        </Box>
        <Box sx={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Violations", "Deduction", "Impact"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#999",
                      background: "var(--mui-palette-action-hover, #f5f5f5)",
                      borderBottom: "1px solid var(--mui-palette-divider, #e0e0e0)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VIOLATION_PENALTY_TABLE.map((row) => {
                const isYou = row.violations === Math.min(violations, 5);
                return (
                  <tr
                    key={row.violations}
                    style={{
                      background: isYou ? "rgba(15,99,255,0.06)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "9px 16px", borderBottom: "1px solid var(--mui-palette-divider, #e0e0e0)", fontWeight: isYou ? 600 : 400 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span>{row.violations === 0 ? "0 (clean)" : row.violations >= 5 ? "5+" : row.violations}</span>
                        {isYou && (
                          <Box component="span" sx={{ fontSize: 10, fontWeight: 700, px: 0.9, py: 0.2, borderRadius: 1, bgcolor: "primary.main", color: "#fff" }}>
                            you
                          </Box>
                        )}
                      </Box>
                    </td>
                    <td style={{ padding: "9px 16px", borderBottom: "1px solid var(--mui-palette-divider, #e0e0e0)", color: row.penalty === 0 ? "#2E7D32" : "#C62828", fontWeight: 600 }}>
                      {row.label}
                    </td>
                    <td style={{ padding: "9px 16px", borderBottom: "1px solid var(--mui-palette-divider, #e0e0e0)", fontSize: 12, color: "#888" }}>
                      {row.penalty === 0
                        ? "No impact on final score"
                        : row.violations >= 5
                        ? "Maximum cap — worst case scenario"
                        : `e.g. 80% raw → ${80 - row.penalty}% final`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
        <Box sx={{ px: 2.5, py: 1.25, bgcolor: "action.hover", borderTop: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
            Each violation deducts <strong>3 points</strong> from your final score. Penalty is capped at <strong>15 points</strong> (5+ violations).
          </Typography>
        </Box>
      </Paper>

      {/* ── Submit to HR ── */}
      {submitted ? (
        <Alert severity="success" sx={{ borderRadius: 2, fontSize: 13 }}>
          Results sent to HR successfully. You will be contacted within 3 business days.
        </Alert>
      ) : (
        <Box>
          {error && <Alert severity="error" sx={{ borderRadius: 2, mb: 1.5, fontSize: 13 }}>{error}</Alert>}
          <Button
            onClick={onSubmit}
            disabled={submitting}
            variant="contained"
            size="large"
            fullWidth
            disableElevation
            startIcon={submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Send size={16} />}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1.4 }}
          >
            {submitting ? "Sending…" : "Submit results "}
          </Button>
          <Typography sx={{ textAlign: "center", mt: 1.5, fontSize: 12, color: "text.disabled" }}>
            Results will be sent to the HR team at your organisation.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function AssessmentPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [tokenError, setTokenError] = useState(false);

  // answers[catKey][questionId] = optionIndex
  const [answerIdxMap, setAnswerIdxMap] = useState<Record<string, Record<number, number>>>({});
  // answers[catKey][questionId] = score
  const [answerScoreMap, setAnswerScoreMap] = useState<Record<string, Record<number, number>>>({});

  const [currentCat, setCurrentCat] = useState(CATEGORIES[0].key);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [screen, setScreen] = useState<"cam-check" | "testing" | "results">("cam-check");
  const [camReady, setCamReady] = useState(false);

  // results state
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // violation warning dialog
  const [violationDialog, setViolationDialog] = useState(false);

  // Camera permission state — checked BEFORE entering the test
  const [camStatus, setCamStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);

  const requestCamera = async () => {
    setCamStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      previewStreamRef.current = stream;
      if (previewVideoRef.current) previewVideoRef.current.srcObject = stream;
      setCamStatus("granted");
    } catch {
      setCamStatus("denied");
    }
  };

  // Stop preview stream once test begins (proctoring hook takes over)
  const stopPreviewStream = () => {
    previewStreamRef.current?.getTracks().forEach((t) => t.stop());
    previewStreamRef.current = null;
  };

  const { videoRef, violations, camError, lastViolation, isFullscreen, enterFullscreen } = useProctoring(screen === "testing");

  // Wire up the global closure refs used by QuestionCard
  answers_hack_idx = answerIdxMap;
  onSelect_with_idx = (idx: number, score: number) => {
    const q = QUESTIONS[currentCat][currentQIdx];
    setAnswerIdxMap((prev) => ({ ...prev, [currentCat]: { ...(prev[currentCat] ?? {}), [q.id]: idx } }));
    setAnswerScoreMap((prev) => ({ ...prev, [currentCat]: { ...(prev[currentCat] ?? {}), [q.id]: score } }));
  };

  // Decode token
  useEffect(() => {
    const token = params.get("token");
    if (!token) { setTokenError(true); return; }
    const decoded = decodeToken(token);
    if (!decoded) { setTokenError(true); return; }
    setPayload(decoded);
  }, [params]);

  // Timer
  useEffect(() => {
    if (screen !== "testing") return;
    if (timeLeft <= 0) { handleAutoSubmit(); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [screen, timeLeft]);

  // Violation warning
  useEffect(() => {
    if (violations > 0 && screen === "testing") setViolationDialog(true);
  }, [violations]);

  const handleAutoSubmit = useCallback(() => {
    const result = calcScore(answerScoreMap, violations);
    setScoreResult(result);
    setScreen("results");
  }, [answerScoreMap, violations]);

  const handleStartTest = async () => {
    if (camStatus !== "granted") return; // hard gate
    stopPreviewStream();
    // Request fullscreen before switching screen
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) await (el as any).webkitRequestFullscreen();
      else if ((el as any).mozRequestFullScreen) await (el as any).mozRequestFullScreen();
    } catch { /* proceed even if fullscreen is rejected */ }
    setCamReady(true);
    setScreen("testing");
  };

  const handleSubmitTest = () => {
    const result = calcScore(answerScoreMap, violations);
    setScoreResult(result);
    setScreen("results");
  };

  const handleSendToHR = async () => {
    if (!payload || !scoreResult) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await fetch("/api/submit-assessment-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          tier: payload.tier,
          rawScore: scoreResult.rawOverall,
          penalty: scoreResult.penalty,
          overallScore: scoreResult.overall,
          categoryScores: scoreResult.categories,
          violations,
          completedAt: new Date().toISOString(),
        }),
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitError("Failed to send results. Please try again or contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  // Total answered count
  const totalAnswered = CATEGORIES.reduce(
    (sum, cat) => sum + (Object.keys(answerIdxMap[cat.key] ?? {}).length), 0
  );
  const totalQuestions = CATEGORIES.length * 5;

  // ── Token error ──
  if (tokenError) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: 420 }}>
          Invalid or expired assessment link. Contact talent@yourcompany.com.
        </Alert>
      </Box>
    );
  }

  if (!payload) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // ── Results screen ──
  if (screen === "results" && scoreResult) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <ResultsScreen
          name={payload.name}
          email={payload.email}
          categories={scoreResult.categories}
          rawOverall={scoreResult.rawOverall}
          penalty={scoreResult.penalty}
          overall={scoreResult.overall}
          violations={violations}
          submitting={submitting}
          submitted={submitted}
          error={submitError}
          onSubmit={handleSendToHR}
        />
      </Box>
    );
  }

  // ── Camera permission check ──
  if (screen === "cam-check") {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Box sx={{ maxWidth: 480, width: "100%", textAlign: "center" }}>

          {/* Icon */}
          <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: camStatus === "granted" ? "success.main" : camStatus === "denied" ? "error.main" : "primary.main", display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 2, transition: "background 0.3s" }}>
            <Camera size={26} color="#fff" />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.75 }}>
            {camStatus === "granted" ? "Camera ready" : camStatus === "denied" ? "Camera access denied" : "Camera permission required"}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 3 }}>
            {camStatus === "granted"
              ? "Your webcam is active. You may now start the assessment."
              : camStatus === "denied"
              ? "Camera access was blocked. Enable it in your browser settings and refresh the page."
              : "This assessment is proctored. Your webcam must be active before you can begin."}
          </Typography>

          {/* Live preview */}
          <Box
            sx={{
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 3,
              overflow: "hidden",
              border: "2px solid",
              borderColor: camStatus === "granted" ? "success.main" : camStatus === "denied" ? "error.main" : "divider",
              bgcolor: "action.hover",
              mb: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transition: "border-color 0.3s",
            }}
          >
            <video
              ref={previewVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: camStatus === "granted" ? "block" : "none",
                transform: "scaleX(-1)", // mirror effect
              }}
            />
            {camStatus !== "granted" && (
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Camera size={32} color="#bbb" />
                <Typography sx={{ fontSize: 13, color: "text.disabled", mt: 1 }}>
                  {camStatus === "denied" ? "Access blocked" : "Camera preview will appear here"}
                </Typography>
              </Box>
            )}
            {camStatus === "granted" && (
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  bgcolor: "rgba(0,0,0,0.55)",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 2,
                }}
              >
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#4CAF50", animation: "pulse 1.5s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
                <Typography sx={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>Live</Typography>
              </Box>
            )}
          </Box>

          {/* Denied help */}
          {camStatus === "denied" && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 2.5, textAlign: "left", fontSize: 13 }}>
              To enable: click the camera icon in your browser address bar → Allow → refresh this page.
            </Alert>
          )}

          {/* Requirements list */}
          <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 2.5, mb: 3, textAlign: "left" }}>
            {[
              { text: "Webcam must remain active throughout the test",  done: camStatus === "granted" },
              { text: "Test runs in fullscreen — exiting flags a violation", done: false },
              { text: "Tab switching will be flagged as a violation",    done: false },
              { text: "Right-click, copy, and paste are disabled",       done: false },
              { text: "Test duration: 1 hour — auto-submits on timeout", done: false },
              { text: "20 questions across 4 categories",                done: false },
            ].map((r) => (
              <Box key={r.text} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.75 }}>
                <CheckCircle2
                  size={14}
                  color={r.done ? "#2E7D32" : "#bbb"}
                  style={{ flexShrink: 0 }}
                />
                <Typography sx={{ fontSize: 13, color: r.done ? "text.primary" : "text.secondary" }}>{r.text}</Typography>
              </Box>
            ))}
          </Paper>

          {/* Action buttons */}
          {camStatus !== "granted" ? (
            <Button
              onClick={requestCamera}
              disabled={camStatus === "requesting" || camStatus === "denied"}
              variant="contained"
              size="large"
              fullWidth
              disableElevation
              startIcon={camStatus === "requesting" ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Camera size={16} />}
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1.4 }}
            >
              {camStatus === "requesting" ? "Requesting access…" : camStatus === "denied" ? "Access denied — refresh to retry" : "Allow camera access"}
            </Button>
          ) : (
            <Button
              onClick={handleStartTest}
              variant="contained"
              size="large"
              fullWidth
              disableElevation
              endIcon={<ChevronRight size={16} />}
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, fontSize: 15, py: 1.4, bgcolor: "success.main", "&:hover": { bgcolor: "success.dark" } }}
            >
              Start Assessment
            </Button>
          )}

        </Box>
      </Box>
    );
  }

  // ── Main test UI ──
  const catMeta = CATEGORIES.find((c) => c.key === currentCat)!;
  const questions = QUESTIONS[currentCat];
  const currentQ = questions[currentQIdx];
  const catAnswered = Object.keys(answerIdxMap[currentCat] ?? {}).length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>

      {/* ── Top bar ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 1.25,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{payload.name}</Typography>
          <Chip label={payload.tier} size="small" sx={{ fontSize: 11, height: 20 }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {violations > 0 && (
            <Chip
              icon={<ShieldAlert size={12} />}
              label={`${violations} violation${violations > 1 ? "s" : ""}`}
              size="small"
              color="error"
              sx={{ fontSize: 11 }}
            />
          )}

      {/* ── Fullscreen exit warning banner ── */}
      {!isFullscreen && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 1.5,
            py: 0.6,
            borderRadius: 2,
            bgcolor: "error.main",
            cursor: "pointer",
            "&:hover": { opacity: 0.9 },
          }}
          onClick={enterFullscreen}
        >
          <AlertTriangle size={13} color="#fff" />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
            Fullscreen exited — click to re-enter
          </Typography>
        </Box>
      )}
          <Timer seconds={timeLeft} onExpire={handleAutoSubmit} />
          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#3B6D11", animation: "pulse 2s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
          <video ref={videoRef} autoPlay muted playsInline style={{ width: 52, height: 40, borderRadius: 6, objectFit: "cover", border: "1.5px solid", borderColor: "divider" }} />
        </Box>
      </Box>

      {/* ── Progress bar ── */}
      <LinearProgress
        variant="determinate"
        value={(totalAnswered / totalQuestions) * 100}
        sx={{ height: 3, "& .MuiLinearProgress-bar": { bgcolor: "primary.main" } }}
      />

      {/* ── Body ── */}
      <Box sx={{ flex: 1, display: "flex", maxWidth: 1100, mx: "auto", width: "100%", gap: 3, p: { xs: 2, md: 3 } }}>

        {/* Sidebar */}
        <Box sx={{ width: 200, flexShrink: 0, display: { xs: "none", md: "block" } }}>
          <CategorySidebar
            currentCat={currentCat}
            answers={answerIdxMap}
            onSelect={(key) => { setCurrentCat(key); setCurrentQIdx(0); }}
          />
          <Divider sx={{ my: 2 }} />
          <Button
            onClick={handleSubmitTest}
            variant="contained"
            size="small"
            fullWidth
            disableElevation
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Submit test
          </Button>
          <Typography sx={{ fontSize: 11, color: "text.disabled", mt: 1, textAlign: "center" }}>
            {totalAnswered}/{totalQuestions} answered
          </Typography>
        </Box>

        {/* Question area */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Category header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.5 }}>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                bgcolor: catMeta.bg,
                border: `1px solid ${catMeta.color}30`,
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: catMeta.color, letterSpacing: "0.04em" }}>
                {catMeta.label}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {catAnswered}/{questions.length} answered · {Math.round(catMeta.weight * 100)}% of total score
            </Typography>
          </Box>

          {/* Question */}
          <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: { xs: 2.5, md: 3.5 } }}>
            <QuestionCard
              question={currentQ}
              catKey={currentCat}
              qIndex={currentQIdx}
              totalQ={questions.length}
              selected={answerScoreMap[currentCat]?.[currentQ.id]}
              onSelect={(score) => {}}
              catColor={catMeta.color}
            />
          </Paper>

          {/* Navigation */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
            <Button
              onClick={() => {
                if (currentQIdx > 0) { setCurrentQIdx((i) => i - 1); return; }
                const catIdx = CATEGORIES.findIndex((c) => c.key === currentCat);
                if (catIdx > 0) { setCurrentCat(CATEGORIES[catIdx - 1].key); setCurrentQIdx(4); }
              }}
              disabled={currentCat === CATEGORIES[0].key && currentQIdx === 0}
              variant="outlined"
              startIcon={<ChevronLeft size={15} />}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Previous
            </Button>

            {/* Dot nav */}
            <Box sx={{ display: "flex", gap: 0.75 }}>
              {questions.map((q, i) => (
                <Box
                  key={q.id}
                  onClick={() => setCurrentQIdx(i)}
                  sx={{
                    width: i === currentQIdx ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: answerIdxMap[currentCat]?.[q.id] !== undefined
                      ? catMeta.color
                      : i === currentQIdx
                      ? "text.secondary"
                      : "divider",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </Box>

            <Button
              onClick={() => {
                if (currentQIdx < questions.length - 1) { setCurrentQIdx((i) => i + 1); return; }
                const catIdx = CATEGORIES.findIndex((c) => c.key === currentCat);
                if (catIdx < CATEGORIES.length - 1) { setCurrentCat(CATEGORIES[catIdx + 1].key); setCurrentQIdx(0); }
                else handleSubmitTest();
              }}
              variant="contained"
              disableElevation
              endIcon={<ChevronRight size={15} />}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              {currentCat === CATEGORIES[CATEGORIES.length - 1].key && currentQIdx === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Violation dialog */}
      <Dialog open={violationDialog} onClose={() => setViolationDialog(false)}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
          <AlertTriangle size={18} color="#D32F2F" />
          Proctoring Violation
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ borderRadius: 2, mb: 1.5, fontSize: 13 }}>
            {lastViolation ?? "A violation was detected."}
          </Alert>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            This incident has been logged. {violations >= 3 ? "Repeated violations may result in disqualification." : "Please return to the test and avoid switching tabs or using restricted keys."}
          </Typography>
          {lastViolation === "Exited fullscreen mode" && (
            <Alert severity="warning" sx={{ borderRadius: 2, mt: 1.5, fontSize: 13 }}>
              The test must be taken in fullscreen. Click "Re-enter fullscreen" to continue.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          {lastViolation === "Exited fullscreen mode" && (
            <Button
              onClick={() => { enterFullscreen(); setViolationDialog(false); }}
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Re-enter fullscreen
            </Button>
          )}
          <Button onClick={() => setViolationDialog(false)} variant="contained" disableElevation sx={{ textTransform: "none", borderRadius: 2 }}>
            Return to test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function Page() {
  return (
    <Suspense>
      <AssessmentPage />
    </Suspense>
  );
}