// hooks/useProctoring.ts
//
// Detects tab switches, window blur (alt-tab, minimise), and visibility changes.
// Each violation fires the onViolation callback with a reason string.
// The component consumes this to deduct score and show a warning.

import { useEffect, useRef, useState } from "react";

export type ViolationReason =
  | "tab_switch"      // document.visibilityState became "hidden"
  | "window_blur"     // window lost focus (alt-tab, browser blur)
  | "window_minimize" // page became hidden (covers minimise on all OS)
  | "devtools";       // window resize heuristic for devtools (optional)

export interface ProctoringViolation {
  reason: ViolationReason;
  timestamp: number;
  count: number;        // cumulative violations of this type
}

interface UseProctoringOptions {
  enabled?: boolean;
  onViolation?: (violation: ProctoringViolation) => void;
  deductionPerViolation?: number; // score points deducted per event
  initialScore?: number;
}

interface UseProctoringReturn {
  violations: ProctoringViolation[];
  totalViolations: number;
  score: number;
  isWarningVisible: boolean;
  dismissWarning: () => void;
  lastViolation: ProctoringViolation | null;
}

export function useProctoring({
  enabled = true,
  onViolation,
  deductionPerViolation = 5,
  initialScore = 100,
}: UseProctoringOptions = {}): UseProctoringReturn {
  const [violations, setViolations] = useState<ProctoringViolation[]>([]);
  const [score, setScore] = useState(initialScore);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [lastViolation, setLastViolation] = useState<ProctoringViolation | null>(null);

  // Track per-reason counts without re-rendering
  const countsRef = useRef<Record<ViolationReason, number>>({
    tab_switch: 0,
    window_blur: 0,
    window_minimize: 0,
    devtools: 0,
  });

  const recordViolation = (reason: ViolationReason) => {
    if (!enabled) return;
    countsRef.current[reason] += 1;
    const violation: ProctoringViolation = {
      reason,
      timestamp: Date.now(),
      count: countsRef.current[reason],
    };
    setViolations((prev) => [...prev, violation]);
    setScore((prev) => Math.max(0, prev - deductionPerViolation));
    setLastViolation(violation);
    setIsWarningVisible(true);
    onViolation?.(violation);
  };

  useEffect(() => {
    if (!enabled) return;

    // 1. Visibility change — covers tab switch + minimise on most browsers
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        recordViolation("tab_switch");
      }
    };

    // 2. Window blur — fires on alt-tab, click outside, devtools open etc.
    const handleBlur = () => {
      // Only fire if page is still visible (alt-tab keeps it visible briefly)
      if (document.visibilityState === "visible") {
        recordViolation("window_blur");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    violations,
    totalViolations: violations.length,
    score,
    isWarningVisible,
    dismissWarning: () => setIsWarningVisible(false),
    lastViolation,
  };
}