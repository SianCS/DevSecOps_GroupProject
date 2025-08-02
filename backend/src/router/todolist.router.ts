// backend/src/router/todolist.ts

import { Router } from "express";
import getTodolist from "../controller/todolist/getTodolist";
import addTodolist from "../controller/todolist/addTodolist";
import editTodolist from "../controller/todolist/editTodolist";
import delTodolist from "../controller/todolist/delTodolist";

const todolistRouter = Router();

// --- แก้ไขชื่อพารามิเตอร์ใน Route ทั้งหมด ---
todolistRouter.get("/", getTodolist);
todolistRouter.get("/:id", getTodolist);         // <-- แก้ไขตรงนี้
todolistRouter.post("/", addTodolist);
todolistRouter.put("/:id", editTodolist);         // <-- แก้ไขตรงนี้
todolistRouter.delete("/:id", delTodolist);     // <-- แก้ไขตรงนี้

export default todolistRouter;