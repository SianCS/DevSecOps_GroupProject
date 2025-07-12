import axios from "axios";

const todoApi = axios.create({
  baseURL: "http://localhost:3026/api/todolist",
});

const bearerToken = (token) => ({
  headers: { Authorization: `${token}` },
});

const todoToBackend = {
  getAllTodo: (token) => todoApi.get("/", bearerToken(token)),
  getTodoById: (id, token) => todoApi.get(`/${id}`, bearerToken(token)),
  createTodo: (input, token) => todoApi.post("/", input, bearerToken(token)),
  editTodo: (id, input, token) =>
    todoApi.put(`/${id}`, input, bearerToken(token)),
  deleteTodo: (id, token) => todoApi.delete(`/${id}`, bearerToken(token)),
};

export default todoToBackend;
