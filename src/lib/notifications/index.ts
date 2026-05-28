import type { NotificationType } from "@prisma/client";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/notifications/email";
import { sendSms } from "@/lib/notifications/sms";

type NotifyOptions = {
  email?: boolean;
  sms?: boolean;
  subject?: string;
};

export async function notifyUser(userId: string, type: NotificationType, message: string, options: NotifyOptions = {}) {
  const [notification, user] = await Promise.all([
    db.notification.create({
      data: {
        userId,
        type,
        message
      }
    }),
    db.user.findUnique({
      where: { id: userId },
      include: {
        supplierProfile: true,
        buyerProfile: true
      }
    })
  ]);

  if (!user) {
    return notification;
  }

  if (options.email) {
    await sendEmail({
      to: user.email,
      subject: options.subject ?? "Notification Ahiyade",
      html: `<p>${message}</p>`
    });
  }

  const phone = user.supplierProfile?.phone ?? user.buyerProfile?.phone;
  if (options.sms && phone) {
    await sendSms({ to: phone, message });
  }

  return notification;
}
