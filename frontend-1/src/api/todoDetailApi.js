import axios from "axios";

const todoDetailApi = axios.create({
  // ตรวจสอบให้แน่ใจว่า URL ถูกต้อง
  baseURL: "http://localhost:3026/api/todolistdetail",
});

// **สำคัญที่สุด:** เพิ่ม "Bearer " (มีเว้นวรรค) เข้าไปใน Header
const bearerToken = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const todoDetailToBackend = {
  // **แก้ไข 1:** เปลี่ยนชื่อฟังก์ชันและ Endpoint ให้ถูกต้อง
  // รับ todolistId มาเพื่อสร้าง URL ที่ถูกต้อง
  createTodoDetail: (todolistId, input, token) =>
    todoDetailApi.post(`/${todolistId}`, input, bearerToken(token)),

  // ฟังก์ชันอื่นๆ (ถูกต้องแล้ว แต่ปรับชื่อฟังก์ชัน create เพื่อความสอดคล้อง)
  editTodoDetailById: (id, input, token) =>
    todoDetailApi.put(`/${id}`, input, bearerToken(token)),
    
  deleteTodoDetailById: (id, token) =>
    todoDetailApi.delete(`/${id}`, bearerToken(token)),
};

export default todoDetailToBackend;