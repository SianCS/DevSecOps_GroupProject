import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import todoSchema from "../validate/TodoSchema";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useTodoStore from "../stores/useTodoStore";
import { Loader } from "lucide-react";

function EditTodoPage({ resetForm, el }) {
  const editTodoList = useTodoStore((state) => state.editTodoList);
  const initialData = {
    to_title: el.to_title,
  };
  useEffect(() => {
    reset(initialData);
  }, [resetForm]);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(todoSchema.todoList),
    shouldFocusError: true,
    defaultValues: initialData,
  });
  const onEdit = async (data) => {
    try {
      const res = await editTodoList(el.to_id, data);
      document.getElementById(`updatetodo-form${el.to_id}`).close();
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    }
  };
  return (
    <div>
      <p>Edit form: {el.to_id} </p>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onEdit)}>
        <label className="text-lg">
          {" "}
          Title:
          <input
            name="title"
            type="text"
            className="input"
            {...register("to_title")}
          />
          {errors.to_title && (
            <p className="text-red-500 text-sm">{errors.to_title?.message}</p>
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
export default EditTodoPage;
