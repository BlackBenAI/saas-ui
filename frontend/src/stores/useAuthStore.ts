import { create } from "zustand";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  organizationId: string;
}

type Plan = "free" | "team" | "pro";

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  localMode: boolean;
  plan: Plan;
  lastSyncAt: string | null;
  setSession: (user: AuthUser | null, plan?: Plan) => void;
  markSynced: (at: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  localMode: true,
  plan: "free",
  lastSyncAt: null,
  setSession: (user, plan = "free") =>
    set({
      user,
      isAuthenticated: user !== null,
      localMode: user === null,
      plan,
    }),
  markSynced: (at) => set({ lastSyncAt: at }),
  signOut: () =>
    set({
      user: null,
      isAuthenticated: false,
      localMode: true,
      plan: "free",
      lastSyncAt: null,
    }),
}));
