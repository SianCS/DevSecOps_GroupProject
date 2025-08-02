import { create } from "zustand";
import todoToBackend from "../api/todoApi";
import useAuthStore from "./authStore";

const useTodoStore = create((set, get) => ({
  todoList: [],
  todoDetail: [],
  
  getAllTodoLists: async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await todoToBackend.getAllTodo(token);
      set({ todoList: res.data.data });
      return res;
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  },

  getTodoById: async (id) => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await todoToBackend.getTodoById(id, token);
      set({ todoDetail: res.data.data });
    } catch (err) {
      console.error(`Error fetching todo with id ${id}:`, err);
    }
  },

  createTodoList: async (input) => {
    try {
      const token = useAuthStore.getState().accessToken;
      // --- แก้ไขตรงนี้: ส่ง input ที่ได้รับมาไปตรงๆ ได้เลย ---
      const res = await todoToBackend.createTodo(input, token);
      // ----------------------------------------------------
      await get().getAllTodoLists();
      return res;
    } catch (err) {
      console.error("Error creating todo:", err);
      throw err; // โยน error ต่อเพื่อให้หน้าเว็บรับรู้
    }
  },

  deleteTodoList: async (id) => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await todoToBackend.deleteTodo(id, token);
      await get().getAllTodoLists();
      return res;
    } catch (err) {
      console.error(`Error deleting todo with id ${id}:`, err);
      throw err;
    }
  },

  editTodoList: async (id, input) => {
    try {
      const token = useAuthStore.getState().accessToken;
      // --- แก้ไขตรงนี้: ส่ง input ที่ได้รับมาไปตรงๆ ได้เลย ---
      const res = await todoToBackend.editTodo(id, input, token);
      // ----------------------------------------------------
      await get().getAllTodoLists();
      return res;
    } catch (err) {
      console.error(`Error editing todo with id ${id}:`, err);
      throw err;
    }
  },
}));

export default useTodoStore;