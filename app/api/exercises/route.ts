import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const exercises = await prisma.exercise.findMany({
    include: { owners: true, resources: true, vendors: true, teams: true },
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
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
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
