import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import type { Locale } from "@/i18n/config";

type Role = "BUYER" | "SUPPLIER" | "ADMIN";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireUser(locale: Locale = "fr") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/auth/connexion`);
  }

  return user;
}

export async function requireRole(roles: Role[], locale: Locale = "fr") {
  const user = await requireUser(locale);

  if (!roles.includes(user.role)) {
    redirect(`/${locale}`);
  }

  return user;
}

export function canManageProduct(userId: string, ownerId: string, role: Role) {
  return role === "ADMIN" || userId === ownerId;
}
