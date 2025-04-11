import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.material.deleteMany();

  // Seed materials
  const materials = [
    // Concrete
    {
      name: "Standard Concrete",
      category: "Concrete",
      rate: 120.0,
      unit: "cubic meter",
      description: "Standard mix for general construction",
    },
    {
      name: "High-Strength Concrete",
      category: "Concrete",
      rate: 150.0,
      unit: "cubic meter",
      description: "Higher PSI for demanding structural requirements",
    },
    {
      name: "Lightweight Concrete",
      category: "Concrete",
      rate: 160.0,
      unit: "cubic meter",
      description: "Lighter weight with similar strength properties",
    },

    // Steel
    {
      name: "Structural Steel",
      category: "Steel",
      rate: 2500.0,
      unit: "ton",
      description: "Standard structural steel for framing",
    },
    {
      name: "Reinforcement Steel",
      category: "Steel",
      rate: 1800.0,
      unit: "ton",
      description: "For concrete reinforcement",
    },
    {
      name: "Stainless Steel",
      category: "Steel",
      rate: 4500.0,
      unit: "ton",
      description: "Corrosion-resistant steel for special applications",
    },

    // Lumber
    {
      name: "Framing Lumber",
      category: "Lumber",
      rate: 600.0,
      unit: "thousand board feet",
      description: "Standard construction lumber",
    },
    {
      name: "Treated Lumber",
      category: "Lumber",
      rate: 850.0,
      unit: "thousand board feet",
      description: "Pressure-treated for outdoor use",
    },

    // Masonry
    {
      name: "Standard Brick",
      category: "Masonry",
      rate: 0.85,
      unit: "piece",
      description: "Standard clay brick",
    },
    {
      name: "Concrete Block",
      category: "Masonry",
      rate: 2.5,
      unit: "piece",
      description: "8x8x16 standard concrete block",
    },
  ];

  for (const material of materials) {
    await prisma.material.create({
      data: material,
    });
  }

  console.log("Database has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
