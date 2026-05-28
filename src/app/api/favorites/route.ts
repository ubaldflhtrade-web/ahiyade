import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { favoriteSchema } from "@/lib/validators";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUYER") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const [products, suppliers] = await Promise.all([
    db.favorite.findMany({
      where: { buyerId: user.id },
      include: { product: { include: { category: true, supplier: { include: { supplierProfile: true } } } } }
    }),
    db.supplierFavorite.findMany({
      where: { buyerId: user.id },
      include: { supplier: { include: { supplierProfile: true } } }
    })
  ]);

  return NextResponse.json({ products, suppliers });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUYER") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const parsed = favoriteSchema.safeParse(await request.json());
  if (!parsed.success || (!parsed.data.productId && !parsed.data.supplierId)) {
    return NextResponse.json({ error: "Favori invalide" }, { status: 400 });
  }

  if (parsed.data.productId) {
    const favorite = await db.favorite.upsert({
      where: { buyerId_productId: { buyerId: user.id, productId: parsed.data.productId } },
      update: {},
      create: { buyerId: user.id, productId: parsed.data.productId }
    });
    return NextResponse.json({ favorite }, { status: 201 });
  }

  const favorite = await db.supplierFavorite.upsert({
    where: { buyerId_supplierId: { buyerId: user.id, supplierId: parsed.data.supplierId! } },
    update: {},
    create: { buyerId: user.id, supplierId: parsed.data.supplierId! }
  });

  return NextResponse.json({ favorite }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUYER") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const supplierId = searchParams.get("supplierId");

  if (productId) {
    await db.favorite.deleteMany({ where: { buyerId: user.id, productId } });
  }

  if (supplierId) {
    await db.supplierFavorite.deleteMany({ where: { buyerId: user.id, supplierId } });
  }

  return NextResponse.json({ ok: true });
}
