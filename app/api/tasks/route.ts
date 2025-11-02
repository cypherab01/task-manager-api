import prisma from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    const token = auth?.split(" ")[1];
    const { userId }: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const tasks = await prisma.task.findMany({ where: { userId } });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    const token = auth?.split(" ")[1];
    const { userId }: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const { title, description } = await req.json();

    await prisma.task.create({
      data: { title, description, status: TaskStatus.PENDING, userId },
    });

    return NextResponse.json(
      {
        message: "Task created successfully",
        task: { title, description, status: TaskStatus.PENDING },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
