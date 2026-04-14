import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const vendors = await prisma.vendor.findMany({
    include: { teams: true, resources: true },
  });
  return NextResponse.json(vendors);
}

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const vendor = await prisma.vendor.create({ data: body });
  return NextResponse.json(vendor);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const vendor = await prisma.vendor.update({ where: { id }, data });
  return NextResponse.json(vendor);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "Admin") return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });
  await prisma.vendor.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
