import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Loader, Trash, FilePlus, Edit } from "lucide-react";

import useTodoStore from "../stores/useTodoStore";
import useDetailStore from "../stores/useDetailStore";
import useAuthStore from "../stores/authStore";

import CreateTodoDetailPage from "./CreateTodoDetailPage";
import EditTodoDetailPage from "./EditTodoDetailPage";

function TodoDetailPage() {
  const { id } = useParams();
  const navi = useNavigate();

  const currentUser = useAuthStore((state) => state.user);
  const todoDetail = useTodoStore((state) => state.todoDetail);
  const getTodoById = useTodoStore((state) => state.getTodoById);
  const deleteTodoDetailById = useDetailStore(
    (state) => state.deleteTodoDetailById
  );

  const [isLoading, setIsLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [resetCreateForm, setResetCreateForm] = useState(false);
  const [resetEditForm, setResetEditForm] = useState(false);

  useEffect(() => {
    const fetchTodo = async () => {
      setIsLoading(true);
      await getTodoById(id);
      setIsLoading(false);
    };
    fetchTodo();
  }, [id, getTodoById]);

  const hdlDeleteDetail = async (detailId) => {
    try {
      if (confirm("Are you sure you want to delete this detail?")) {
        const res = await deleteTodoDetailById(detailId);
        toast.success(res.data.msg);
        await getTodoById(id);
      }
    } catch (error) {
      const errMsg = error.response?.data?.msg || error.message;
      toast.error(errMsg);
    }
  };

  if (isLoading) {
    return <Loader className="animate-spin mx-auto mt-20" size={48} />;
  }

  // **สร้างตัวแปรเพื่อเช็คว่าเป็น Teacher หรือไม่ เพื่อให้โค้ดอ่านง่ายขึ้น**
  const isTeacher = currentUser?.role === "TEACHER";

  return (
    <div className="container mx-auto p-4 md:p-8">
      <button className="btn btn-ghost mb-4" onClick={() => navi(-1)}>
        &larr; Back to All Lists
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">
          Todo: <span className="text-accent">{todoDetail?.title}</span>
        </h1>

        {/* ปุ่ม Create จะมองเห็นตลอด แต่กดได้เฉพาะ Teacher */}
        <button
          className="btn btn-primary"
          onClick={() => {
            setResetCreateForm((p) => !p);
            document.getElementById("createtodoDetail-form").showModal();
          }}
          disabled={!isTeacher}
        >
          <FilePlus /> Create New Detail
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todoDetail?.details?.map((detail) => (
              <tr key={detail.id} className="hover">
                <td>{detail.title}</td>
                <td>{detail.description || "-"}</td>
                <td>
                  <span
                    className={`badge ${
                      detail.completed ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {detail.completed ? "Done" : "On Process"}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setSelectedDetail(detail);
                        setResetEditForm((p) => !p);
                        document
                          .getElementById(`updatetodoDetail-form${detail.id}`)
                          .showModal();
                      }}
                      disabled={!isTeacher}
                    >
                      <Edit />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => hdlDeleteDetail(detail.id)}
                      disabled={!isTeacher}
                    >
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!todoDetail?.details || todoDetail.details.length === 0) && (
          <p className="text-center mt-8 text-gray-500">
            No details found. Create one!
          </p>
        )}
      </div>

      {/* --- Modal สำหรับสร้าง Detail --- */}
      <dialog id="createtodoDetail-form" className="modal">
        <div className="modal-box">
          <CreateTodoDetailPage todolistId={id} resetForm={resetCreateForm} />
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </dialog>

      {/* --- Modal สำหรับแก้ไข Detail --- */}
      {selectedDetail && (
        <dialog
          id={`updatetodoDetail-form${selectedDetail.id}`}
          className="modal"
        >
          <div className="modal-box">
            <EditTodoDetailPage el={selectedDetail} resetForm={resetEditForm} />
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default TodoDetailPage;