import express from "express";
import addTodolistDetail from "../controller/todolistDetail/addTodolistDetail";
import delTodolistDetail from "../controller/todolistDetail/delTodolistDetail";
import editTodolistDetail from "../controller/todolistDetail/editTodolistDetail";
import getTodolistDetail from "../controller/todolistDetail/getTodoListDetail";

const todolistDetailRouter = express.Router();

todolistDetailRouter.get("/", getTodolistDetail);
todolistDetailRouter.get("/:td_id", getTodolistDetail);
todolistDetailRouter.post("/", addTodolistDetail);
todolistDetailRouter.put("/:td_id", editTodolistDetail);
todolistDetailRouter.delete("/:td_id", delTodolistDetail);

export default todolistDetailRouter;
