import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router";
import useAuthStore from "../stores/authStore";

// Import Layouts and Pages
import PublicLayout from "../layout/PublicLayout";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import TodoPage from "../pages/TodoPage";
import TodoDetailPage from "../pages/TodoDetailPage";
import Homepage from "../pages/Homepage";

// --- 1. สร้าง Component ด่านตรวจสำหรับผู้ใช้ที่ล็อกอินแล้ว ---
function ProtectedRoute() {
  const { accessToken } = useAuthStore.getState();
  // ถ้ามี token ให้แสดงหน้าที่ต้องการ (ผ่าน <Outlet />)
  // ถ้าไม่มี token ให้บังคับกลับไปหน้า login
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}

// --- 2. สร้าง Component ด่านตรวจสำหรับผู้ใช้ที่ยังไม่ล็อกอิน ---
function GuestRoute() {
  const { accessToken } = useAuthStore.getState();
  // ถ้ามี token (ล็อกอินอยู่แล้ว) ให้บังคับไปหน้าแรก (/)
  // ถ้าไม่มี ให้แสดงหน้า login/register ตามปกติ
  return accessToken ? <Navigate to="/" replace /> : <Outlet />;
}

// --- 3. สร้าง Router แค่ชุดเดียวที่รวมทุกเส้นทาง ---
const router = createBrowserRouter([
  // กลุ่มเส้นทางที่ต้องล็อกอิน
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <TodoPage />,
      },
      {
        path: "detail/:id",
        element: <TodoDetailPage />,
      },
    ],
  },
  // กลุ่มเส้นทางสำหรับผู้ใช้ทั่วไป (ยังไม่ล็อกอิน)
  {
    element: <GuestRoute />,
    children: [
        {
            path: "/login",
            element: <LoginPage />
        },
        {
            path: "/register",
            element: <RegisterPage />
        }
    ]
  },
  // (Optional) หน้า Homepage ที่เข้าได้ทุกคน อาจจะแยกไว้อีกชุด
  {
      path: "/home", // สมมติว่าหน้าแรกจริงๆ คือ /home
      element: <Homepage />
  }
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;