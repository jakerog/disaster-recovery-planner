import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const templates = await prisma.emailTemplate.findMany();
  return NextResponse.json(templates);
}

export async function POST(req: Request) {
  const body = await req.json();
  const template = await prisma.emailTemplate.create({
    data: { name: body.name, subject: body.subject, body: body.body },
  });
  return NextResponse.json(template);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });
  await prisma.emailTemplate.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
