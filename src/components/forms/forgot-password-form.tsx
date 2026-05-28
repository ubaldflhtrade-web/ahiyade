"use client";

import { FormEvent, useState } from "react";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") })
    });
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-ahiyade-sand/70 bg-white p-6 shadow-soft">
      <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
        Email
        <input name="email" type="email" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
      </label>
      <button className="focus-ring h-12 rounded-md bg-ahiyade-cocoa font-bold text-white" type="submit">
        Envoyer
      </button>
      {sent ? <p className="rounded-md bg-ahiyade-palm/10 p-3 text-sm font-semibold text-ahiyade-palm">Si ce compte existe, un email a ete envoye.</p> : null}
    </form>
  );
}
