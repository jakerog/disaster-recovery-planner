import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const resource = await prisma.resource.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!resource) {
      // Security best practice: don't reveal if user exists, but for this app we'll be helpful
      return NextResponse.json({ error: "Identity not recognized in Sentinel database." }, { status: 404 });
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expires
      }
    });

    // In a real app, send an email. Here we'll return the link for simulation.
    const resetLink = `/reset-password?token=${token}&email=${email}`;

    return NextResponse.json({
      message: "Password reset sequence initiated.",
      resetLink // Normally hidden
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Transmission error during reset sequence." }, { status: 500 });
  }
}
