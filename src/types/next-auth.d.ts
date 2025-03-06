// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

// This declaration extends the NextAuth types
declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
} 