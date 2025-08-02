import { create } from "zustand";
import useAuthStore from "./authStore";
import todoDetailToBackend from "../api/todoDetailApi";
import useTodoStore from "./useTodoStore";

const useDetailStore = create((set, get) => ({
  // ฟังก์ชันสร้าง Detail ใหม่
  postTodoDetailById: async (todolistId, input) => {
  try {
    const token = useAuthStore.getState().accessToken;
    if (!token) throw new Error("Please log in again.");

    const res = await todoDetailToBackend.createTodoDetail(todolistId, input, token);
    
    // หลังจากสร้างสำเร็จ ให้โหลดข้อมูลของ Todolist หลักใหม่เพื่ออัปเดต UI
    await useTodoStore.getState().getTodoById(todolistId);

    return res;
  } catch (err) {
    console.error("Error creating todo detail:", err);
    throw err;
  }
},

  // ฟังก์ชันแก้ไข Detail
  editTodoDetailById: async (id, input) => {
    try {
      const token = useAuthStore.getState().accessToken;
      if (!token) throw new Error("Please log in again.");

      const res = await todoDetailToBackend.editTodoDetailById(id, input, token);
      
      const currentTodoDetail = useTodoStore.getState().todoDetail;
      if (currentTodoDetail) {
        await useTodoStore.getState().getTodoById(currentTodoDetail.id);
      }

      return res;
    } catch (err) { // **<-- แก้ไข: เพิ่มวงเล็บปีกกา { ที่นี่**
      console.error(`Error editing todo detail ${id}:`, err);
      throw err;
    } // **<-- และเพิ่มวงเล็บปีกกา } ปิดที่นี่**
  },

  // ฟังก์ชันลบ Detail
  deleteTodoDetailById: async (id) => {
    try {
      const token = useAuthStore.getState().accessToken;
      if (!token) throw new Error("Please log in again.");

      const res = await todoDetailToBackend.deleteTodoDetailById(id, token);

      const currentTodoDetail = useTodoStore.getState().todoDetail;
      if (currentTodoDetail) {
        await useTodoStore.getState().getTodoById(currentTodoDetail.id);
      }
      
      return res;
    } catch (err) {
      console.error(`Error deleting todo detail ${id}:`, err);
      throw err;
    }
  },
}));

export default useDetailStore;