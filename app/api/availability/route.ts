import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { resourceId, phaseId, exerciseId, available, notes } = body;

  const availability = await prisma.availability.upsert({
    where: { resourceId_phaseId: { resourceId, phaseId } },
    update: { available, notes },
    create: {
      resource: { connect: { id: resourceId } },
      phase: { connect: { id: phaseId } },
      exercise: { connect: { id: exerciseId } },
      available,
      notes
    },
  });

  return NextResponse.json(availability);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exerciseId = searchParams.get("exerciseId");
  const availabilities = await prisma.availability.findMany({
    where: { exerciseId: exerciseId || undefined },
    include: { resource: true, phase: true }
  });
  return NextResponse.json(availabilities);
}
