import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { query, getPoolStatus } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

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
        console.log('Pool status:', status);

        console.log('Authorization successful');
        return {
          id: user[0].ID,
          email: user[0].Username,
          company: user[0].Company,
          permission: user[0].Permission,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.company = user.company;
        token.permission = user.permission;
      }
      // Sign the token
      const encodedToken = jwt.sign(token, process.env.NEXTAUTH_SECRET);
      token.accessToken = encodedToken;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.company = token.company;
      session.user.permission = token.permission;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
