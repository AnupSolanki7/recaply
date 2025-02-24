import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        try {
          const response = await axios.post(
            "http://192.168.5.72:3000/api/user/login",
            {
              email: credentials.email,
              password: credentials.password,
              device_id: "test",
              device_type: "web",
            }
          );

          const user = response.data;
          // Ensure the response contains the expected user data
          if (user?.data?.id) {
            return {
              id: user.data.id, // Use actual user ID if available
              email: user.data.email,
              name: user.data.name,
              token: user.data.token, // Store token for later use
            };
          }

          return null; // Authentication failed
        } catch (error) {
          console.log("error", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt: async ({ token, user }: any) => {
      if ("type" in token && token.type === "error") {
        return null;
      }

      return { ...token, ...user };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session?.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user = token as any;

        return session;
      }
      return null;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
};
