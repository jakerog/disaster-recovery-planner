import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const teams = await prisma.team.findMany({
    include: { vendor: true, resources: true },
  });
  return NextResponse.json(teams);
}

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const team = await prisma.team.create({ data: body });
  return NextResponse.json(team);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const team = await prisma.team.update({ where: { id }, data });
  return NextResponse.json(team);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });
  await prisma.team.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
