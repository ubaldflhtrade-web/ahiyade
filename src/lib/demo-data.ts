import type { Department } from "@prisma/client";

export const categories = [
  { slug: "agroalimentaire", nameFr: "Agroalimentaire", nameEn: "Agri-food" },
  { slug: "textile-confection", nameFr: "Textile & Confection", nameEn: "Textile & Clothing" },
  { slug: "batiment-construction", nameFr: "Batiment & Construction", nameEn: "Building & Construction" },
  { slug: "electronique-electromenager", nameFr: "Electronique & Electromenager", nameEn: "Electronics & Appliances" },
  { slug: "cosmetique-hygiene", nameFr: "Cosmetique & Hygiene", nameEn: "Cosmetics & Hygiene" },
  { slug: "pharmacie-sante", nameFr: "Pharmacie & Sante", nameEn: "Pharmacy & Health" },
  { slug: "agriculture-elevage", nameFr: "Agriculture & Elevage", nameEn: "Agriculture & Livestock" },
  { slug: "energie-equipements", nameFr: "Energie & Equipements", nameEn: "Energy & Equipment" },
  { slug: "transport-logistique", nameFr: "Transport & Logistique", nameEn: "Transport & Logistics" },
  { slug: "services-entreprises", nameFr: "Services aux entreprises", nameEn: "Business Services" }
];

export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  department: Department;
  images: string[];
  category: {
    id?: string;
    slug: string;
    nameFr: string;
    nameEn: string;
  };
  supplier: {
    id: string;
    name: string;
    plan: "FREE" | "PREMIUM";
    isVerified: boolean;
    supplierProfile: {
      companyName: string;
      logo?: string | null;
      department: Department;
      rating: number;
    } | null;
  };
};

export const demoProducts: CatalogProduct[] = [
  {
    id: "demo-ananas-seche",
    name: "Ananas seche premium",
    description: "Ananas du Plateau transforme en sachets de 500 g pour boutiques, hotels et supermarches.",
    price: 2800,
    stock: 850,
    department: "PLATEAU",
    images: ["https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?q=80&w=1200&auto=format&fit=crop"],
    category: categories[0],
    supplier: {
      id: "demo-supplier-1",
      name: "Cooperative Ife",
      plan: "PREMIUM",
      isVerified: true,
      supplierProfile: {
        companyName: "Cooperative Ife",
        logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop",
        department: "PLATEAU",
        rating: 4.8
      }
    }
  },
  {
    id: "demo-textile-kita",
    name: "Tissus wax et uniformes",
    description: "Lots de tissus wax, pagnes et uniformes scolaires cousus a Cotonou.",
    price: 12500,
    stock: 320,
    department: "LITTORAL",
    images: ["https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop"],
    category: categories[1],
    supplier: {
      id: "demo-supplier-2",
      name: "Atelier Adja",
      plan: "PREMIUM",
      isVerified: true,
      supplierProfile: {
        companyName: "Atelier Adja",
        logo: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop",
        department: "LITTORAL",
        rating: 4.6
      }
    }
  },
  {
    id: "demo-ciment-fer",
    name: "Ciment et fer a beton",
    description: "Approvisionnement chantier, sacs de ciment, fer HA et accessoires de construction.",
    price: 78000,
    stock: 120,
    department: "ATLANTIQUE",
    images: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop"],
    category: categories[2],
    supplier: {
      id: "demo-supplier-3",
      name: "Batir Atlantique",
      plan: "FREE",
      isVerified: true,
      supplierProfile: {
        companyName: "Batir Atlantique",
        logo: null,
        department: "ATLANTIQUE",
        rating: 4.3
      }
    }
  },
  {
    id: "demo-karite",
    name: "Beurre de karite brut",
    description: "Beurre de karite naturel en futs pour savonneries, cosmetiques et export local.",
    price: 42000,
    stock: 60,
    department: "ATACORA",
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop"],
    category: categories[4],
    supplier: {
      id: "demo-supplier-4",
      name: "Karite Nord Benin",
      plan: "PREMIUM",
      isVerified: true,
      supplierProfile: {
        companyName: "Karite Nord Benin",
        logo: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
        department: "ATACORA",
        rating: 4.9
      }
    }
  },
  {
    id: "demo-solaire",
    name: "Kits solaires boutiques",
    description: "Kits solaires 300 W avec batterie et lampes pour commerces ruraux.",
    price: 185000,
    stock: 45,
    department: "BORGOU",
    images: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop"],
    category: categories[7],
    supplier: {
      id: "demo-supplier-5",
      name: "Soleil Borgou",
      plan: "FREE",
      isVerified: false,
      supplierProfile: {
        companyName: "Soleil Borgou",
        logo: null,
        department: "BORGOU",
        rating: 4.1
      }
    }
  },
  {
    id: "demo-logistique",
    name: "Transport groupage Cotonou-Parakou",
    description: "Service B2B de groupage hebdomadaire pour marchandises et colis professionnels.",
    price: 35000,
    stock: 25,
    department: "DONGA",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop"],
    category: categories[8],
    supplier: {
      id: "demo-supplier-6",
      name: "Logis Benin Pro",
      plan: "PREMIUM",
      isVerified: true,
      supplierProfile: {
        companyName: "Logis Benin Pro",
        logo: null,
        department: "DONGA",
        rating: 4.5
      }
    }
  }
];

export const demoSuppliers = demoProducts.map((product) => product.supplier).filter((supplier, index, list) => {
  return list.findIndex((item) => item.id === supplier.id) === index;
});
