import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { validateInput, ValidationSchema } from "../../plugin/validator";

import getUserJWT from "../../function/getUserJWT";

import { log } from "console";

export default async function addTodolist(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    // 1. ดึงข้อมูลผู้ใช้จาก JWT (ซึ่งตอนนี้จะมี id และ role)
    const userJWT = await getUserJWT(req);
    if (!userJWT) {
      res.status(401).json({ msg: "กรุณาเข้าสู่ระบบ (Unauthorized)" });
      return;
    }

    // 2. ตรวจสอบ Role (สำคัญที่สุด)
    if (userJWT.role !== "TEACHER") {
      res.status(403).json({ msg: "คุณไม่มีสิทธิ์สร้าง Todolist (Forbidden)" });
      return;
    }

    // 3. ปรับ Schema การตรวจสอบข้อมูลให้ตรงกับ Model ใหม่
    const schema: ValidationSchema = {
      title: { // <-- แก้ไขจาก to_title
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

    const { title } = validate.data; // <-- แก้ไขจาก to_title

    // 4. สร้างข้อมูลในฐานข้อมูลตาม Schema ใหม่
    const newTodolist = await prisma.todolist.create({
      data: {
        title: title,           // <-- แก้ไข
        creatorId: userJWT.id,  // <-- แก้ไข: ใช้ creatorId และ userJWT.user_id
      },
    });

    res.status(201).json({ msg: "เพิ่ม Todolist สำเร็จ", data: newTodolist });
  } catch (error) {
    log("[Express] addTodolist Error : ", error);
    res.status(500).json({ msg: "เพิ่ม Todolist ไม่สำเร็จ" });
  } finally {
    await prisma.$disconnect();
  }
}