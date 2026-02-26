import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient),
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            memberships: {
              where: { organization: { deletedAt: null } },
              include: { organization: true },
              take: 1,
              orderBy: { createdAt: "asc" },
            },
          },
        });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        const membership = user.memberships[0];
        if (!membership) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          organizationId: membership.organizationId,
          role: membership.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.organizationId = (user as { organizationId?: string }).organizationId;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { organizationId?: string }).organizationId = token.organizationId as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
