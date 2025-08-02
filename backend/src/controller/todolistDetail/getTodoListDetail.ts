import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { log } from "console";
import getUserJWT from "../../function/getUserJWT";

export default async function getTodolistDetail(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    // 1. ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
    const userJWT = await getUserJWT(req);
    if (!userJWT) {
      res.status(401).json({ msg: "กรุณาเข้าสู่ระบบ (Unauthorized)" });
      return;
    }

    const { id } = req.params; // <-- แก้ไข: ใช้ id แทน td_id

    // 2. กรณีมีการระบุ ID: ดึงข้อมูล Detail ชิ้นเดียว
    if (id) {
      const todolistDetailData = await prisma.todolistDetail.findUnique({
        where: {
          id: id, // <-- แก้ไข
        },
        include: {
          todolist: { // <-- แก้ไข
            select: {
              id: true,
              title: true,
              creator: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      if (!todolistDetailData) {
        res.status(404).json({ msg: "ไม่พบรายละเอียดที่ระบุ" });
        return;
      }

      res.status(200).json({ data: todolistDetailData });
      return;
    }

    // 3. กรณีไม่ระบุ ID: ดึงข้อมูล Detail ทั้งหมด
    // (หมายเหตุ: ในการใช้งานจริง อาจจะต้องการดึง Detail ของ Todolist อันเดียว)
    const allTodolistDetails = await prisma.todolistDetail.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        todolist: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.status(200).json({ data: allTodolistDetails });
    return;
  } catch (error) {
    log("[Express] getTodolistDetail Error : ", error);
    res.status(500).json({ msg: "ดึงข้อมูล Todolist Detail ไม่สำเร็จ" });
  } finally {
    await prisma.$disconnect();
  }
}