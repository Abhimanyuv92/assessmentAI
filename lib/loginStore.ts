import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type LoginState = {
  user: User | null | string;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: User | null | string, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
};
const getInitialStorageValue =
  typeof window !== "undefined" ? localStorage.getItem("role") : null;

export const useLoginStore = create<LoginState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: getInitialStorageValue ? true : false,
  isLoading: false,

  login: (user, token) =>
   {
     if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    set({ user, token, isAuthenticated: true, isLoading: false });

   },

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
}));