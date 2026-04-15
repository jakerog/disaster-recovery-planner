import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { templateId, listIds, scheduledAt } = body;

  const schedule = await prisma.emailSchedule.create({
    data: {
      templateId,
      lists: {
        connect: Array.isArray(listIds) ? listIds.map((id: string) => ({ id })) : [{ id: body.listId }]
      },
      scheduledAt: new Date(scheduledAt),
      status: "Pending",
    },
  });

  return NextResponse.json(schedule);
}

export async function GET() {
  const schedules = await prisma.emailSchedule.findMany({
    orderBy: { scheduledAt: "desc" },
    include: { template: true, lists: true }
  });
  return NextResponse.json(schedules);
}
