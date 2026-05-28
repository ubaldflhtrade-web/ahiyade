import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  return NextResponse.json(await getAdminStats());
}
