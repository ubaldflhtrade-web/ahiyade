import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/notifications/email";

const forgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase()
});

export async function POST(request: Request) {
  const parsed = forgotPasswordSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    // Version MVP: le lien de reinitialisation peut etre remplace par un token persistant.
    await sendEmail({
      to: user.email,
      subject: "Reinitialisation de votre mot de passe Ahiyade",
      html: "<p>Contactez l'administration Ahiyade pour finaliser la reinitialisation securisee de votre mot de passe.</p>"
    });
  }

  return NextResponse.json({ ok: true });
}
