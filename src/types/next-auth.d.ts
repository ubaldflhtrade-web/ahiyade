import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "BUYER" | "SUPPLIER" | "ADMIN";
      plan: "FREE" | "PREMIUM";
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: "BUYER" | "SUPPLIER" | "ADMIN";
    plan: "FREE" | "PREMIUM";
    isVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "BUYER" | "SUPPLIER" | "ADMIN";
    plan: "FREE" | "PREMIUM";
    isVerified: boolean;
  }
}
