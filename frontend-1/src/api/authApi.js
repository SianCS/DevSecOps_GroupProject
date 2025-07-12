import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:3026/api/auth",
});

const authToBackend = {
  register: (input) => authApi.post("/register", input),
  login: (input) => authApi.post("/login", input),
};

export default authToBackend;
