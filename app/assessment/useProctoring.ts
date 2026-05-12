// hooks/useProctoring.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAssessmentRegistrationStore } from "@/lib/assessmentRegistrationStore";

type Options = {
  /** Called every time a violation is detected, with the updated total count */
  onViolation?: (count: number, reason: string) => void;
  /** If true, listening is paused (e.g. during the instructions page) */
  paused?: boolean;
};

/**
 * Attaches tab-visibility and window-blur listeners.
 * Increments violationCount in the store on every infraction.
 * Must be used inside a client component that is rendered only during the test.
 */
export function useProctoring({ onViolation, paused = false }: Options = {}) {
  const incrementViolation = useAssessmentRegistrationStore((s) => s.incrementViolation);
  const violationCount = useAssessmentRegistrationStore((s) => s.violationCount);
  const countRef = useRef(violationCount);

  // Keep ref in sync so the callbacks always read the latest value
  useEffect(() => { countRef.current = violationCount; }, [violationCount]);

  const handleViolation = useCallback(
    (reason: string) => {
      if (paused) return;
      incrementViolation();
      const newCount = countRef.current + 1;
      countRef.current = newCount;
      onViolation?.(newCount, reason);
    },
    [paused, incrementViolation, onViolation]
  );

  useEffect(() => {
    if (paused) return;

    // visibilitychange fires when the user switches tabs or the tab goes hidden
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleViolation("Tab switched or window minimised");
      }
    };

    // blur fires when the user clicks outside the browser window
    const onWindowBlur = () => {
      handleViolation("Window lost focus");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [paused, handleViolation]);

  return { violationCount };
}