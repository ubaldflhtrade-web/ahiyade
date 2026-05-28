"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <AlertTriangle className="mx-auto h-12 w-12 text-ahiyade-coral" />
      <h1 className="mt-4 text-3xl font-black text-ahiyade-cocoa">Une erreur est survenue</h1>
      <p className="mt-3 text-ahiyade-cocoa/75">Veuillez reessayer. Si le probleme persiste, contactez l'administration Ahiyade.</p>
      <button onClick={reset} className="focus-ring mt-6 h-12 rounded-md bg-ahiyade-cocoa px-5 font-bold text-white">
        Reessayer
      </button>
    </section>
  );
}
