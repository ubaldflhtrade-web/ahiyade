"use client";

import { SendHorizontal } from "lucide-react";
import { FormEvent, useState } from "react";

export function MessageComposer({ receiverId }: { receiverId: string }) {
  const [content, setContent] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId, content })
    });

    if (response.ok) {
      setContent("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="focus-ring min-h-12 flex-1 rounded-md border border-ahiyade-sand px-3"
        placeholder="Ecrire un message..."
      />
      <button type="submit" className="focus-ring flex h-12 w-12 items-center justify-center rounded-md bg-ahiyade-palm text-white" title="Envoyer" aria-label="Envoyer">
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
}
