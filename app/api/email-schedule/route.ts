import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { templateId, listId, scheduledAt } = body;

  const schedule = await prisma.emailSchedule.create({
    data: {
      templateId,
      listId,
      scheduledAt: new Date(scheduledAt),
      status: "Pending",
    },
  });

  // Simulate background processing
  console.log(`[EMAIL SIMULATION] Scheduled email with template ${templateId} to list ${listId} at ${scheduledAt}`);

  return NextResponse.json(schedule);
}

export async function GET() {
  const schedules = await prisma.emailSchedule.findMany({
    orderBy: { scheduledAt: "desc" }
  });
  return NextResponse.json(schedules);
}
