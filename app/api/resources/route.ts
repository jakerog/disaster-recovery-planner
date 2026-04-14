import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const resources = await prisma.resource.findMany({
    include: { team: true, vendor: true, exercise: true },
  });
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const resource = await prisma.resource.create({ data: body });
  return NextResponse.json(resource);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const resource = await prisma.resource.update({ where: { id }, data });
  return NextResponse.json(resource);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });
  await prisma.resource.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
