import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { differenceInMinutes } from "date-fns";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exerciseId = searchParams.get("exerciseId");
  const tasks = await prisma.task.findMany({
    where: { exerciseId: exerciseId || undefined },
    include: { resources: true, team: true, stage: true },
    orderBy: { taskId: "asc" },
  });
  return NextResponse.json(tasks);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, resourceIds, startDate, endDate, ...data } = body;

  const currentTask = await prisma.task.findUnique({
    where: { id },
    include: { resources: true }
  });

  if (!currentTask) return new Response("Task not found", { status: 404 });

  // RBAC: Non-admin users can only edit their own tasks
  const isOwner = currentTask.resources.some(r => r.email === session.user?.email);
  const userRole = (session.user as any)?.role;
  const isAdmin = userRole === "Admin" || userRole === "Moderator";

  if (!isAdmin && !isOwner) {
    return new Response("Permission Denied: You can only edit tasks assigned to you.", { status: 403 });
  }

  let actualDuration = currentTask.actualDuration;
  let varianceDuration = currentTask.varianceDuration;

  const start = startDate ? new Date(startDate) : (currentTask.startDate || null);
  const end = endDate ? new Date(endDate) : (currentTask.endDate || null);

  if (start && end) {
    actualDuration = Math.abs(differenceInMinutes(new Date(end), new Date(start)));
    const est = data.estimatedTime || currentTask.estimatedTime;
    if (est) varianceDuration = actualDuration - est;
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...data,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      actualDuration,
      varianceDuration,
      resources: resourceIds ? { set: resourceIds.map((rid: string) => ({ id: rid })) } : undefined
    },
  });
  return NextResponse.json(task);
}
