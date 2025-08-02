// backend/src/controller/auth/login.ts

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { log } from "console";

import { validateInput, ValidationSchema } from "../../plugin/validator";
import { encodeJWT } from "../../plugin/JWT";
import JWTUserData from "../../interfaces/JWTUserData";

export default async function login(req: Request, res: Response) {
  console.log(req.body);
  const prisma = new PrismaClient();
  try {
    const schema: ValidationSchema = {
      username: {
        type: "string",
        required: true,
        displayName: "ชื่อผู้ใช้งาน",
      },
      password: {
        type: "string",
        required: true,
        displayName: "รหัสผ่าน",
      },
    };

    const validate = validateInput(req.body, schema);
    if (!validate.success) {
      res.status(400).json({ msg: validate.errorMsg });
      return;
    }

    const { username, password } = validate.data;

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      res.status(404).json({ msg: "ไม่พบชื่อผู้ใช้งานนี้" });
      return;
    }

    const isCompare = await bcrypt.compare(password, user.password);
    if (!isCompare) {
      res.status(401).json({ msg: "รหัสผ่านไม่ถูกต้อง" });
      return;
    }

    const jwtEncodeData: JWTUserData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token: string | null = await encodeJWT(jwtEncodeData);

    res.status(200).json({ msg: "เข้าสู่ระบบสำเร็จ", token });
  } catch (error) {
    log("[Express] login Error : ", error);
    res.status(500).json({ msg: "เข้าสู่ระบบไม่สำเร็จ" });
  } finally {
    await prisma.$disconnect();
  }
}