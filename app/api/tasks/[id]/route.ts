import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const auth = req.headers.get("authorization");
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    const { userId }: any = jwt.verify(token, process.env.JWT_SECRET!);

    const { status } = await req.json();

    if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status))
      return NextResponse.json(
        {
          error: "Invalid status",
          validStatuses: ["PENDING", "IN_PROGRESS", "COMPLETED"],
        },
        { status: 400 }
      );

    // ensure the task belongs to this user
    const task = await prisma.task.findUnique({ where: { id: id } });
    if (!task || task.userId !== userId)
      return NextResponse.json(
        { error: "Task not found or forbidden" },
        { status: 404 }
      );

    const updated = await prisma.task.update({
      where: { id: id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = req.headers.get("authorization");
    const token = auth?.split(" ")[1];
    const { userId }: any = jwt.verify(token!, process.env.JWT_SECRET!);

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId)
      return NextResponse.json(
        { error: "Not found or forbidden" },
        { status: 404 }
      );

    await prisma.task.delete({ where: { id } });
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
