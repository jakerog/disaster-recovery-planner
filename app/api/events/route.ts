import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const event = await prisma.event.create({ data: body });
  return NextResponse.json(event);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });
  await prisma.event.delete({ where: { id } });
  return new Response(null, { status: 204 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  const event = await prisma.event.update({
    where: { id },
    data
  });
  return NextResponse.json(event);
}
