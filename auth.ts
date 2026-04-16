import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const email = (credentials.email as string).toLowerCase().trim();
          const password = credentials.password as string;

          const resource = await prisma.resource.findUnique({
            where: { email },
          });

          if (!resource) {
            console.warn(`Auth: Identity [${email}] not found.`);
            return null;
          }

          if (!resource.password) {
            console.warn(`Auth: Identity [${email}] has no credential assigned.`);
            return null;
          }

          const isValid = await bcrypt.compare(password, resource.password);

          if (!isValid) {
            console.warn(`Auth: Credential mismatch for [${email}].`);
            return null;
          }

          return {
            id: resource.id,
            email: resource.email,
            name: resource.fullName,
            role: resource.role,
          };
        } catch (error: any) {
          console.error("Auth System Error:", error.message);
          return null;
        }
      },
    }),
  ],
});
