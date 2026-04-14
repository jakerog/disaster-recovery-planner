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

  let actualDuration = null;
  let varianceDuration = null;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    actualDuration = Math.abs(differenceInMinutes(end, start));
    if (data.estimatedTime) varianceDuration = actualDuration - data.estimatedTime;
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
