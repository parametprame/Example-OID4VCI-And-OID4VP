import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: { label: "Message", type: "text", placeholder: "0x0" },
        signature: { label: "Signature", type: "text", placeholder: "0x0" },
      },
      async authorize(credentials) {
        try {
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_HOLDER_URL}/signIn`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: credentials?.message,
                signature: credentials?.signature,
                domain: nextAuthUrl.host,
              }),
            }
          );

          const data = await res.json();

          if (res.ok && data.address) {
            return { id: data.address };
          }

          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.address = token.sub;
      session.user.name = token.sub;
      session.user.image = "https://www.fillmurray.com/128/128";
      return session;
    },
  },
};
