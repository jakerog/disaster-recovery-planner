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

// Simulated background process endpoint to "dispatch" pending emails
export async function PATCH() {
  const now = new Date();

  // Find all pending schedules that should have been sent by now
  const pending = await prisma.emailSchedule.findMany({
    where: {
      status: "Pending",
      scheduledAt: { lte: now }
    }
  });

  if (pending.length === 0) {
    return NextResponse.json({ message: "No pending transmissions found." });
  }

  // Update status to "Sent"
  await prisma.emailSchedule.updateMany({
    where: { id: { in: pending.map(p => p.id) } },
    data: { status: "Sent" }
  });

  return NextResponse.json({
    message: "Transmissions dispatched successfully.",
    count: pending.length,
    ids: pending.map(p => p.id)
  });
}
