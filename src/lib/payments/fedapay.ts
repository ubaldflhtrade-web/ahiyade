import { absoluteUrl } from "@/lib/utils";

type CheckoutInput = {
  amount: number;
  cadence: "monthly" | "annual";
  paymentMethod: "FEDAPAY" | "MTN_MOMO" | "MOOV_MONEY" | "CARD";
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
};

const apiBase =
  process.env.FEDAPAY_ENVIRONMENT === "live"
    ? "https://api.fedapay.com/v1"
    : "https://sandbox-api.fedapay.com/v1";

async function fedapayFetch<T>(path: string, init: RequestInit = {}) {
  const secret = process.env.FEDAPAY_SECRET_KEY;
  if (!secret) {
    throw new Error("FEDAPAY_SECRET_KEY manquant");
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`FedaPay ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

export async function createFedaPayCheckout(input: CheckoutInput) {
  const [firstname, ...lastnameParts] = (input.user.name ?? "Client Ahiyade").split(" ");
  const mode =
    input.paymentMethod === "MTN_MOMO"
      ? "mtn_open"
      : input.paymentMethod === "MOOV_MONEY"
        ? "moov"
        : undefined;

  // FedaPay cree d'abord une transaction, puis un token de lien de paiement.
  const transaction = await fedapayFetch<{ id: number; reference: string; status: string }>("/transactions", {
    method: "POST",
    body: JSON.stringify({
      description: `Abonnement Ahiyade Premium ${input.cadence}`,
      amount: input.amount,
      currency: { iso: "XOF" },
      callback_url: absoluteUrl("/api/webhooks/fedapay"),
      mode,
      customer: {
        firstname,
        lastname: lastnameParts.join(" ") || firstname,
        email: input.user.email
      },
      custom_metadata: {
        userId: input.user.id,
        cadence: input.cadence,
        paymentMethod: input.paymentMethod
      }
    })
  });

  const token = await fedapayFetch<{ token: string; url: string }>(`/transactions/${transaction.id}/token`, {
    method: "POST"
  });

  return { transaction, token };
}
