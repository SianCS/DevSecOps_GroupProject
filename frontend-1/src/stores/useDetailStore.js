import { create } from "zustand";
import useAuthStore from "./authStore";
import todoDetailToBackend from "../api/todoDetailApi";
import useTodoStore from "./useTodoStore";

const useDetailStore = create((set, get) => ({
  postTodoDetailById: async (input) => {
    const token = useAuthStore.getState().accessToken;
    const res = await todoDetailToBackend.postTodoDeatilById(input, token);
    return res;
  },
  editTodoDetailById: async (id, input) => {
    const token = useAuthStore.getState().accessToken;
    const res = await todoDetailToBackend.editTodoDetailById(id, input, token);
    return res;
  },
  deleteTodoDetailById: async (id) => {
    const token = useAuthStore.getState().accessToken;
    const res = await todoDetailToBackend.deleteTodoDetailById(id, token);
    return res;
  },
}));

export default useDetailStore;
