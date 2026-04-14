import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const lists = await prisma.emailList.findMany();
  return NextResponse.json(lists);
}

export async function POST(req: Request) {
  const body = await req.json();
  const list = await prisma.emailList.create({
    data: { name: body.name, emails: body.emails },
  });
  return NextResponse.json(list);
}
