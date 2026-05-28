"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Locale } from "@/i18n/config";

export function LoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    });

    setIsLoading(false);
    if (result?.error) {
      setError("Identifiants invalides ou compte suspendu.");
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? `/${locale}/catalogue`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-ahiyade-sand/70 bg-white p-6 shadow-soft">
      <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
        Email
        <input name="email" type="email" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
        Mot de passe
        <input name="password" type="password" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
      </label>
      {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button disabled={isLoading} className="focus-ring h-12 rounded-md bg-ahiyade-cocoa font-bold text-white disabled:opacity-60" type="submit">
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
      <div className="flex flex-wrap justify-between gap-3 text-sm font-semibold text-ahiyade-clay">
        <Link href={`/${locale}/auth/mot-de-passe-oublie`}>Mot de passe oublie</Link>
        <Link href={`/${locale}/auth/inscription`}>Creer un compte</Link>
      </div>
    </form>
  );
}
