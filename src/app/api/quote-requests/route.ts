import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/notifications";
import { getCurrentUser } from "@/lib/session";
import { quoteRequestSchema } from "@/lib/validators";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const where = user.role === "SUPPLIER" ? { supplierId: user.id } : { buyerId: user.id };
  const quotes = await db.quoteRequest.findMany({
    where,
    include: {
      product: true,
      buyer: { select: { id: true, name: true, email: true } },
      supplier: { select: { id: true, name: true, email: true, supplierProfile: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ quotes });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUYER") {
    return NextResponse.json({ error: "Seuls les acheteurs peuvent envoyer une demande de devis." }, { status: 403 });
  }

  const parsed = quoteRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const quote = await db.quoteRequest.create({
    data: {
      buyerId: user.id,
      supplierId: parsed.data.supplierId,
      productId: parsed.data.productId,
      message: parsed.data.message
    },
    include: { product: true }
  });

  await notifyUser(parsed.data.supplierId, "QUOTE_REQUEST", `Nouvelle demande de devis pour ${quote.product.name}.`, {
    email: true,
    sms: true,
    subject: "Nouvelle demande de devis Ahiyade"
  });

  return NextResponse.json({ quote }, { status: 201 });
}
