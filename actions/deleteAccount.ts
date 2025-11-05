"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function deleteAccount(
  _prevState: { error?: string | null; message?: string | null } | undefined,
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { error: "User not found" };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { error: "Invalid password" };
    }

    await prisma.user.delete({ where: { id: user.id } });

    return { message: "Account deleted successfully" };
  } catch (error) {
    console.error("Delete account error:", error);
    return { error: "Internal Server Error" };
  }
}
