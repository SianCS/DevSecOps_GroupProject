import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

import todoSchema from "../validate/TodoSchema";
import useDetailStore from "../stores/useDetailStore";

function CreateTodoDetailPage({ resetForm, todolistId }) {
  const postTodoDetailById = useDetailStore(
    (state) => state.postTodoDetailById
  );

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // ใช้ schema ของ detail
    resolver: yupResolver(todoSchema.todoListDetail),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    // Reset ฟอร์มเมื่อมีการร้องขอ
    reset();
  }, [resetForm, reset]);

  const onCreate = async (data) => {
    try {
      // **สำคัญ:** ส่ง todolistId และ data ไปให้ Store
      const res = await postTodoDetailById(todolistId, data);
      document.getElementById(`createtodoDetail-form`).close();
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    }
  };

  return (
    <div>
      <p className="text-2xl font-bold mb-4">Create New Detail</p>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onCreate)}>
        {/* --- Title --- */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Title</span>
          </div>
          <input
            {...register("title")}
            type="text"
            className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>
          )}
        </label>

        {/* --- Description --- */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Description</span>
          </div>
          <input
            {...register("description")}
            type="text"
            className="input input-bordered w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>
          )}
        </label>

        <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Create Detail"
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateTodoDetailPage;