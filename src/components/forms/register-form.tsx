"use client";

import { Building2, ShoppingBag } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import { departments } from "@/lib/constants";

export function RegisterForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = useMemo(() => (searchParams.get("role") === "supplier" ? "SUPPLIER" : "BUYER"), [searchParams]);
  const [role, setRole] = useState<"BUYER" | "SUPPLIER">(initialRole);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, role })
    });

    if (!response.ok) {
      setMessage("Impossible de creer le compte. Verifiez les informations.");
      setIsLoading(false);
      return;
    }

    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false
    });

    router.push(role === "SUPPLIER" ? `/${locale}/tableau-de-bord/fournisseur` : `/${locale}/tableau-de-bord/acheteur`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-ahiyade-sand/70 bg-white p-6 shadow-soft">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setRole("BUYER")}
          className={`focus-ring rounded-lg border p-4 text-left ${role === "BUYER" ? "border-ahiyade-palm bg-ahiyade-palm/10" : "border-ahiyade-sand"}`}
        >
          <ShoppingBag className="h-6 w-6 text-ahiyade-palm" />
          <span className="mt-3 block font-black text-ahiyade-cocoa">Acheteur</span>
          <span className="text-sm text-ahiyade-cocoa/70">Rechercher et demander des devis.</span>
        </button>
        <button
          type="button"
          onClick={() => setRole("SUPPLIER")}
          className={`focus-ring rounded-lg border p-4 text-left ${role === "SUPPLIER" ? "border-ahiyade-palm bg-ahiyade-palm/10" : "border-ahiyade-sand"}`}
        >
          <Building2 className="h-6 w-6 text-ahiyade-palm" />
          <span className="mt-3 block font-black text-ahiyade-cocoa">Fournisseur</span>
          <span className="text-sm text-ahiyade-cocoa/70">Publier vos produits et recevoir des contacts.</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
          Nom complet
          <input name="name" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
          Email
          <input name="email" type="email" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
          Mot de passe
          <input name="password" type="password" minLength={8} required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
          Telephone
          <input name="phone" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" placeholder="+229..." />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
          Entreprise
          <input name="companyName" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
          Departement
          <select name="department" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3">
            {departments.map((department) => (
              <option key={department.value} value={department.value}>
                {department.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
        Description
        <textarea name="description" rows={4} className="focus-ring rounded-md border border-ahiyade-sand px-3 py-2" />
      </label>
      {role === "SUPPLIER" ? (
        <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
          Site web
          <input name="website" type="url" className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
        </label>
      ) : null}
      {message ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{message}</p> : null}
      <button disabled={isLoading} className="focus-ring h-12 rounded-md bg-ahiyade-cocoa font-bold text-white disabled:opacity-60" type="submit">
        {isLoading ? "Creation..." : "Creer mon compte"}
      </button>
    </form>
  );
}
