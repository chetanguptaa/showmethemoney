import { User, getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const session = async ({ session, token }: any) => {
  session.user.id = token.id;
  return session;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        throw new Error("No profile");
      }
      await prisma.user.upsert({
        where: {
          email: profile.email,
        },
        create: {
          email: profile.email,
          name: profile.name,
          avatar: (profile as any).picture,
        },
        update: {
          name: profile.name,
          avatar: (profile as any).picture,
        },
      });
      return true;
    },
    session,
    async jwt({ token, profile }) {
      if (profile) {
        const user = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });
        if (!user) {
          throw new Error("No user found");
        }
        token.id = user.id;
      }
      return token;
    },
  },
};

export const getUserSession = async (): Promise<User> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });
  if (!authUserSession) throw new Error("unauthorized");
  return authUserSession.user;
};
