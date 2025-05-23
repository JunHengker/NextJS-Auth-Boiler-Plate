import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      image?: string;
      isEmailVerified?: boolean;
      isPasswordSet?: boolean;
      isLinked?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    image?: string;
    isEmailVerified?: boolean;
    isPasswordSet?: boolean;
    isLinked?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    role?: string;
    image?: string;
    isEmailVerified?: boolean;
    isPasswordSet?: boolean;
    isLinked?: string | null;
  }
}
