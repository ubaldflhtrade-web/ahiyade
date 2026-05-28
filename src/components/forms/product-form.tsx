"use client";

import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { departments } from "@/lib/constants";

export function ProductForm({ categories }: { categories: Array<{ id: string; nameFr: string }> }) {
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const images = String(formData.get("images") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        categoryId: formData.get("categoryId"),
        department: formData.get("department"),
        images
      })
    });

    setMessage(response.ok ? "Produit ajoute avec succes." : "Impossible d'ajouter le produit.");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-ahiyade-sand bg-white p-5 shadow-soft">
      <h2 className="text-xl font-black text-ahiyade-cocoa">Ajouter un produit</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" required placeholder="Nom du produit" className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
        <select name="categoryId" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameFr}
            </option>
          ))}
        </select>
        <input name="price" required inputMode="numeric" placeholder="Prix XOF" className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
        <input name="stock" required inputMode="numeric" placeholder="Stock" className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3" />
        <select name="department" required className="focus-ring h-12 rounded-md border border-ahiyade-sand px-3">
          {departments.map((department) => (
            <option key={department.value} value={department.value}>
              {department.label}
            </option>
          ))}
        </select>
      </div>
      <textarea name="description" required rows={4} placeholder="Description commerciale" className="focus-ring rounded-md border border-ahiyade-sand px-3 py-2" />
      <textarea name="images" rows={3} placeholder="URLs d'images, une par ligne" className="focus-ring rounded-md border border-ahiyade-sand px-3 py-2" />
      <button type="submit" className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ahiyade-cocoa font-bold text-white">
        <Plus className="h-5 w-5" />
        Publier
      </button>
      {message ? <p className="text-sm font-semibold text-ahiyade-palm">{message}</p> : null}
    </form>
  );
}
