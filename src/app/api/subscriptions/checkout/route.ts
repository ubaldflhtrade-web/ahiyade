import { addYears, addMonths } from "date-fns";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createFedaPayCheckout } from "@/lib/payments/fedapay";
import { getCurrentUser } from "@/lib/session";
import { planPrices } from "@/lib/constants";
import { subscriptionCheckoutSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPPLIER") {
    return NextResponse.json({ error: "Seuls les fournisseurs peuvent souscrire au Premium." }, { status: 403 });
  }

  const parsed = subscriptionCheckoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const amount = parsed.data.cadence === "annual" ? planPrices.annual : planPrices.monthly;
  const startDate = new Date();
  const endDate = parsed.data.cadence === "annual" ? addYears(startDate, 1) : addMonths(startDate, 1);

  const subscription = await db.subscription.create({
    data: {
      userId: user.id,
      plan: "PREMIUM",
      startDate,
      endDate,
      paymentMethod: parsed.data.paymentMethod,
      status: "PENDING"
    }
  });

  if (!process.env.FEDAPAY_SECRET_KEY) {
    await db.subscription.update({
      where: { id: subscription.id },
      data: { transactionId: `dev-${subscription.id}` }
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      checkoutUrl: "/fr/tableau-de-bord/fournisseur?paiement=simulation",
      sandbox: true
    });
  }

  const checkout = await createFedaPayCheckout({
    amount,
    cadence: parsed.data.cadence,
    paymentMethod: parsed.data.paymentMethod,
    user
  });

  await db.subscription.update({
    where: { id: subscription.id },
    data: { transactionId: String(checkout.transaction.id) }
  });

  return NextResponse.json({
    subscriptionId: subscription.id,
    checkoutUrl: checkout.token.url,
    token: checkout.token.token
  });
}
