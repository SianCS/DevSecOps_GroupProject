import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import useTodoStore from "../stores/useTodoStore";
import { Trash } from "lucide-react";
import CreateTodoDetailPage from "./CreateTodoDetailPage";
import { toast } from "react-toastify";
import useDetailStore from "../stores/useDetailStore";
import EditTodoDetailPage from "./EditTodoDetailPage";

function TodoDetailPage() {
  const navi = useNavigate();
  const [resetForm, setResetForm] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const { id } = useParams();
  const todoDetail = useTodoStore((state) => state.todoDetail);
  const deleteTodoDetailById = useDetailStore(
    (state) => state.deleteTodoDetailById
  );
  const getTodoById = useTodoStore((state) => state.getTodoById);
  const hdlClose = () => {
    setResetForm((prv) => !prv);
  };
  useEffect(() => {
    getTodoById(id);
  }, []);
  const todoDetails = todoDetail.todolist_detail ?? [];
  const localDate = (date) => {
    return new Date(date).toLocaleString("en-EN", {
      dateStyle: "long",
      timeZone: "Asia/Bangkok",
    });
  };
  const hdlDelete = async (id) => {
    try {
      setIsDelete(true);
      const res = await deleteTodoDetailById(id);
      toast.success(res.data.msg);
    } catch (error) {
      const errMsg = error.reponse?.data?.msg || error.message;
      toast.error(errMsg);
    } finally {
      setIsDelete(false);
    }
  };
  return (
    <div>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-30">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">{todoDetail.to_title}</h2>
            <p>ID: {todoDetail.to_id}</p>
            <p>CreateAt: {localDate(todoDetail.createAt)}</p>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4">Todo Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg text-left">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3 border-b w-30">ID</th>
                <th className="p-3 border-b w-30">Title</th>
                <th className="p-3 border-b">Descript</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Edit</th>
              </tr>
            </thead>
            <tbody>
              {todoDetails.length > 0 ? (
                todoDetail.todolist_detail.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{item.td_id}</td>
                    <td className="p-3 border-b">{item.td_title}</td>
                    <td className="p-3 border-b">{item.td_descript}</td>
                    <td className="p-3 border-b">
                      {item.td_completed ? "Done" : "On process"}
                    </td>
                    <td className="text-center w-120">
                      <div className="flex gap-5 w-full justify-center">
                        <button
                          className="btn btn-accent"
                          disabled={isDelete}
                          onClick={() =>
                            document
                              .getElementById(
                                `updatetodoDetail-form${item.td_id}`
                              )
                              .showModal()
                          }
                        >
                          Edit todo
                        </button>
                        <button
                          className="btn btn-neutral"
                          disabled={isDelete}
                          onClick={() => hdlDelete(item.td_id)}
                        >
                          <Trash /> Delete todo
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    No todo detail found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-10 flex justify-between mx-auto w-1/2">
        <button className="btn btn-secondary btn-lg" onClick={() => navi("/")}>
          Back to Todo page
        </button>
        <button
          className="btn btn-secondary btn-lg"
          onClick={() =>
            document.getElementById("createtodoDetail-form").showModal()
          }
        >
          Create new todo detail
        </button>
      </div>
      <dialog id={`createtodoDetail-form`} className="modal" onClose={hdlClose}>
        <div className="modal-box rounded-lg">
          <CreateTodoDetailPage resetForm={resetForm} id={id} />
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </dialog>
      {todoDetails.map((el, idx) => (
        <dialog
          key={idx}
          id={`updatetodoDetail-form${el.td_id}`}
          className="modal"
          onClose={hdlClose}
        >
          <div className="modal-box rounded-lg">
            <EditTodoDetailPage el={el} resetForm={resetForm} />
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
export default TodoDetailPage;
