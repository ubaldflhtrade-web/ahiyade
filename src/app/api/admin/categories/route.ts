import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const categorySchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  nameFr: z.string().min(2),
  nameEn: z.string().min(2)
});

export async function GET() {
  const categories = await db.category.findMany({ orderBy: { nameFr: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const parsed = categorySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const category = await db.category.create({ data: parsed.data });
  return NextResponse.json({ category }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const parsed = categorySchema.safeParse(await request.json());
  if (!parsed.success || !parsed.data.id) {
    return NextResponse.json({ error: "Categorie invalide" }, { status: 400 });
  }

  const { id, ...data } = parsed.data;
  const category = await db.category.update({ where: { id }, data });
  return NextResponse.json({ category });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Categorie requise" }, { status: 400 });
  }

  await db.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
