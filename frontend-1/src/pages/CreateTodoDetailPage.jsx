import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import todoSchema from "../validate/TodoSchema";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useDetailStore from "../stores/useDetailStore";
import { Loader } from "lucide-react";

function CreateTodoDetailPage({ resetForm, id }) {
  const postTodoDetailById = useDetailStore(
    (state) => state.postTodoDetailById
  );
  useEffect(() => {
    reset();
  }, [resetForm]);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(todoSchema.todoListDetail),
    shouldFocusError: true,
    defaultValues: { to_id: id, td_completed: "" },
  });
  const onCreate = async (data) => {
    try {
      const res = await postTodoDetailById(data);
      document.getElementById("createtodoDetail-form").close();
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    }
  };
  return (
    <div>
      <p>Create todo detail form </p>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onCreate)}>
        <label className="text-lg">
          {" "}
          Title:
          <input
            name="title"
            type="text"
            className="input"
            {...register("td_title")}
          />
          {errors.td_title && (
            <p className="text-red-500 text-sm">{errors.td_title?.message}</p>
          )}
        </label>
        <label className="text-lg">
          {" "}
          Descript:
          <input
            name="descript"
            type="text"
            className="input"
            {...register("td_descript")}
          />
          {errors.td_descript && (
            <p className="text-red-500 text-sm">
              {errors.td_descript?.message}
            </p>
          )}
        </label>
        <label className="text-lg">
          {" "}
          To_id:
          <input
            name="to_id"
            type="text"
            className="input"
            {...register("to_id")}
          />
          {errors.to_id && (
            <p className="text-red-500 text-sm">{errors.to_id?.message}</p>
          )}
        </label>
        <label className="text-lg">
          {" "}
          Status:
          <select {...register("td_completed")}>
            <option value="" disabled>
              select...
            </option>
            <option value={false}>On process</option>
            <option value={true}>Done</option>
          </select>
          {errors.td_completed && (
            <p className="text-red-500 text-sm">
              {errors.td_completed?.message}
            </p>
          )}
        </label>
        <button className="btn btn-accent" disabled={isSubmitting}>
          {isSubmitting ? (
            <p className="animate-spin">
              <Loader />
            </p>
          ) : (
            "Edit todolist"
          )}
        </button>
      </form>
    </div>
  );
}
export default CreateTodoDetailPage;
