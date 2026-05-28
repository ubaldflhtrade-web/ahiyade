import { cache } from "react";
import type { Department } from "@prisma/client";
import { db } from "@/lib/db";
import { categories, demoProducts, demoSuppliers, type CatalogProduct } from "@/lib/demo-data";

const demoMode = process.env.AHIYADE_DEMO_MODE === "true";

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

export function mapProduct(product: any): CatalogProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: toNumber(product.price),
    stock: product.stock,
    department: product.department,
    images: product.images,
    category: product.category,
    supplier: {
      id: product.supplier.id,
      name: product.supplier.name,
      plan: product.supplier.plan,
      isVerified: product.supplier.isVerified,
      supplierProfile: product.supplier.supplierProfile
        ? {
            companyName: product.supplier.supplierProfile.companyName,
            logo: product.supplier.supplierProfile.logo,
            department: product.supplier.supplierProfile.department,
            rating: toNumber(product.supplier.supplierProfile.rating)
          }
        : null
    }
  };
}

export const getCategories = cache(async () => {
  if (demoMode) {
    return categories.map((category, index) => ({ id: category.slug, ...category, createdAt: new Date(index), updatedAt: new Date(index) }));
  }

  try {
    return await db.category.findMany({ orderBy: { nameFr: "asc" } });
  } catch {
    return categories.map((category, index) => ({ id: category.slug, ...category, createdAt: new Date(index), updatedAt: new Date(index) }));
  }
});

export const getFeaturedProducts = cache(async (limit = 6) => {
  if (demoMode) {
    return demoProducts.slice(0, limit);
  }

  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      orderBy: [{ supplier: { plan: "desc" } }, { views: "desc" }, { createdAt: "desc" }],
      take: limit,
      include: {
        category: true,
        supplier: {
          include: { supplierProfile: true }
        }
      }
    });

    return products.map(mapProduct);
  } catch {
    return demoProducts.slice(0, limit);
  }
});

export async function getCatalogProducts(params: {
  q?: string;
  category?: string;
  department?: Department;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
}) {
  const page = params.page ?? 1;
  const take = 12;
  const skip = (page - 1) * take;

  if (demoMode) {
    const filtered = demoProducts.filter((product) => {
      const matchesSearch = params.q
        ? `${product.name} ${product.description}`.toLowerCase().includes(params.q.toLowerCase())
        : true;
      const matchesCategory = params.category ? product.category.slug === params.category : true;
      const matchesDepartment = params.department ? product.department === params.department : true;
      const matchesMin = params.minPrice ? product.price >= params.minPrice : true;
      const matchesMax = params.maxPrice ? product.price <= params.maxPrice : true;
      return matchesSearch && matchesCategory && matchesDepartment && matchesMin && matchesMax;
    });

    return {
      products: filtered.slice(skip, skip + take),
      total: filtered.length,
      page,
      pageCount: Math.max(1, Math.ceil(filtered.length / take))
    };
  }

  try {
    const where = {
      isActive: true,
      ...(params.q
        ? {
            OR: [
              { name: { contains: params.q, mode: "insensitive" as const } },
              { description: { contains: params.q, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(params.department ? { department: params.department } : {}),
      ...(params.category ? { category: { slug: params.category } } : {}),
      ...(params.minPrice || params.maxPrice
        ? {
            price: {
              ...(params.minPrice ? { gte: params.minPrice } : {}),
              ...(params.maxPrice ? { lte: params.maxPrice } : {})
            }
          }
        : {})
    };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: [{ supplier: { plan: "desc" } }, { createdAt: "desc" }],
        skip,
        take,
        include: {
          category: true,
          supplier: { include: { supplierProfile: true } }
        }
      }),
      db.product.count({ where })
    ]);

    return {
      products: products.map(mapProduct),
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / take))
    };
  } catch {
    const filtered = demoProducts.filter((product) => {
      const matchesSearch = params.q
        ? `${product.name} ${product.description}`.toLowerCase().includes(params.q.toLowerCase())
        : true;
      const matchesCategory = params.category ? product.category.slug === params.category : true;
      const matchesDepartment = params.department ? product.department === params.department : true;
      const matchesMin = params.minPrice ? product.price >= params.minPrice : true;
      const matchesMax = params.maxPrice ? product.price <= params.maxPrice : true;
      return matchesSearch && matchesCategory && matchesDepartment && matchesMin && matchesMax;
    });

    return {
      products: filtered.slice(skip, skip + take),
      total: filtered.length,
      page,
      pageCount: Math.max(1, Math.ceil(filtered.length / take))
    };
  }
}

export async function getProduct(id: string) {
  if (demoMode) {
    return demoProducts.find((product) => product.id === id) ?? null;
  }

  try {
    const product = await db.product.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        category: true,
        supplier: { include: { supplierProfile: true } }
      }
    });
    return mapProduct(product);
  } catch {
    return demoProducts.find((product) => product.id === id) ?? null;
  }
}

export const getFeaturedSuppliers = cache(async (limit = 6) => {
  if (demoMode) {
    return demoSuppliers.slice(0, limit).map((supplier) => ({
      ...supplier,
      email: "contact@ahiyade.bj",
      role: "SUPPLIER",
      status: "ACTIVE",
      _count: { products: 8, receivedQuotes: 24 }
    }));
  }

  try {
    return await db.user.findMany({
      where: {
        role: "SUPPLIER",
        status: "ACTIVE",
        supplierProfile: { isFeatured: true }
      },
      take: limit,
      include: {
        supplierProfile: true,
        _count: { select: { products: true, receivedQuotes: true } }
      },
      orderBy: [{ plan: "desc" }, { createdAt: "desc" }]
    });
  } catch {
    return demoSuppliers.slice(0, limit).map((supplier) => ({
      ...supplier,
      email: "contact@ahiyade.bj",
      role: "SUPPLIER",
      status: "ACTIVE",
      _count: { products: 8, receivedQuotes: 24 }
    }));
  }
});

export async function getSupplierProfile(id: string) {
  if (demoMode) {
    const supplier = demoSuppliers.find((item) => item.id === id);
    if (!supplier) return null;
    return {
      ...supplier,
      email: "contact@ahiyade.bj",
      products: demoProducts.filter((product) => product.supplier.id === id),
      ratingsReceived: []
    };
  }

  try {
    return await db.user.findUnique({
      where: { id },
      include: {
        supplierProfile: true,
        products: {
          where: { isActive: true },
          include: { category: true, supplier: { include: { supplierProfile: true } } },
          orderBy: { createdAt: "desc" }
        },
        ratingsReceived: {
          include: { buyer: { select: { name: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });
  } catch {
    const supplier = demoSuppliers.find((item) => item.id === id);
    if (!supplier) return null;
    return {
      ...supplier,
      email: "contact@ahiyade.bj",
      products: demoProducts.filter((product) => product.supplier.id === id),
      ratingsReceived: []
    };
  }
}

export async function getAdminStats() {
  if (demoMode) {
    return { users: 126, products: 482, quotes: 91, revenue: 1845000 };
  }

  try {
    const [users, products, quotes, subscriptions] = await Promise.all([
      db.user.count(),
      db.product.count(),
      db.quoteRequest.count(),
      db.subscription.findMany({ where: { status: "ACTIVE" } })
    ]);

    return {
      users,
      products,
      quotes,
      revenue: subscriptions.length * 15000
    };
  } catch {
    return { users: 126, products: 482, quotes: 91, revenue: 1845000 };
  }
}

export async function getBuyerDashboard(userId: string) {
  try {
    return await db.user.findUnique({
      where: { id: userId },
      include: {
        buyerProfile: true,
        favorites: { include: { product: { include: { category: true, supplier: { include: { supplierProfile: true } } } } } },
        quoteRequests: { include: { product: true, supplier: { include: { supplierProfile: true } } }, orderBy: { createdAt: "desc" } },
        receivedMessages: { orderBy: { createdAt: "desc" }, take: 5 }
      }
    });
  } catch {
    return null;
  }
}

export async function getSupplierDashboard(userId: string) {
  try {
    return await db.user.findUnique({
      where: { id: userId },
      include: {
        supplierProfile: true,
        products: { include: { category: true }, orderBy: { createdAt: "desc" } },
        receivedQuotes: { include: { product: true, buyer: true }, orderBy: { createdAt: "desc" } },
        receivedMessages: { orderBy: { createdAt: "desc" }, take: 5 },
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 }
      }
    });
  } catch {
    return null;
  }
}
