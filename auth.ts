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
          const resource = await prisma.resource.findUnique({
            where: { email: (credentials.email as string).toLowerCase() },
          });

          if (!resource || !resource.password) {
            console.warn(`Auth failure: Target identity not found or restricted. [${credentials.email}]`);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            resource.password
          );

          if (!isValid) {
            console.warn(`Auth failure: Cryptographic validation failed. [${credentials.email}]`);
            return null;
          }

          return {
            id: resource.id,
            email: resource.email,
            name: resource.fullName,
            role: resource.role,
          };
        } catch (error) {
          console.error("Auth protocol violation:", error);
          return null;
        }
      },
    }),
  ],
});
