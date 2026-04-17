import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gerekli");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Kullanıcı bulunamadı");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Şifre hatalı");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          referralCode: user.referralCode,
          totalPoints: user.totalPoints,
          vipLevel: user.vipLevel,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.referralCode = user.referralCode;
        token.totalPoints = user.totalPoints;
        token.vipLevel = user.vipLevel;
      }
      
      // Her istekte veritabanından güncel değerleri al
      if (trigger === "update" || !user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isAdmin: true, totalPoints: true, vipLevel: true },
        });
        if (dbUser) {
          token.isAdmin = dbUser.isAdmin;
          token.totalPoints = dbUser.totalPoints;
          token.vipLevel = dbUser.vipLevel;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.referralCode = token.referralCode as string;
        session.user.totalPoints = token.totalPoints as number;
        session.user.vipLevel = token.vipLevel as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
