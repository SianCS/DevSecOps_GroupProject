import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

import todoSchema from "../validate/TodoSchema";
import useDetailStore from "../stores/useDetailStore"; // สมมติว่าคุณมี Store สำหรับ Detail

function EditTodoDetailPage({ el, resetForm }) {
  const editTodoDetailById = useDetailStore((state) => state.editTodoDetailById);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // **สำคัญ:** ตั้งค่า defaultValues ด้วยข้อมูลที่ถูกต้อง
    defaultValues: {
      title: el.title,
      description: el.description,
      completed: el.completed,
    },
    // ใช้ yup ตรวจสอบ field ที่ถูกต้อง
    resolver: yupResolver(todoSchema.todoListDetail), // ใช้ schema ของ detail
  });

  useEffect(() => {
    // Reset ฟอร์มเมื่อมีการร้องขอ
    reset({
      title: el.title,
      description: el.description,
      completed: el.completed,
    });
  }, [resetForm, el, reset]);

  const onEdit = async (data) => {
    try {
      // data ที่ได้รับมาตอนนี้ถูกต้องแล้ว
      const res = await editTodoDetailById(el.id, data); // ส่ง el.id และข้อมูลใหม่ไป
      document.getElementById(`updatetodoDetail-form${el.id}`).close();
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    }
  };

  return (
    <div>
      <p className="text-2xl font-bold mb-4">Edit Detail: {el.title}</p>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onEdit)}>
        {/* --- Title --- */}
        <label className="text-lg">
          Title:
          <input
            {...register("title")} // **แก้ไข 1**
            type="text"
            className="input input-bordered w-full"
          />
          {errors.title && ( // **แก้ไข 2**
            <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>
          )}
        </label>

        {/* --- Description --- */}
        <label className="text-lg">
          Description:
          <input
            {...register("description")} // **แก้ไข 3**
            type="text"
            className="input input-bordered w-full"
          />
          {errors.description && ( // **แก้ไข 4**
            <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>
          )}
        </label>

        {/* --- Status --- */}
        <label className="text-lg">
          Status:
          <select className="select select-bordered w-full" {...register("completed")}> {/* **แก้ไข 5** */}
            <option value={false}>On process</option>
            <option value={true}>Done</option>
          </select>
          {errors.completed && ( // **แก้ไข 6**
            <p className="text-red-500 text-sm mt-1">{errors.completed?.message}</p>
          )}
        </label>

        <button type="submit" className="btn btn-accent mt-4" disabled={isSubmitting}>
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

export default EditTodoDetailPage;