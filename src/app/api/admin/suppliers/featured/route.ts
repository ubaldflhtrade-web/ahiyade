import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const featuredSchema = z.object({
  userId: z.string().min(1),
  isFeatured: z.boolean()
});

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const parsed = featuredSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await db.supplierProfile.update({
    where: { userId: parsed.data.userId },
    data: { isFeatured: parsed.data.isFeatured }
  });

  return NextResponse.json({ profile });
}
