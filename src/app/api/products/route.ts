import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCatalogProducts } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { productFilterSchema, productSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = productFilterSchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const products = await getCatalogProducts(parsed.data);
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !["SUPPLIER", "ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (user.role === "SUPPLIER" && user.plan === "FREE") {
    const count = await db.product.count({ where: { supplierId: user.id, isActive: true } });
    if (count >= 10) {
      return NextResponse.json({ error: "Le plan gratuit permet jusqu'a 10 produits." }, { status: 402 });
    }
  }

  const product = await db.product.create({
    data: {
      ...parsed.data,
      supplierId: user.id
    },
    include: {
      category: true,
      supplier: { include: { supplierProfile: true } }
    }
  });

  return NextResponse.json({ product }, { status: 201 });
}
