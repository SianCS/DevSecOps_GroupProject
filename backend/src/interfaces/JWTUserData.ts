// backend/src/interfaces/JWTUserData.ts

import { Role } from "@prisma/client"; // 1. Import Role enum จาก prisma

export default interface JWTUserData {
  id: string;       // 2. เปลี่ยน user_id เป็น id
  username: string;
  email: string;
  role: Role;       // 3. เพิ่ม role เข้าไป
}