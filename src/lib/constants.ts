export const departments = [
  { value: "ALIBORI", label: "Alibori" },
  { value: "ATACORA", label: "Atacora" },
  { value: "ATLANTIQUE", label: "Atlantique" },
  { value: "BORGOU", label: "Borgou" },
  { value: "COLLINES", label: "Collines" },
  { value: "COUFFO", label: "Couffo" },
  { value: "DONGA", label: "Donga" },
  { value: "LITTORAL", label: "Littoral" },
  { value: "MONO", label: "Mono" },
  { value: "OUEME", label: "Oueme" },
  { value: "PLATEAU", label: "Plateau" },
  { value: "ZOU", label: "Zou" }
] as const;

export const paymentMethods = [
  { value: "FEDAPAY", label: "FedaPay" },
  { value: "MTN_MOMO", label: "MTN Mobile Money" },
  { value: "MOOV_MONEY", label: "Moov Money" },
  { value: "CARD", label: "Carte bancaire" }
] as const;

export const planPrices = {
  monthly: 15000,
  annual: 150000
};

export const routes = {
  fr: {
    home: "/fr",
    catalog: "/fr/catalogue",
    pricing: "/fr/tarifs",
    login: "/fr/auth/connexion",
    register: "/fr/auth/inscription"
  },
  en: {
    home: "/en",
    catalog: "/en/catalogue",
    pricing: "/en/tarifs",
    login: "/en/auth/connexion",
    register: "/en/auth/inscription"
  }
};

export function departmentLabel(value?: string | null) {
  return departments.find((department) => department.value === value)?.label ?? "Benin";
}
