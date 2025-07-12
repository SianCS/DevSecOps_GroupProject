import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import todoSchema from "../validate/TodoSchema";
import { Loader } from "lucide-react";
import useDetailStore from "../stores/useDetailStore";
import { toast } from "react-toastify";

function EditTodoDetailPage({ el, resetForm }) {
  const editTodoDetailById = useDetailStore(
    (state) => state.editTodoDetailById
  );
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(todoSchema.editTodoListDetail),
    shouldFocusError: true,
    defaultValues: {
      td_title: el.td_title,
      td_descript: el.td_descript,
      td_completed: el.td_completed,
    },
  });
  useEffect(() => {
    reset();
  }, [resetForm]);
  const onEdit = async (data) => {
    try {
      const res = await editTodoDetailById(el.td_id, data);
      document.getElementById(`updatetodoDetail-form${el.td_id}`).close();
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    }
  };
  return (
    <div>
      <p>Edit todo detail form </p>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onEdit)}>
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
            "Edit tododetail"
          )}
        </button>
      </form>
    </div>
  );
}
export default EditTodoDetailPage;
