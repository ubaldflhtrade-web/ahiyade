import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always"
});

const protectedRoutes = ["admin", "messagerie", "tableau-de-bord"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  const hasLocale = locales.includes(firstSegment as (typeof locales)[number]);

  if (!hasLocale && pathname !== "/admin") {
    return intlMiddleware(request);
  }

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL(`/${defaultLocale}/admin`, request.url));
  }

  const segments = pathname.split("/").filter(Boolean);
  const route = segments[1];

  if (route && protectedRoutes.includes(route)) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL(`/${segments[0]}/auth/connexion`, request.url));
    }

    if (route === "admin" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${segments[0]}`, request.url));
    }

    if (segments[2] === "fournisseur" && token.role !== "SUPPLIER") {
      return NextResponse.redirect(new URL(`/${segments[0]}/tableau-de-bord/acheteur`, request.url));
    }

    if (segments[2] === "acheteur" && token.role !== "BUYER") {
      return NextResponse.redirect(new URL(`/${segments[0]}/tableau-de-bord/fournisseur`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
