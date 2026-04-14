import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { differenceInMinutes } from "date-fns";

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
  const body = await req.json();
  const { id, ...data } = body;
  const startDate = data.startDate ? new Date(data.startDate) : null;
  const endDate = data.endDate ? new Date(data.endDate) : null;
  let actualDuration = null;
  let varianceDuration = null;
  if (startDate && endDate) {
    actualDuration = differenceInMinutes(endDate, startDate);
    if (data.estimatedTime) varianceDuration = actualDuration - data.estimatedTime;
  }
  const task = await prisma.task.update({
    where: { id },
    data: { ...data, startDate, endDate, actualDuration, varianceDuration },
  });
  return NextResponse.json(task);
}
