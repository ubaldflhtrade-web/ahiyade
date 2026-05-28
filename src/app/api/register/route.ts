import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { sendEmail } from "@/lib/notifications/email";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe deja avec cette adresse email." }, { status: 409 });
  }

  const password = await hashPassword(parsed.data.password);
  const profileData = {
    companyName: parsed.data.companyName,
    description: parsed.data.description ?? "",
    department: parsed.data.department,
    phone: parsed.data.phone
  };

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password,
      role: parsed.data.role,
      department: parsed.data.department,
      status: "PENDING",
      supplierProfile:
        parsed.data.role === "SUPPLIER"
          ? {
              create: {
                ...profileData,
                description: parsed.data.description || "Profil fournisseur Ahiyade",
                website: parsed.data.website || undefined
              }
            }
          : undefined,
      buyerProfile:
        parsed.data.role === "BUYER"
          ? {
              create: profileData
            }
          : undefined,
      notifications: {
        create: {
          type: "WELCOME",
          message: "Bienvenue sur Ahiyade. Votre compte sera valide par l'administration."
        }
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  await sendEmail({
    to: user.email,
    subject: "Bienvenue sur Ahiyade",
    html: `<p>Bonjour ${user.name}, votre inscription Ahiyade a bien ete recue.</p>`
  });

  return NextResponse.json({ user }, { status: 201 });
}
