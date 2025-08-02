
import express from "express";
import addTodolistDetail from "../controller/todolistDetail/addTodolistDetail";
import delTodolistDetail from "../controller/todolistDetail/delTodolistDetail";
import editTodolistDetail from "../controller/todolistDetail/editTodolistDetail";
import getTodolistDetail from "../controller/todolistDetail/getTodoListDetail"; // แก้ไขชื่อไฟล์ที่ import

const todolistDetailRouter = express.Router();

// GET /api/todolistdetail/:id -> ดึง Detail อันเดียว
todolistDetailRouter.get("/:id", getTodolistDetail);

// POST /api/todolistdetail/:todolistId -> สร้าง Detail ใหม่ใน Todolist หลัก
todolistDetailRouter.post("/:todolistId", addTodolistDetail);

// PUT /api/todolistdetail/:id -> แก้ไข Detail
todolistDetailRouter.put("/:id", editTodolistDetail);

// DELETE /api/todolistdetail/:id -> ลบ Detail
todolistDetailRouter.delete("/:id", delTodolistDetail);

export default todolistDetailRouter;