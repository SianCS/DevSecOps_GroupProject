import { decodeJWT } from "../plugin/JWT";
import { Request } from "express";

export default async function getUserJWT(req: Request) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return null;
    }
    const useJWTData = await await decodeJWT(token);
    const { user_id, username, email } = useJWTData;
    return { user_id, username, email };
  } catch (error) {
    console.log(error);
  }
}
