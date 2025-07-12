import { create } from "zustand";
import todoToBackend from "../api/todoApi";
import useAuthStore from "./authStore";

const useTodoStore = create((set, get) => ({
  todoList: [],
  todoDetail: [],
  getAllTodoLists: async () => {
    const token = useAuthStore.getState().accessToken;
    const res = await todoToBackend.getAllTodo(token);
    set({ todoList: res.data.data });
    return res;
  },
  getTodoById: async (id) => {
    const token = useAuthStore.getState().accessToken;
    const res = await todoToBackend.getTodoById(id, token);
    set({ todoDetail: res.data.data });
  },
  createTodoList: async (input) => {
    const token = useAuthStore.getState().accessToken;
    const res = await todoToBackend.createTodo(input, token);
    get().getAllTodoLists(token);
    return res;
  },
  deleteTodoList: async (id) => {
    const token = useAuthStore.getState().accessToken;
    const res = await todoToBackend.deleteTodo(id, token);
    get().getAllTodoLists(token);
    return res;
  },
  editTodoList: async (id, input) => {
    const token = useAuthStore.getState().accessToken;
    const res = await todoToBackend.editTodo(id, input, token);
    get().getAllTodoLists(token);
    return res;
  },
}));

export default useTodoStore;
