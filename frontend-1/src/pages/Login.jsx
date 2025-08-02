import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router"; // 1. Import useNavigate
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

import authSchema from "../validate/authSchema";
import useAuthStore from "../stores/authStore";

function Login() {
  const navigate = useNavigate(); // 2. เรียกใช้ hook
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(authSchema.login),
  });

  // 3. แก้ไขฟังก์ชัน onLogin
  const onLogin = async (data) => {
    try {
      await login(data);
      toast.success("เข้าสู่ระบบสำเร็จ");
      navigate("/"); // **สำคัญที่สุด: สั่งให้นำทางไปหน้าแรก (TodoPage)**
    } catch (error) {
      const errMsg = error.response?.data?.msg || "เข้าสู่ระบบไม่สำเร็จ";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              {...register("username")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username?.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="animate-spin" />
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Login;