import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Loader, Trash, Edit, FilePlus } from "lucide-react";

import useTodoStore from "../stores/useTodoStore";
import useAuthStore from "../stores/authStore";
import todoSchema from "../validate/TodoSchema";
import EditTodoPage from "./EditTodoPage";

function TodoPage() {
  const navi = useNavigate();

  // ดึงข้อมูลและฟังก์ชันจาก Stores
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const todoList = useTodoStore((state) => state.todoList);
  const getAllTodoLists = useTodoStore((state) => state.getAllTodoLists);
  const createTodoList = useTodoStore((state) => state.createTodoList);
  const deleteTodoList = useTodoStore((state) => state.deleteTodoList);

  // State สำหรับควบคุม UI
  const [isDeleting, setIsDeleting] = useState(false);
  const [resetModalForm, setResetModalForm] = useState(false);

  // ดึงข้อมูล Todolist ทั้งหมดเมื่อเปิดหน้า
  useEffect(() => {
    getAllTodoLists();
  }, [getAllTodoLists]);

  // ตั้งค่า React Hook Form
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(todoSchema.todoList),
  });

  // ฟังก์ชันสร้าง Todolist
  const hdlCreate = async (data) => {
    try {
      const res = await createTodoList(data);
      reset(); // เคลียร์ฟอร์มหลังสร้างสำเร็จ
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    }
  };

  // ฟังก์ชันลบ Todolist
  const hdlDelete = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this list?")) {
        setIsDeleting(true);
        const res = await deleteTodoList(id);
        toast.success(res.data.msg);
      }
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // --- เพิ่มฟังก์ชันสำหรับ Logout ---
  const hdlLogout = () => {
    logout(); // สั่งให้ store เคลียร์ข้อมูล
    navi("/login"); // สั่งให้นำทางกลับไปหน้า login
  };

  // ฟังก์ชันแปลงวันที่
  const localDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("th-TH", {
      dateStyle: "long",
      timeZone: "Asia/Bangkok",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* --- ส่วน Header และปุ่ม Logout --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Todo Lists</h1>
        <div className="flex items-center gap-4">
          <span className="font-semibold">
            Welcome, {currentUser?.username} ({currentUser?.role})
          </span>
          {/* --- แก้ไข onClick ของปุ่ม Logout --- */}
          <button className="btn btn-error" onClick={hdlLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* --- ฟอร์มสร้าง Todolist (แสดงเฉพาะ TEACHER) --- */}
      {currentUser?.role === "TEACHER" && (
        <form
          className="card bg-base-200 shadow-xl p-6 mb-8 flex flex-col gap-4"
          onSubmit={handleSubmit(hdlCreate)}
        >
          <h2 className="text-2xl font-bold">Create a New List</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              {...register("title")}
              type="text"
              className={`input input-bordered ${errors.title ? "input-error" : ""}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title?.message}
              </p>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <FilePlus /> Create List
              </>
            )}
          </button>
        </form>
      )}

      {/* --- ตารางแสดงผล Todolist --- */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created By</th>
              <th>Created At</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(todoList) &&
              todoList.map((el) => (
                <tr key={el.id} className="hover">
                  <td className="font-semibold">{el.title}</td>
                  <td>{el.creator?.username}</td>
                  <td>{localDate(el.createdAt)}</td>
                  <td className="text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => navi(`/detail/${el.id}`)}
                      >
                        View Detail
                      </button>
                      {currentUser?.role === "TEACHER" && (
                        <>
                          <button
                            className="btn btn-sm btn-warning"
                            disabled={isDeleting}
                            onClick={() => {
                              setResetModalForm((p) => !p);
                              document.getElementById(`updatetodo-form${el.id}`).showModal();
                            }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            disabled={isDeleting}
                            onClick={() => hdlDelete(el.id)}
                          >
                            <Trash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(!todoList || todoList.length === 0) && (
            <p className="text-center text-gray-500 py-8">No todo lists found.</p>
        )}
      </div>

      {/* --- Modal สำหรับแก้ไข Todolist --- */}
      {Array.isArray(todoList) &&
        todoList.map((el) => (
          <dialog
            key={el.id}
            id={`updatetodo-form${el.id}`}
            className="modal"
          >
            <div className="modal-box">
              <EditTodoPage resetForm={resetModalForm} el={el} />
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
            </div>
          </dialog>
        ))}
    </div>
  );
}

export default TodoPage;