import { NextResponse } from "next/server";
import { createUploadSignature } from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !["SUPPLIER", "ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  return NextResponse.json(createUploadSignature());
}
