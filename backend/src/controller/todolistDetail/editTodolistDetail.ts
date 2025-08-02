import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { log } from "console";

import { validateInput, ValidationSchema } from "../../plugin/validator";
import getUserJWT from "../../function/getUserJWT";

export default async function editTodolistDetail(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    // 1. ตรวจสอบสิทธิ์ผู้ใช้ (ต้องเป็น TEACHER)
    const userJWT = await getUserJWT(req);
    if (!userJWT || userJWT.role !== "TEACHER") {
      res.status(403).json({ msg: "คุณไม่มีสิทธิ์ดำเนินการ (Forbidden)" });
      return;
    }

    // 2. รับ ID ของ Detail ที่จะแก้ไขจาก URL params
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ msg: "กรุณาระบุ ID ของรายละเอียดที่ต้องการแก้ไข" });
      return;
    }

    // 3. ค้นหา Detail พร้อมกับข้อมูล Todolist หลักเพื่อตรวจสอบเจ้าของ
    const detailToEdit = await prisma.todolistDetail.findUnique({
      where: { id: id },
      include: {
        todolist: {
          select: {
            creatorId: true,
          },
        },
      },
    });

    if (!detailToEdit) {
      res.status(404).json({ msg: "ไม่พบรายละเอียดที่ระบุ" });
      return;
    }

    // 4. ตรวจสอบว่าเป็นเจ้าของ Todolist หลักหรือไม่
    if (detailToEdit.todolist.creatorId !== userJWT.id) {
      res.status(403).json({ msg: "คุณไม่ใช่เจ้าของ Todolist นี้" });
      return;
    }

    // 5. กำหนดและตรวจสอบข้อมูลที่ส่งมาใน body
    const schema: ValidationSchema = {
      title: {
        type: "string",
        required: true,
        displayName: "หัวข้อรายละเอียด",
      },
      description: {
        type: "string",
        required: false,
        displayName: "คำอธิบาย",
      },
      completed: {
        type: "boolean",
        required: false,
        displayName: "สถานะ",
      },
    };

    const validate = validateInput(req.body, schema);
    if (!validate.success) {
      res.status(400).json({ msg: validate.errorMsg });
      return;
    }

    // 6. อัปเดตข้อมูล
    const updatedDetail = await prisma.todolistDetail.update({
      where: {
        id: id,
      },
      data: {
        title: validate.data.title,
        description: validate.data.description,
        completed: validate.data.completed,
      },
    });

    res.status(200).json({
      msg: `คุณได้แก้ไขรายการย่อย "${updatedDetail.title}" สำเร็จ`,
      data: updatedDetail,
    });
  } catch (error) {
    log("[Express] editTodolistDetail Error : ", error);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในการแก้ไขรายละเอียด" });
  } finally {
    await prisma.$disconnect();
  }
}