import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { log } from "console";

import { validateInput, ValidationSchema } from "../../plugin/validator";
import getUserJWT from "../../function/getUserJWT";

export default async function addTodolistDetail(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    // 1. ตรวจสอบสิทธิ์ผู้ใช้ (ต้องเป็น TEACHER เท่านั้น)
    const userJWT = await getUserJWT(req);
    if (!userJWT || userJWT.role !== "TEACHER") {
      res.status(403).json({ msg: "คุณไม่มีสิทธิ์ดำเนินการ (Forbidden)" });
      return;
    }

    // 2. รับ ID ของ Todolist หลักมาจาก URL params
    const { todolistId } = req.params;
    if (!todolistId) {
      res.status(400).json({ msg: "กรุณาระบุ ID ของ Todolist หลัก" });
      return;
    }

    // 3. ตรวจสอบว่า Todolist หลักมีอยู่จริง และผู้ใช้เป็นเจ้าของ
    const todolist = await prisma.todolist.findUnique({
      where: { id: todolistId },
    });

    if (!todolist) {
      res.status(404).json({ msg: "ไม่พบ Todolist หลักที่ระบุ" });
      return;
    }

    if (todolist.creatorId !== userJWT.id) {
      res.status(403).json({ msg: "คุณไม่ใช่เจ้าของ Todolist นี้" });
      return;
    }

    // 4. กำหนดและตรวจสอบข้อมูลที่ส่งมาใน body
    const schema: ValidationSchema = {
      title: {
        type: "string",
        required: true,
        displayName: "หัวข้อรายละเอียด",
      },
      description: {
        type: "string",
        required: false, // คำอธิบายไม่บังคับ
        displayName: "คำอธิบาย",
      },
    };

    const validate = validateInput(req.body, schema);
    if (!validate.success) {
      res.status(400).json({ msg: validate.errorMsg });
      return;
    }

    const { title, description } = validate.data;

    // 5. สร้างข้อมูล TodolistDetail ใหม่ในฐานข้อมูล
    const newDetail = await prisma.todolistDetail.create({
      data: {
        title: title,
        description: description,
        todolistId: todolistId, // เชื่อมความสัมพันธ์ไปยัง Todolist หลัก
        // field 'completed' จะเป็น false โดยอัตโนมัติตาม @default ใน schema
      },
    });

    res.status(201).json({ msg: "เพิ่มรายละเอียดสำเร็จ", data: newDetail });
  } catch (error) {
    log("[Express] addTodolistDetail Error : ", error);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในการเพิ่มรายละเอียด" });
  } finally {
    await prisma.$disconnect();
  }
}