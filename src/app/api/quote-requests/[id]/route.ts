import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/notifications";
import { getCurrentUser } from "@/lib/session";
import { quoteStatusSchema } from "@/lib/validators";

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const quote = await db.quoteRequest.findUnique({ where: { id: params.id }, include: { product: true } });
  if (!quote) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && user.id !== quote.supplierId) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const parsed = quoteStatusSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await db.quoteRequest.update({
    where: { id: params.id },
    data: parsed.data
  });

  if (parsed.data.status === "REPLIED") {
    await notifyUser(quote.buyerId, "QUOTE_REPLY", `Votre demande de devis pour ${quote.product.name} a recu une reponse.`, {
      email: true,
      subject: "Reponse a votre demande de devis"
    });
  }

  return NextResponse.json({ quote: updated });
}
