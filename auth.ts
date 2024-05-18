import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from "./lib/db"
import { getUserById } from "./repository/user-repository"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./repository/two-factor-token-confirmation"

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: { strategy: "jwt" },
  //ajoutons cette event pour que si un user s'inscrive avec les providers ,
  // on pet à jour automatiquement le emailVerification champ
  events: ({
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  }),
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;
      const existingUser = await getUserById(user?.id as string)
      console.log({ user, account })
      if (!existingUser?.emailVerified) {
        return false;
      }
      // add 2FA check
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactorConfirmation) {
          return false;
        }

        //Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        })
      }
      return true
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      // console.log({token})
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      token.role = existingUser.role;

      return token
    }
  }
})