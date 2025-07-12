import axios from "axios";

const todoDetailApi = axios.create({
  baseURL: "http://localhost:3026/api/todolistdetail",
});

const bearerToken = (token) => ({
  headers: { Authorization: `${token}` },
});

const todoDetailToBackend = {
  postTodoDeatilById: (input, token) =>
    todoDetailApi.post("/", input, bearerToken(token)),
  editTodoDetailById: (id, input, token) =>
    todoDetailApi.put(`/${id}`, input, bearerToken(token)),
  deleteTodoDetailById: (id, token) =>
    todoDetailApi.delete(`/${id}`, bearerToken(token)),
};

export default todoDetailToBackend;
