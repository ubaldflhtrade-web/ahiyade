import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { moderationSchema } from "@/lib/validators";

const userModerationSchema = moderationSchema.extend({
  userId: z.string().min(1)
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const users = await db.user.findMany({
    include: {
      supplierProfile: true,
      buyerProfile: true,
      _count: { select: { products: true, quoteRequests: true, receivedQuotes: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const parsed = userModerationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, ...data } = parsed.data;
  const user = await db.user.update({
    where: { id: userId },
    data
  });

  return NextResponse.json({ user });
}
