import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Role → home route mapping
// Used both by the NextAuth redirect callback and client-side helpers.
// Export so login/join pages can import the same logic.
// ---------------------------------------------------------------------------

export function roleHome(role: string | undefined | null): string {
  switch (role) {
    case "ADMIN":
      return "/admin/submissions";
    case "REVIEWER":
      return "/admin/submissions";
    case "MENTOR":
      return "/researcher";
    case "STUDENT":
    default:
      return "/researcher";
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user?.hashedPassword) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // ── Persist id + role into the JWT ──
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },

    // ── Expose id + role on the session object ──
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as { id?: string; role?: string };
        u.id = token.id as string;
        u.role = token.role as string;
      }
      return session;
    },

    // ── Role-based redirect after sign-in ──
    // If the middleware/callbackUrl already specifies a destination (e.g. the
    // user was trying to reach a protected page), honour that. Otherwise send
    // each role to their natural home.
    async redirect({ url, baseUrl }) {
      // Relative URL provided by middleware callbackUrl — honour it
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Absolute URL on the same origin — honour it
      if (url.startsWith(baseUrl)) return url;
      // Fallback: NextAuth default behaviour returns baseUrl; we want the
      // role-specific home. The role isn't available here, so we rely on the
      // client-side redirect in the login/join pages for first-time routing.
      // For NextAuth-initiated redirects (e.g. OAuth), fall back to baseUrl.
      return baseUrl;
    },
  },
};
