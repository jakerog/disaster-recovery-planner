import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Identity required." }, { status: 400 });

    const targetEmail = email.toLowerCase().trim();

    const resource = await prisma.resource.findUnique({
      where: { email: targetEmail }
    });

    if (!resource) {
      console.warn(`Reset attempt for unrecognized identity: ${targetEmail}`);
      return NextResponse.json({ error: "Identity not recognized in Sentinel database." }, { status: 404 });
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    try {
      await prisma.passwordResetToken.create({
        data: {
          email: targetEmail,
          token,
          expires
        }
      });
    } catch (dbError) {
      console.error("Failed to persist reset token. Ensure schema is updated.", dbError);
      return NextResponse.json({ error: "Security subsystem fault. Please contact administrator." }, { status: 500 });
    }

    // In a real app, send an email. Here we'll return the link for simulation.
    const resetLink = `/reset-password?token=${token}&email=${targetEmail}`;

    return NextResponse.json({
      message: "Password reset sequence initiated.",
      resetLink
    });
  } catch (error) {
    console.error("Critical fault in forgot-password protocol:", error);
    return NextResponse.json({ error: "Transmission error during reset sequence." }, { status: 500 });
  }
}
