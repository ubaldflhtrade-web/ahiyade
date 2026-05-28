import { MessageSquare } from "lucide-react";
import { MessageComposer } from "@/components/forms/message-composer";
import type { Locale } from "@/i18n/config";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export default async function MessagingPage({
  params,
  searchParams
}: {
  params: { locale: Locale };
  searchParams: { peerId?: string };
}) {
  const user = await requireUser(params.locale);
  const peerId = searchParams.peerId;

  let messages: any[] = [];
  let peer: any = null;

  try {
    if (peerId) {
      [messages, peer] = await Promise.all([
        db.message.findMany({
          where: {
            OR: [
              { senderId: user.id, receiverId: peerId },
              { senderId: peerId, receiverId: user.id }
            ]
          },
          include: { sender: true, receiver: true },
          orderBy: { createdAt: "asc" }
        }),
        db.user.findUnique({ where: { id: peerId }, include: { supplierProfile: true, buyerProfile: true } })
      ]);
    } else {
      messages = await db.message.findMany({
        where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
        include: { sender: true, receiver: true },
        orderBy: { createdAt: "desc" },
        take: 30
      });
    }
  } catch {
    messages = [];
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase text-ahiyade-palm">Messagerie</p>
        <h1 className="mt-2 text-4xl font-black text-ahiyade-cocoa">Conversation interne</h1>
        <p className="mt-3 text-ahiyade-cocoa/75">
          Echangez avec vos acheteurs et fournisseurs sans quitter Ahiyade.
        </p>
      </div>

      <div className="rounded-lg border border-ahiyade-sand/70 bg-white shadow-soft">
        <div className="flex items-center gap-3 border-b border-ahiyade-sand p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ahiyade-cream text-ahiyade-cocoa">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-black text-ahiyade-cocoa">{peer?.supplierProfile?.companyName ?? peer?.buyerProfile?.companyName ?? peer?.name ?? "Toutes les conversations"}</h2>
            <p className="text-sm text-ahiyade-cocoa/70">{messages.length} message(s)</p>
          </div>
        </div>
        <div className="grid max-h-[58vh] gap-3 overflow-y-auto p-4">
          {messages.length ? (
            messages.map((message) => {
              const mine = message.senderId === user.id;
              return (
                <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] rounded-lg px-4 py-3 ${mine ? "bg-ahiyade-palm text-white" : "bg-ahiyade-cream text-ahiyade-cocoa"}`}>
                    <p className="text-sm font-bold">{message.sender?.name}</p>
                    <p className="mt-1">{message.content}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-md bg-ahiyade-cream p-4 text-sm font-semibold text-ahiyade-cocoa">
              Aucune conversation pour le moment. Ouvrez un profil fournisseur et cliquez sur contacter.
            </p>
          )}
        </div>
        {peerId ? (
          <div className="border-t border-ahiyade-sand p-4">
            <MessageComposer receiverId={peerId} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
