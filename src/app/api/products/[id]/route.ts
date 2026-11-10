import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getProduct } from "@/lib/queries";
import { canManageProduct, getCurrentUser } from "@/lib/session";
import { productSchema } from "@/lib/validators";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const product = await getProduct(params.id);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const product = await db.product.findUnique({ where: { id: params.id } });
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  if (!canManageProduct(user.id, product.supplierId, user.role)) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const parsed = productSchema.partial().safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await db.product.update({
    where: { id: params.id },
    data: parsed.data,
    include: { category: true, supplier: { include: { supplierProfile: true } } }
  });

  return NextResponse.json({ product: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const product = await db.product.findUnique({ where: { id: params.id } });
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  if (!canManageProduct(user.id, product.supplierId, user.role)) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  // La suppression est logique afin de preserver l'historique commercial associe au produit.
  await db.product.update({
    where: { id: params.id },
    data: { isActive: false }
  });

  return NextResponse.json({ ok: true });
}
