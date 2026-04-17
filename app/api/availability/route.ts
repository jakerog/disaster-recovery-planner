import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (Array.isArray(body)) {
    const results = await Promise.all(
      body.map(item => {
        const { resourceId, phaseId, stageId, exerciseId, available, notes } = item;
        return prisma.availability.upsert({
          where: { resourceId_phaseId_stageId: { resourceId, phaseId, stageId: stageId || null } },
          update: { available, notes },
          create: {
            resource: { connect: { id: resourceId } },
            phase: { connect: { id: phaseId } },
            stage: stageId ? { connect: { id: stageId } } : undefined,
            exercise: { connect: { id: exerciseId } },
            available,
            notes
          },
        });
      })
    );
    return NextResponse.json(results);
  }

  const { resourceId, phaseId, stageId, exerciseId, available, notes } = body;

  const availability = await prisma.availability.upsert({
    where: { resourceId_phaseId_stageId: { resourceId, phaseId, stageId: stageId || null } },
    update: { available, notes },
    create: {
      resource: { connect: { id: resourceId } },
      phase: { connect: { id: phaseId } },
      stage: stageId ? { connect: { id: stageId } } : undefined,
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
