import NextAuth from "next-auth";
import { authOptions } from "../options";

export async function GET(req: any, res: any) {
  const url = new URL(req.url!);
  const isDefaultSigninPage = url.pathname === "/api/auth/signin";

  if (isDefaultSigninPage) {
    authOptions.providers.pop();
  }

  return await NextAuth(req, res, authOptions);
}

export async function POST(req: any, res: any) {
  return await NextAuth(req, res, authOptions);
}
