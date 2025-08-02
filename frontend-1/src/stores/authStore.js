import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import authApi from "../api/authApi"; // หรือ authToBackend ตามที่คุณตั้งชื่อ

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      login: async (credential) => {
        try {
          console.log("--- 1. Login function started ---");

          const res = await authApi.login(credential);
          const token = res.data.token;
          
          console.log("--- 2. Got token successfully ---", token);

          // **สำคัญ:** ถอดรหัส Token เพื่อเอาข้อมูล user
          const decodedUser = jwtDecode(token);
          
          console.log("--- 3. Decoded user data ---", decodedUser);

          // **สำคัญ:** set ทั้ง accessToken และ user
          set({ accessToken: token, user: decodedUser });
          
          console.log("--- 4. State has been set! ---");

          return res;
        } catch (err) {
          console.error("Login failed:", err);
          throw err;
        }
      },

      logout: () => {
        // เคลียร์ทั้ง accessToken และ user
        set({ accessToken: null, user: null });
      },
    }),
    {
      name: "auth-storage", // ชื่อที่ใช้เก็บใน localStorage
    }
  )
);

export default useAuthStore;