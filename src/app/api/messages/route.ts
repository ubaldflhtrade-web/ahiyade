import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/notifications";
import { getCurrentUser } from "@/lib/session";
import { messageSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const peerId = new URL(request.url).searchParams.get("peerId");
  const messages = await db.message.findMany({
    where: peerId
      ? {
          OR: [
            { senderId: user.id, receiverId: peerId },
            { senderId: peerId, receiverId: user.id }
          ]
        }
      : {
          OR: [{ senderId: user.id }, { receiverId: user.id }]
        },
    include: {
      sender: { select: { id: true, name: true, role: true } },
      receiver: { select: { id: true, name: true, role: true } }
    },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const parsed = messageSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const message = await db.message.create({
    data: {
      senderId: user.id,
      receiverId: parsed.data.receiverId,
      content: parsed.data.content
    }
  });

  await notifyUser(parsed.data.receiverId, "MESSAGE", `Nouveau message de ${user.name ?? "Ahiyade"}.`, {
    email: true,
    sms: true,
    subject: "Nouveau message Ahiyade"
  });

  return NextResponse.json({ message }, { status: 201 });
}
