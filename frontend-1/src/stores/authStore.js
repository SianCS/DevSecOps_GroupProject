import { create } from "zustand";
import { persist } from "zustand/middleware";
import authToBackend from "../api/authApi";

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: "",
      register: async (input) => {
        const res = await authToBackend.register(input);
        return res;
      },
      login: async (input) => {
        const res = await authToBackend.login(input);
        set({ accessToken: res.data.token });
        return res;
      },
      logout: async () => {
        set({ accessToken: "" });
      },
    }),
    { name: "auth-store" }
  )
);

export default useAuthStore;
