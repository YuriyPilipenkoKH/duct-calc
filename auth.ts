import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github"
import { prisma } from "./prisma";



export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Connect to the database
        await prisma.$connect();
        const email = user?.email ?? undefined;

        if (!email) {
          console.error("User email is missing.");
          return false; // Deny sign-in if email is not valid
        }
        
        // Check if user already exists in the database
        let existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          // If user does not exist, create a new user
          existingUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || null,
              image: user.image || null,
            },
          });
        }

        // Skip account creation if the account object is missing or has no provider info
        if (!account || !account.provider || !account.providerAccountId) {
          return true; // Nothing to create; proceed
        }
        if(account.provider === 'credentials'){   
          return true; // Nothing to create; proceed
          }
  
          // Check if the account already exists
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          // If the account does not exist, create it
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              id_token: account.id_token,
              scope: account.scope,
              session_state: account.session_state?.toString() ?? null, // Convert to string or set to null
            },
          });
        }

        return true; // Allow sign-in
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Deny sign-in on error
      }
    },
    async session({ session, token }) {
      // Optionally include additional user data in the session
      if (session.user) {
        session.user.id = token.id as string;
      }
      if (token?.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user ID to the JWT token
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET,
 })