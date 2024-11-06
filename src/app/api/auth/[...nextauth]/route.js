import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { query, getPoolStatus } from '../../../../lib/db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null;
        }

        const user = await query(
          'SELECT * FROM Dealer_Users WHERE Username = ?',
          [credentials.email]
        );

        if (user.length === 0) {
          console.log('No user found with this email');
          return null;
        }

        let isPasswordCorrect;
        try {
          isPasswordCorrect = await compare(
            credentials.password,
            user[0].Password
          );
        } catch (error) {
          console.error('Error during password comparison:', error);
          return null;
        }

        if (!isPasswordCorrect) {
          return null;
        }

        const status = await getPoolStatus();

        return {
          id: user[0].ID,
          email: user[0].Username,
          fullName: user[0].FullName,
          company: user[0].Company,
          permission: user[0].Permission,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.company = user.company;
        token.permission = user.permission;
      }

      if (trigger === 'update' && session?.user?.company) {
        token.company = session.user.company;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        fullName: token.fullName,
        company: token.company,
        permission: token.permission,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
