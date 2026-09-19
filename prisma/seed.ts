import { PrismaClient } from "@prisma/client";
import { HU_CITIES, TECH_TAGS } from "../src/lib/taxonomy";

const prisma = new PrismaClient();

async function main() {
  for (const [category, names] of Object.entries(TECH_TAGS)) {
    for (const name of names) {
      await prisma.techTag.upsert({
        where: { name },
        update: { category },
        create: { name, category },
      });
    }
  }

  for (const name of HU_CITIES) {
    await prisma.city.upsert({
      where: { name_country: { name, country: "HU" } },
      update: {},
      create: { name, country: "HU" },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
