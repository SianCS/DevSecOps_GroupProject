import express from "express";
import cors from "cors";
import isLogin from "./middleware/isLogin";
import authRouter from "./router/auth.router";
import todolistRouter from "./router/todolist.router";
import todolistDetailRouter from "./router/todolist-detail.router";
import helmet from "helmet";

const app = express();
app.use(express.json());
app.disable("x-powered-by");
app.use(helmet());
// Middleware ป้องกันการเรียกใช้งาน API ข้างนอก
app.use(
  cors({
    origin: ["http://localhost:5173"], // อนุญาตเฉพาะ origin นี้ หรือ true เพื่ออนุญาติทั้งหมด
    methods: ["GET", "POST", "PUT", "DELETE"], // อนุญาตเฉพาะ methods ที่ระrelate
    allowedHeaders: ["Content-Type", "Authorization"], // กำหนด headers ที่อนุญาต
    credentials: true, // อนุญาตให้ส่ง cookies หรือ credentials
  })
);
// Middleware เพิ่ม HTTP headers เพื่อเสริมความปลอดภัย

app.use("/api/auth", authRouter);

app.use("/api/todolist", isLogin, todolistRouter);
app.use("/api/todolistdetail", isLogin, todolistDetailRouter);

export default app;
