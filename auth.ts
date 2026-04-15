import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const resource = await prisma.resource.findUnique({
          where: { email: credentials.email as string },
        });

        if (!resource || !resource.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          resource.password
        );

        if (!isValid) return null;

        return {
          id: resource.id,
          email: resource.email,
          name: resource.fullName,
          role: resource.role,
        };
      },
    }),
  ],
});
