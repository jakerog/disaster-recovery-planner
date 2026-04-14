import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const phase = await prisma.phase.create({ data: body });
  return NextResponse.json(phase);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });
  await prisma.phase.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
