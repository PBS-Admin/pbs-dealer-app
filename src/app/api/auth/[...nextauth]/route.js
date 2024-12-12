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

        return {
          id: user[0].ID,
          email: user[0].Username,
          fullName: user[0].FullName,
          company: user[0].Company,
          permission: user[0].Permission,
          estimator: user[0].Estimator,
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
        token.estimator = user.estimator;
      }

      if (trigger === 'update' && session?.user?.company) {
        token.company = session.user.company;
      }

      return token;
    },
    async session({ session, token }) {
      if (!token) {
        return null;
      }

      session.user = {
        id: token.id,
        email: token.email,
        fullName: token.fullName,
        company: token.company,
        permission: token.permission,
        estimator: token.estimator,
      };

      return session;
    },
    async signOut({ token, session }) {
      try {
        // Clear any custom session data
        token = {};
        session = null;

        await query('UPDATE Dealer_Users SET LastLogout = NOW() WHERE ID = ?', [
          token?.id,
        ]).catch(console.error);

        return true;
      } catch (error) {
        console.error('SignOut error:', error);
        return false;
      }
    },
  },
  events: {
    async signOut(message) {
      try {
        console.log('User signed out:', message);
      } catch (error) {
        console.error('SignOut event error:', error);
      }
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
