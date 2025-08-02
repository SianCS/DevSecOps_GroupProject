import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { log } from "console";
import getUserJWT from "../../function/getUserJWT";

export default async function delTodolistDetail(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    // 1. ตรวจสอบสิทธิ์ผู้ใช้ (ต้องเป็น TEACHER)
    const userJWT = await getUserJWT(req);
    if (!userJWT || userJWT.role !== "TEACHER") {
      res.status(403).json({ msg: "คุณไม่มีสิทธิ์ดำเนินการ (Forbidden)" });
      return;
    }

    // 2. รับ ID ของ Detail ที่จะลบจาก URL params
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ msg: "กรุณาระบุ ID ของรายละเอียดที่ต้องการลบ" });
      return;
    }

    // 3. ค้นหา Detail พร้อมกับข้อมูล Todolist หลักเพื่อตรวจสอบเจ้าของ
    const detailToDelete = await prisma.todolistDetail.findUnique({
      where: { id: id },
      include: {
        todolist: { // ดึงข้อมูล Todolist หลักมาด้วย
          select: {
            creatorId: true, // เลือกเฉพาะ creatorId
          },
        },
      },
    });

    if (!detailToDelete) {
      res.status(404).json({ msg: "ไม่พบรายละเอียดที่ระบุ" });
      return;
    }

    // 4. ตรวจสอบว่าเป็นเจ้าของ Todolist หลักหรือไม่
    if (detailToDelete.todolist.creatorId !== userJWT.id) {
      res.status(403).json({ msg: "คุณไม่ใช่เจ้าของ Todolist นี้" });
      return;
    }

    // 5. ถ้าทุกอย่างถูกต้อง ให้ทำการลบ
    await prisma.todolistDetail.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      msg: `คุณได้ลบรายการย่อย "${detailToDelete.title}" สำเร็จ`,
    });
  } catch (error) {
    log("[Express] delTodolistDetail Error : ", error);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในการลบรายละเอียด" });
  } finally {
    await prisma.$disconnect();
  }
}