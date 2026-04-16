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

export async function POST(req: Request) {
  const body = await req.json();
  const { resourceIds, ...data } = body;

  const task = await prisma.task.create({
    data: {
      ...data,
      resources: resourceIds ? { connect: resourceIds.map((id: string) => ({ id })) } : undefined
    }
  });
  return NextResponse.json(task);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });
  await prisma.task.delete({ where: { id } });
  return new Response(null, { status: 204 });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const {
    id,
    resourceIds,
    startDate,
    endDate,
    startTime,
    endTime,
    estimatedTime,
    evidence,
    taskId,
    workflow,
    resourceAllocation,
    status,
    notes,
    stageId,
    teamId
  } = body;

  const currentTask = await prisma.task.findUnique({
    where: { id },
    include: { resources: true, exercise: { include: { phases: { include: { events: { include: { stages: { include: { tasks: true } } } } } } } } }
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
    const est = estimatedTime || currentTask.estimatedTime;
    if (est) varianceDuration = actualDuration - est;
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      taskId,
      workflow,
      resourceAllocation,
      status,
      notes,
      stageId,
      teamId: teamId || null,
      evidence,
      estimatedTime,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      actualDuration,
      varianceDuration,
      resources: resourceIds ? { set: resourceIds.map((rid: string) => ({ id: rid })) } : undefined
    },
  });

  // Re-evaluate Mock 3 requirement if a task in Mock 1/2 changes
  const exercise = currentTask.exercise;
  const mock12Phases = exercise.phases.filter(p => p.name.includes("Mock 1") || p.name.includes("Mock 2"));
  const allMock12Tasks = mock12Phases.flatMap(p => p.events.flatMap(e => e.stages.flatMap(s => s.tasks)));

  // A simple heuristic: if any task in Mock 1/2 fails, Mock 3 is definitely required.
  // If all are completed successfully, it might not be.
  if (allMock12Tasks.length > 0) {
    const hasFailures = allMock12Tasks.some(t => t.id === id ? updatedTask.status === "Failed" : t.status === "Failed");
    const anyIncomplete = allMock12Tasks.some(t => t.id === id ? updatedTask.status !== "Completed" : t.status !== "Completed");

    await prisma.exercise.update({
      where: { id: exercise.id },
      data: { mock3Required: hasFailures || anyIncomplete }
    });
  }

  return NextResponse.json(updatedTask);
}
