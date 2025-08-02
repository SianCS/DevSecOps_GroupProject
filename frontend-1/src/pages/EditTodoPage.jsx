import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

import todoSchema from "../validate/TodoSchema";
import useTodoStore from "../stores/useTodoStore";

function EditTodoPage({ resetForm, el }) {
  const editTodoList = useTodoStore((state) => state.editTodoList);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // **สำคัญ:** ตั้งค่า defaultValues ด้วยข้อมูลที่ถูกต้อง (el.title)
    defaultValues: {
      title: el.title,
    },
    // ใช้ yup ตรวจสอบ field ที่ชื่อ "title"
    resolver: yupResolver(todoSchema.todoList),
  });

  // ใช้ useEffect เพื่อ reset ค่าในฟอร์มเมื่อ dialog ถูกเปิด/ปิด
  useEffect(() => {
    reset({ title: el.title });
  }, [resetForm, el.title, reset]);

  // ฟังก์ชันที่ทำงานเมื่อกดยืนยันการแก้ไข
  const onEdit = async (data) => {
    try {
      // data ที่ได้รับมาตอนนี้ถูกต้องแล้ว คือ { title: '...' }
      const res = await editTodoList(el.id, data); // ส่ง el.id และข้อมูลใหม่ไป
      document.getElementById(`updatetodo-form${el.id}`).close(); // ปิด modal
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    }
  };

  return (
    <div>
      <p className="text-2xl font-bold mb-4">Edit: {el.title}</p>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onEdit)}>
        <label className="text-lg">
          New Title:
          {/* --- ส่วนที่แก้ไข --- */}
          <input
            {...register("title")} // **แก้ไข 1: เปลี่ยนเป็น "title"**
            type="text"
            className="input input-bordered w-full"
          />
          {errors.title && ( // **แก้ไข 2: เช็ค error จาก "title"**
            <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>
          )}
        </label>
        <button type="submit" className="btn btn-accent" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}

export default EditTodoPage;