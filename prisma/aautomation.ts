import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const touches = await prisma.touch.findMany();

  for (const touch of touches) {
    console.log(touch);
    await prisma.touch.update({
      where: { id: touch.id },
      data: {
        unitAbb: touch.unitAbb,
      },
    });
  }

  console.log('Updated all units with shortName.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
