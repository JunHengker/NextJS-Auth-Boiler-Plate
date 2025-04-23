import db from "./lib/db";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Auth0 from "next-auth/providers/auth0";
import Google from "next-auth/providers/google";

import bcrypt from "bcryptjs";

import { userLoginSchema, userWithoutPass } from "./models/user.model";
import { accountValidationSchema } from "./models/account.model";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "prisma-credentials",
      name: "Prisma Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials) {
            console.warn("No credentials provided");
            return null;
          }

          // Validate credentials using Zod schema
          const parsedCredentials = userLoginSchema.safeParse(credentials);
          if (!parsedCredentials.success) {
            console.warn("Invalid credentials format", parsedCredentials.error);
            return null;
          }

          const { email, password } = parsedCredentials.data;

          const user = await db.user.findFirst({
            where: { email },
          });

          if (!user) {
            console.warn("User not found:", email);
            return null;
          }

          // TODO: Hash password and compare with stored hash
          const isPasswordValid =
            user.password && (await bcrypt.compare(password, user.password));

          if (!isPasswordValid) {
            console.warn("Invalid password");
            return null;
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.profile_image || undefined,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),

    Auth0({
      clientId: process.env.AUTH_AUTH0_ID,
      clientSecret: process.env.AUTH_AUTH0_SECRET,
      issuer: process.env.AUTH_AUTH0_ISSUER,
    }),
    Google({
      clientId: process.env.AUTH_AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    // use this if you dont want to track user in db
    // async signIn(userDetail) {
    //   if (Object.keys(userDetail).length === 0) {
    //     return false;
    //   }
    //   return true;
    // },

    async signIn({ user, account }) {
      if (!user || Object.keys(user).length === 0) {
        return false;
      }

      if (account && account.provider === "google") {
        // Ensure user.email is defined before using it
        if (!user.email) return false;

        // Check if the user already exists in the database
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // If the user doesn't exist, create a new user in the database
          const newUser = {
            name: user.name ?? "",
            profile_image: user.image ?? "",
            email: user.email,
            role: "USER",
          };

          // Validate newUser using Zod schema
          const ValidateUser = userWithoutPass.safeParse(newUser);
          if (!ValidateUser.success) {
            console.warn("Invalid user data format", ValidateUser.error);
            return false;
          }

          //TODO: send email verification

          await db.user.create({
            data: {
              name: newUser.name,
              profile_image: newUser.profile_image,
              email: newUser.email,
              isEmailVerified: true,
              // even with oauth, still need to verify email trough email confirmation
              // for now isEmailVerified is set to true
              role: "USER",
            },
          });

          // get the newly created user
          const createdUser = await db.user.findUnique({
            where: { email: user.email },
          });
          if (!createdUser) {
            console.warn("New user not found after creation:", user.email);
            return false;
          }

          // Create a new account in the database to link the user to the provider
          const ValidateAccount = accountValidationSchema.safeParse(account);
          if (!ValidateAccount.success) {
            console.warn("Invalid account data format", ValidateAccount.error);
            return false;
          }

          await db.account.create({
            data: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              userId: createdUser.id,
              access_token: account.access_token,
              id_token: account.id_token,
              scope: account.scope,
              token_type: account.token_type,
              expires_at: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
            },
          });
        } else {
          // If the user already exists, update their account information
          await db.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              access_token: account.access_token,
              id_token: account.id_token,
              scope: account.scope,
              token_type: account.token_type,
              expires_at: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
            },
            create: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              userId: existingUser.id,
              access_token: account.access_token,
              id_token: account.id_token,
              scope: account.scope,
              token_type: account.token_type,
              expires_at: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
            },
          });

          await db.user.update({
            where: { email: user.email },
            data: {
              profile_image: user.image,
              isEmailVerified: true,
              // even with oauth, still need to verify email trough email confirmation
              // for now isEmailVerified is set to true
            },
          });
        }
      }

      return true;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/protected`;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.name = token.name;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.isPasswordSet = token.isPasswordSet;
        session.user.isLinked = token.isLinked;
      }
      return session;
    },
    async jwt({ token }) {
      if (token?.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            email: true,
            role: true,
            profile_image: true,
            name: true,
            isEmailVerified: true,
            isPasswordSet: true,
            Account: {
              select: {
                provider: true,
              },
            },
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.role = dbUser.role;
          token.image = dbUser.profile_image || undefined;
          token.name = dbUser.name;
          token.isEmailVerified = dbUser.isEmailVerified || false;
          token.isPasswordSet = dbUser.isPasswordSet ? true : false;
          token.isLinked =
            dbUser.Account?.length > 0 ? dbUser.Account[0].provider : null;
        }
      }

      return token;
    },
  },
});
