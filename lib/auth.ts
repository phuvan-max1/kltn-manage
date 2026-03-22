import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { getUserByEmail, verifyUserCredentials } from '@/lib/sheets'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Identifier', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const identifier = String(credentials?.identifier || '')
          const password = String(credentials?.password || '')
          const { user, reason } = await verifyUserCredentials(identifier, password)

          if (!user) {
            console.warn(`[auth] Credentials login failed (${reason}) for identifier: ${identifier}`)
            return null
          }

          return {
            id: user.email,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('[auth] Credentials authorize failed:', error)
          return null
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'credentials') {
          return true
        }

        if (!user.email) {
          return '/login?error=unauthorized&reason=missing-email'
        }

        const dbUser = await getUserByEmail(user.email)
        if (!dbUser) {
          console.warn(`[auth] User not found or invalid sheet format: ${user.email}`)
          return '/login?error=unauthorized&reason=not-in-users-sheet'
        }

        if (!dbUser.active) {
          console.warn(`[auth] User inactive in sheet: ${user.email}`)
          return '/login?error=unauthorized&reason=inactive'
        }

        return true
      } catch (error) {
        console.error('[auth] Sign-in lookup failed:', error)
        return '/login?error=unauthorized&reason=sheets-unreachable'
      }
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await getUserByEmail(user.email)
        if (dbUser) {
          token.role = dbUser.role
          token.mssv_msgv = dbUser.mssv_msgv
          token.khoa = dbUser.khoa
          token.dbName = dbUser.name
        }
      }

      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        email: (session.user?.email || token.email || '') as string,
        name: (token.dbName || session.user?.name || '') as string,
        image: (session.user?.image || undefined) as string | undefined,
        role: token.role!,
        mssv_msgv: (token.mssv_msgv || '') as string,
        khoa: (token.khoa || '') as string,
      }

      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
