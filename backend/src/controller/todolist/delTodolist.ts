import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { log } from "console";

import getUserJWT from "../../function/getUserJWT";

export default async function delTodolist(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    // 1. ดึงข้อมูลผู้ใช้จาก JWT
    const userJWT = await getUserJWT(req);
    if (!userJWT) {
      res.status(401).json({ msg: "กรุณาเข้าสู่ระบบ (Unauthorized)" });
      return;
    }

    // 2. ตรวจสอบ Role ว่าเป็น TEACHER หรือไม่
    if (userJWT.role !== "TEACHER") {
      res.status(403).json({ msg: "คุณไม่มีสิทธิ์ลบ Todolist (Forbidden)" });
      return;
    }

    // 3. ดึง ID ของ Todolist จาก params และเปลี่ยนชื่อเป็น 'id'
    const { id } = req.params; // <-- แก้ไข: ใช้ id แทน to_id
    if (!id) {
      res.status(400).json({ msg: "กรุณาระบุ Todolist ID" });
      return;
    }

    // 4. ตรวจสอบความเป็นเจ้าของ Todolist
    const todolist = await prisma.todolist.findUnique({
      where: {
        id: id, // <-- แก้ไข
      },
    });

    if (!todolist) {
      res.status(404).json({ msg: "ไม่พบ Todolist ID นี้" });
      return;
    }

    // ตรวจสอบว่า creatorId ตรงกับ id ของผู้ใช้ที่ล็อกอินหรือไม่
    if (todolist.creatorId !== userJWT.id) {
      res.status(403).json({ msg: "คุณไม่ใช่เจ้าของ Todolist นี้ (Forbidden)" });
      return;
    }

    // 5. ลบข้อมูลในฐานข้อมูล
    await prisma.todolist.delete({
      where: {
        id: id, // <-- แก้ไข
      },
    });

    res.status(200).json({
      msg: `คุณได้ลบ Todolist "${todolist.title}" สำเร็จ`,
    });
  } catch (error) {
    log("[Express] delTodolist Error : ", error);
    res.status(500).json({ msg: "ลบ Todolist ไม่สำเร็จ" });
  } finally {
    await prisma.$disconnect();
  }
}