// lib/assessmentRegistrationStore.ts
import { create } from "zustand";

export type RegistrationData = {
  name: string;
  phone: string;
  experience: string;
  govtProofFile: File | null;
  govtProofName: string; // stored filename (File not serialisable across pages)
};

type AssessmentRegistrationState = {
  token: string | null;
  registration: RegistrationData | null;
  violationCount: number;        // tab-switch / minimise count
  registrationComplete: boolean;

  setToken: (token: string) => void;
  setRegistration: (data: RegistrationData) => void;
  incrementViolation: () => void;
  resetViolations: () => void;
  reset: () => void;
};

export const useAssessmentRegistrationStore = create<AssessmentRegistrationState>((set) => ({
  token: null,
  registration: null,
  violationCount: 0,
  registrationComplete: false,

  setToken: (token) => set({ token }),

  setRegistration: (data) => set({ registration: data, registrationComplete: true }),

  incrementViolation: () =>
    set((state) => ({ violationCount: state.violationCount + 1 })),

  resetViolations: () => set({ violationCount: 0 }),

  reset: () =>
    set({ token: null, registration: null, violationCount: 0, registrationComplete: false }),
}));