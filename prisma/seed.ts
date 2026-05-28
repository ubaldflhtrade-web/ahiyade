import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories, demoProducts } from "../src/lib/demo-data";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Ahiyade2026!", 12);

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { nameFr: category.nameFr, nameEn: category.nameEn },
      create: category
    });
  }

  const agro = await prisma.category.findUniqueOrThrow({ where: { slug: "agroalimentaire" } });
  const textile = await prisma.category.findUniqueOrThrow({ where: { slug: "textile-confection" } });

  const supplier = await prisma.user.upsert({
    where: { email: "fournisseur@ahiyade.bj" },
    update: {},
    create: {
      name: "Afi Bio Benin",
      email: "fournisseur@ahiyade.bj",
      password,
      role: "SUPPLIER",
      plan: "PREMIUM",
      isVerified: true,
      status: "ACTIVE",
      department: "LITTORAL",
      supplierProfile: {
        create: {
          companyName: "Afi Bio Benin",
          logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=600&auto=format&fit=crop",
          description: "Cooperative de transformation agroalimentaire basee a Cotonou.",
          department: "LITTORAL",
          phone: "+229 97 00 00 01",
          website: "https://ahiyade.bj",
          isFeatured: true,
          rating: 4.7
        }
      }
    }
  });

  await prisma.user.upsert({
    where: { email: "acheteur@ahiyade.bj" },
    update: {},
    create: {
      name: "Marche Pro Porto-Novo",
      email: "acheteur@ahiyade.bj",
      password,
      role: "BUYER",
      isVerified: true,
      status: "ACTIVE",
      department: "OUEME",
      buyerProfile: {
        create: {
          companyName: "Marche Pro Porto-Novo",
          description: "Grossiste et distributeur regional.",
          department: "OUEME",
          phone: "+229 97 00 00 02"
        }
      }
    }
  });

  await prisma.user.upsert({
    where: { email: "admin@ahiyade.bj" },
    update: {},
    create: {
      name: "Admin Ahiyade",
      email: "admin@ahiyade.bj",
      password,
      role: "ADMIN",
      isVerified: true,
      status: "ACTIVE",
      department: "LITTORAL"
    }
  });

  const existing = await prisma.product.count({ where: { supplierId: supplier.id } });
  if (existing === 0) {
    await prisma.product.createMany({
      data: demoProducts.slice(0, 4).map((product, index) => ({
        supplierId: supplier.id,
        categoryId: index % 2 === 0 ? agro.id : textile.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        department: product.department,
        images: product.images
      }))
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
