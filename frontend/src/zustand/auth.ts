import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  getUserId: () => number;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  userId: null,

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  clearToken: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },
  getUserId: () => {
    const token = localStorage.getItem("token") as string;
    const decodedToken: any = jwtDecode(token);
    return decodedToken.userId as number;
  },
}));
