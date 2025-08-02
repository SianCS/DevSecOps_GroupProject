// backend/src/middleware/isLogin.ts

import { Request, Response, NextFunction } from "express";
import { decodeJWT } from "../plugin/JWT";

export default async function isLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    // 1. ตรวจสอบว่ามี Header และขึ้นต้นด้วย "Bearer " หรือไม่
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ msg: "ไม่ได้รับอนุญาต (Token not provided)" });
      return; // จบการทำงานทันที
    }

    // 2. ตัดคำว่า "Bearer " ออกไป ให้เหลือแต่ตัว Token
    const token = authHeader.split(" ")[1];

    // 3. **สำคัญที่สุด:** ดักจับกรณีที่ token เป็น "null", "undefined", หรือค่าว่าง
    if (!token || token === "null" || token === "undefined") {
      res.status(401).json({ msg: "รูปแบบ Token ไม่ถูกต้อง" });
      return; // จบการทำงานทันที
    }

    // 4. ส่ง Token ที่สะอาดแล้วไปถอดรหัส
    const decoded = await decodeJWT(token);

    if (!decoded) {
      res.status(401).json({ msg: "Token ไม่ถูกต้องหรือหมดอายุ" });
      return;
    }
    
    // (Optional) แนบข้อมูลผู้ใช้ไปกับ request เพื่อให้ Controller อื่นใช้ต่อได้
    // (req as any).user = decoded;

    next(); // ถ้าทุกอย่างถูกต้อง ให้ทำงานในลำดับถัดไป
  } catch (error) {
    // ดักจับ Error ที่อาจเกิดขึ้นจาก decodeJWT เช่น jwt malformed
    console.log("[Middleware] isLogin Error: ", error);
    res.status(401).json({ msg: "Token ไม่ถูกต้อง (Invalid Token)" });
  }
}