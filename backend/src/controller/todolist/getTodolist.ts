import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { log } from "console";

import getUserJWT from "../../function/getUserJWT";

export default async function getTodolist(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    // 1. ตรวจสอบการล็อกอิน (แต่ไม่ใช้ข้อมูล JWT ในการกรอง)
    const userJWT = await getUserJWT(req);
    if (!userJWT) {
      res.status(401).json({ msg: "กรุณาเข้าสู่ระบบ (Unauthorized)" });
      return;
    }

    const { id } = req.params; // <-- แก้ไข: ใช้ id แทน to_id

    // 2. กรณีมีการระบุ ID: ดึงข้อมูล Todolist ชิ้นเดียว
    if (id) {
      const todolistData = await prisma.todolist.findUnique({
        where: {
          id: id, // <-- แก้ไข
        },
        include: {
          details: true, // <-- แก้ไข
          creator: {
            // <-- เพิ่ม: ดึงข้อมูลผู้สร้างมาด้วย
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      if (!todolistData) {
        res.status(404).json({ msg: "ไม่พบ Todolist นี้" });
        return;
      }

      res.status(200).json({ data: todolistData });
      return;
    }

    // 3. กรณีไม่ระบุ ID: ดึงข้อมูล Todolist ทั้งหมด
    const allTodolists = await prisma.todolist.findMany({
      orderBy: { // เรียงตามวันที่สร้างล่าสุด
        createdAt: "desc",
      },
      include: {
        details: true, // <-- แก้ไข
        creator: {
          // <-- เพิ่ม: ดึงข้อมูลผู้สร้างมาด้วย
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json({ data: allTodolists });
  } catch (error) {
    log("[Express] getTodolist Error : ", error);
    res.status(500).json({ msg: "ดึงข้อมูล Todolist ไม่สำเร็จ" });
  } finally {
    await prisma.$disconnect();
  }
}