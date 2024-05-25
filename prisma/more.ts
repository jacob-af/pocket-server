import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Update all units to set the 'abbreviation' column to null
  const updateUnits = await prisma.touch.updateMany({
    data: {
      unitAbb: null,
    },
  });

  console.log(`Cleared abbreviation column for ${updateUnits.count} units.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
