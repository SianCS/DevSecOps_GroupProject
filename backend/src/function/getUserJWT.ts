// backend/src/function/getUserJWT.ts

import { decodeJWT } from "../plugin/JWT";
import { Request } from "express";
import JWTUserData from "../interfaces/JWTUserData";

export default async function getUserJWT(
  req: Request
): Promise<JWTUserData | null> {
  try {
    const authHeader = req.headers.authorization;

    // ตรวจสอบว่ามี Header และอยู่ในรูปแบบ Bearer token หรือไม่
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    // --- แก้ไขตรงนี้ ---
    // ตัดคำว่า "Bearer " ออกไป ให้เหลือแต่ตัว Token
    const token = authHeader.split(" ")[1];
    // -------------------

    if (!token) {
      return null;
    }

    const decodedData = (await decodeJWT(token)) as JWTUserData;
    if (!decodedData) {
      return null;
    }

    const { id, username, email, role } = decodedData;

    return { id, username, email, role };
  } catch (error) {
    console.log(error);
    return null;
  }
}