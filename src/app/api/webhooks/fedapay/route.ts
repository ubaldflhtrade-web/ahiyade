import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/notifications";

export async function POST(request: Request) {
  const payload = await request.json();
  const transaction = payload.object ?? payload.transaction ?? payload;
  const transactionId = transaction.id ? String(transaction.id) : transaction.reference;
  const status = String(transaction.status ?? "").toLowerCase();

  if (!transactionId) {
    return NextResponse.json({ error: "Transaction introuvable" }, { status: 400 });
  }

  const subscription = await db.subscription.findUnique({
    where: { transactionId },
    include: { user: true }
  });

  if (!subscription) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (["approved", "completed", "transferred"].includes(status)) {
    await db.$transaction([
      db.subscription.update({
        where: { id: subscription.id },
        data: { status: "ACTIVE" }
      }),
      db.user.update({
        where: { id: subscription.userId },
        data: { plan: "PREMIUM", isVerified: true }
      })
    ]);

    await notifyUser(subscription.userId, "SUBSCRIPTION", "Votre abonnement Ahiyade Premium est actif.", {
      email: true,
      sms: true,
      subject: "Abonnement Ahiyade Premium active"
    });
  } else if (["failed", "canceled", "cancelled"].includes(status)) {
    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: "FAILED" }
    });
  }

  return NextResponse.json({ ok: true });
}
