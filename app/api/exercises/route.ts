import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const exercises = await prisma.exercise.findMany({
    include: {
      owners: true,
      resources: true,
      vendors: true,
      teams: true,
      phases: {
        include: {
          events: {
            include: {
              stages: {
                include: { tasks: true }
              }
            }
          }
        }
      }
    },
  });
  return NextResponse.json(exercises);
}

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const exercise = await prisma.exercise.create({ data: body });
  return NextResponse.json(exercise);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  // Logic: Success of Mock 1 and Mock 2 will determine if Mock 3 is needed.
  // We'll check if all tasks in Mock 1/2 phases are completed.
  const exerciseBefore = await prisma.exercise.findUnique({
    where: { id },
    include: { phases: { include: { events: { include: { stages: { include: { tasks: true } } } } } } }
  });

  if (exerciseBefore) {
    const mock12Phases = exerciseBefore.phases.filter(p => p.name.includes("Mock 1") || p.name.includes("Mock 2"));
    const allMock12Tasks = mock12Phases.flatMap(p => p.events.flatMap(e => e.stages.flatMap(s => s.tasks)));

    if (allMock12Tasks.length > 0) {
      const allSuccess = allMock12Tasks.every(t => t.status === "Completed");
      // If NOT all success, Mock 3 is needed
      data.mock3Required = !allSuccess;
    }
  }

  const exercise = await prisma.exercise.update({ where: { id }, data });
  return NextResponse.json(exercise);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });
  await prisma.exercise.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
