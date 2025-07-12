import { useEffect, useState } from "react";
import useTodoStore from "../stores/useTodoStore";
import { toast } from "react-toastify";
import { Loader, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import todoSchema from "../validate/TodoSchema";
import EditTodoPage from "./EditTodoPage";
import useAuthStore from "../stores/authStore";
import { useNavigate } from "react-router";

function TodoPage() {
  const navi = useNavigate();
  const todoList = useTodoStore((state) => state.todoList);
  const getAllTodoLists = useTodoStore((state) => state.getAllTodoLists);
  const createTodoList = useTodoStore((state) => state.createTodoList);
  const deleteTodoList = useTodoStore((state) => state.deleteTodoList);
  const logout = useAuthStore((state) => state.logout);
  const [isDelete, setIsDelete] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  useEffect(() => {
    getAllTodoLists();
  }, []);
  const hdlClose = () => {
    setResetForm((prv) => !prv);
  };
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(todoSchema.todoList),
  });
  const hdlCreate = async (data) => {
    try {
      const res = await createTodoList(data);
      reset();
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    }
  };
  const hdlDelete = async (id) => {
    try {
      setIsDelete(true);
      const res = await deleteTodoList(id);
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    } finally {
      setIsDelete(false);
    }
  };
  const localDate = (date) => {
    return new Date(date).toLocaleString("en-EN", {
      dateStyle: "long",
      timeZone: "Asia/Bangkok",
    });
  };
  return (
    <div className="flex flex-col items-center h-screen mt-50 gap-5 relative">
      <button
        className="btn btn-error btn-lg fixed right-5 top-5"
        onClick={() => logout()}
      >
        Logout
      </button>
      <h1 className="text-4xl font-bold">My todo list</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(hdlCreate)}>
        <label className="text-lg">
          {" "}
          Title:
          <input
            name="title"
            {...register("to_title")}
            type="text"
            className="input"
          />
          {errors.to_title && (
            <p className="text-red-500 text-sm">{errors.to_title?.message}</p>
          )}
        </label>
        <button
          type="submit"
          className="btn btn-accent"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <p className="animate-spin">
              <Loader />
            </p>
          ) : (
            "Create todolist"
          )}
        </button>
      </form>
      <div className="w-full">
        <table className="table table-auto w-full">
          <thead>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Title</th>
              <th className="text-center">CreatedAt</th>
              <th className="text-center">Todo detail</th>
              <th className="text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {todoList.map((el) => (
              <tr key={el.to_id}>
                <td className="text-center">{el.to_id}</td>
                <td className="text-center">{el.to_title}</td>
                <td className="text-center">{localDate(el.createAt)}</td>
                <td className="text-center">
                  <button
                    className="btn"
                    onClick={() => navi(`/detail/${el.to_id}`)}
                    disabled={isDelete}
                  >
                    View detail
                  </button>
                </td>
                <td className="text-center w-120">
                  <div className="flex gap-5 w-full justify-center">
                    <button
                      className="btn btn-accent"
                      disabled={isDelete}
                      onClick={() =>
                        document
                          .getElementById(`updatetodo-form${el.to_id}`)
                          .showModal()
                      }
                    >
                      Edit todo
                    </button>
                    <button
                      className="btn btn-neutral"
                      disabled={isDelete}
                      onClick={() => hdlDelete(el.to_id)}
                    >
                      <Trash /> Delete todo
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {todoList.map((el, idx) => (
        <dialog
          key={idx}
          id={`updatetodo-form${el.to_id}`}
          className="modal"
          onClose={hdlClose}
        >
          <div className="modal-box rounded-lg">
            <EditTodoPage resetForm={resetForm} el={el} />
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
