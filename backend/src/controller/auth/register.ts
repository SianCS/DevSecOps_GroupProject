import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { log } from "console";

import { validateInput, ValidationSchema } from "../../plugin/validator";
import { encodeJWT } from "../../plugin/JWT";
import JWTUserData from "../../interfaces/JWTUserData";

export default async function register(req: Request, res: Response) {
  const prisma = new PrismaClient();
  try {
    // 1. กำหนด Schema สำหรับตรวจสอบข้อมูล โดยใช้ type จาก Validator ตัวใหม่
    const schema: ValidationSchema = {
      username: {
        type: "string",
        minLength: 6,
        displayName: "ชื่อผู้ใช้งาน",
        required: true,
      },
      email: {
        type: "email", // <-- ใช้ "email" ได้เลย
        displayName: "อีเมล",
        required: true,
      },
      password: {
        type: "password", // <-- ใช้ "password" เพื่อให้มีการตรวจสอบที่ซับซ้อนขึ้น
        minLength: 8,
        displayName: "รหัสผ่าน",
        required: true,
      },
    };

    // 2. ตรวจสอบข้อมูลที่รับเข้ามา
    const validate = validateInput(req.body, schema);
    if (!validate.success) {
      res.status(400).json({ msg: validate.errorMsg });
      return;
    }

    const { username, email, password } = validate.data;

    // 3. ตรวจสอบว่ามี username หรือ email ซ้ำในระบบหรือไม่
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      res.status(409).json({ msg: "ชื่อผู้ใช้งาน หรืออีเมลนี้ถูกใช้งานไปแล้ว" }); // 409 Conflict
      return;
    }

    // 4. เข้ารหัสผ่าน
    const passwordHash: string = await bcrypt.hash(password, 10);

    // 5. สร้างผู้ใช้ใหม่ในฐานข้อมูล
    // (role จะถูกกำหนดเป็น STUDENT โดยอัตโนมัติตาม @default ใน schema)
    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: passwordHash,
      },
    });

    // 6. เตรียมข้อมูลสำหรับสร้าง Token (JWT)
    const jwtEncodeData: JWTUserData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    const token: string | null = await encodeJWT(jwtEncodeData);

    // 7. ส่ง Token กลับไปให้ผู้ใช้
    res.status(201).json({ msg: "สมัครสมาชิกสำเร็จ", token }); // 201 Created
  } catch (error) {
    log("[Express] register Error : ", error);
    res.status(500).json({ msg: "สมัครสมาชิกไม่สำเร็จ" }); // 500 Internal Server Error
  } finally {
    await prisma.$disconnect();
  }
}