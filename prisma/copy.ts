import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updateUnits = await prisma.touch.updateMany({
    where: {
      unitAbb: 'dsh',
    },
    data: {
      unitAbb: 'dash',
    },
  });

  console.log(`Updated ${updateUnits.count} units.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
