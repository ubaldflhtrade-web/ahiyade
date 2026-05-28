type SmsPayload = {
  to: string;
  message: string;
};

export async function sendSms({ to, message }: SmsPayload) {
  const apiKey = process.env.AFRICAS_TALKING_API_KEY;
  const username = process.env.AFRICAS_TALKING_USERNAME ?? "sandbox";

  if (!apiKey) {
    console.info("[sms:skip]", to, message);
    return { skipped: true };
  }

  const body = new URLSearchParams({
    username,
    to,
    message
  });

  if (process.env.AFRICAS_TALKING_SENDER_ID) {
    body.set("from", process.env.AFRICAS_TALKING_SENDER_ID);
  }

  const response = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      apiKey,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    throw new Error(`Africa's Talking SMS error: ${response.status}`);
  }

  return response.json();
}
