import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { log } from "console";

import { validateInput, ValidationSchema } from "../../plugin/validator";
import getUserJWT from "../../function/getUserJWT";

export default async function editTodolist(req: Request, res: Response) {
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
      res.status(403).json({ msg: "คุณไม่มีสิทธิ์แก้ไข Todolist (Forbidden)" });
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

    // 5. ตรวจสอบข้อมูลที่ส่งมา (ใช้ title แทน to_title)
    const schema: ValidationSchema = {
      title: { // <-- แก้ไข
        type: "string",
        minLength: 1,
        displayName: "ชื่อรายการ",
        required: true,
      },
    };

    const validate = validateInput(req.body, schema);
    if (!validate.success) {
      res.status(400).json({ msg: validate.errorMsg });
      return;
    }

    const { title } = validate.data; // <-- แก้ไข

    // 6. อัปเดตข้อมูลในฐานข้อมูลด้วย Field ที่ถูกต้อง
    const updatedTodolist = await prisma.todolist.update({
      where: {
        id: id, // <-- แก้ไข
      },
      data: {
        title: title, // <-- แก้ไข
      },
    });

    res.status(200).json({
      msg: `แก้ไข Todolist เป็น "${updatedTodolist.title}" สำเร็จ`,
      data: updatedTodolist,
    });
  } catch (error) {
    log("[Express] editTodolist Error : ", error);
    res.status(500).json({ msg: "แก้ไข Todolist ไม่สำเร็จ" });
  } finally {
    await prisma.$disconnect();
  }
}