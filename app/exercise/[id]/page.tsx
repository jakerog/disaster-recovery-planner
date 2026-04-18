import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import TacticalMonitorClient from "@/components/execution/TacticalMonitorClient";

export default async function ExerciseExecutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const [exercise, availabilities] = await Promise.all([
    prisma.exercise.findUnique({
      where: { id },
      include: {
        phases: {
          orderBy: { order: "asc" },
          include: {
            events: {
              include: {
                stages: {
                  include: {
                    tasks: {
                      orderBy: { taskId: "asc" },
                      include: { resources: true, team: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.availability.findMany({ where: { exerciseId: id } })
  ]);

  if (!exercise) notFound();

  return (
    <TacticalMonitorClient
      exercise={exercise}
      session={session}
      initialAvailabilities={availabilities}
    />
  );
}
