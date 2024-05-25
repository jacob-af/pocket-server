import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const units = [
    // Weight units
    { name: 'gram', abbreviation: 'g', conversion: 1, unitType: 'metric' },
    {
      name: 'kilogram',
      abbreviation: 'kg',
      conversion: 1000,
      unitType: 'metric',
    },
    {
      name: 'milligram',
      abbreviation: 'mg',
      conversion: 0.001,
      unitType: 'metric',
    },
    {
      name: 'pound',
      abbreviation: 'lb',
      conversion: 453.592,
      unitType: 'imperial',
    },
    {
      name: 'ounce',
      abbreviation: 'ounce',
      conversion: 28.3495,
      unitType: 'imperial',
    },
    // Volume units
    {
      name: 'teaspoon',
      abbreviation: 'tsp',
      conversion: 4.92892,
      unitType: 'imperial',
    },
    {
      name: 'tablespoon',
      abbreviation: 'tbsp',
      conversion: 14.7868,
      unitType: 'imperial',
    },
    {
      name: 'fluid ounce',
      abbreviation: 'oz',
      conversion: 29.5735,
      unitType: 'imperial',
    },
    { name: 'cup', abbreviation: 'cup', conversion: 240, unitType: 'imperial' },
    {
      name: 'pint',
      abbreviation: 'pt',
      conversion: 473.176,
      unitType: 'imperial',
    },
    {
      name: 'quart',
      abbreviation: 'qt',
      conversion: 946.353,
      unitType: 'imperial',
    },
    {
      name: 'gallon',
      abbreviation: 'gal',
      conversion: 3785.41,
      unitType: 'imperial',
    },
    { name: 'liter', abbreviation: 'l', conversion: 1000, unitType: 'metric' },
    {
      name: 'milliliter',
      abbreviation: 'ml',
      conversion: 1,
      unitType: 'metric',
    },
    {
      name: 'centiliter',
      abbreviation: 'cl',
      conversion: 10,
      unitType: 'metric',
    },
    // Special volume units
    {
      name: 'barspoon',
      abbreviation: 'bsp',
      conversion: 29.5735 / 8,
      unitType: 'common',
    },
    {
      name: 'dash',
      abbreviation: 'dash',
      conversion: 29.5735 / 32,
      unitType: 'common',
    },
    {
      name: 'drop',
      abbreviation: 'drop',
      conversion: 29.5735 / 480,
      unitType: 'common',
    },
    {
      name: 'pinch',
      abbreviation: 'pinch',
      conversion: 29.5735 / 96,
      unitType: 'freepour',
    },
    {
      name: 'splash',
      abbreviation: 'splsh',
      conversion: 29.5735,
      unitType: 'freepour',
    },
    {
      name: 'count',
      abbreviation: 'count',
      conversion: 29.5735 / 4,
      unitType: 'freepour',
    },
    // Item units
    { name: 'each', abbreviation: 'each', conversion: 1, unitType: 'common' },
    { name: 'dozen', abbreviation: 'doz', conversion: 12, unitType: 'common' },
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { name: unit.name },
      update: unit,
      create: unit,
    });
  }

  const conversions = await prisma.unitConversion.createMany({
    data: [
      // Conversions for weight
      {
        fromUnitId: (await prisma.unit.findUnique({ where: { name: 'gram' } }))
          .id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'kilogram' } })
        ).id,
        factor: 0.001,
      },
      {
        fromUnitId: (await prisma.unit.findUnique({ where: { name: 'gram' } }))
          .id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milligram' } })
        ).id,
        factor: 1000,
      },
      {
        fromUnitId: (await prisma.unit.findUnique({ where: { name: 'gram' } }))
          .id,
        toUnitId: (await prisma.unit.findUnique({ where: { name: 'pound' } }))
          .id,
        factor: 0.00220462,
      },
      {
        fromUnitId: (await prisma.unit.findUnique({ where: { name: 'gram' } }))
          .id,
        toUnitId: (await prisma.unit.findUnique({ where: { name: 'ounce' } }))
          .id,
        factor: 0.035274,
      },
      // Conversions for volume
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milliliter' } })
        ).id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'teaspoon' } })
        ).id,
        factor: 0.202884,
      },
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milliliter' } })
        ).id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'tablespoon' } })
        ).id,
        factor: 0.067628,
      },
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milliliter' } })
        ).id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'fluid ounce' } })
        ).id,
        factor: 0.033814,
      },
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milliliter' } })
        ).id,
        toUnitId: (await prisma.unit.findUnique({ where: { name: 'cup' } })).id,
        factor: 0.00422675,
      },
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milliliter' } })
        ).id,
        toUnitId: (await prisma.unit.findUnique({ where: { name: 'pint' } }))
          .id,
        factor: 0.00211338,
      },
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milliliter' } })
        ).id,
        toUnitId: (await prisma.unit.findUnique({ where: { name: 'quart' } }))
          .id,
        factor: 0.00105669,
      },
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milliliter' } })
        ).id,
        toUnitId: (await prisma.unit.findUnique({ where: { name: 'gallon' } }))
          .id,
        factor: 0.000264172,
      },
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milliliter' } })
        ).id,
        toUnitId: (await prisma.unit.findUnique({ where: { name: 'liter' } }))
          .id,
        factor: 0.001,
      },
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'milliliter' } })
        ).id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'centiliter' } })
        ).id,
        factor: 0.1,
      },
      // Special volume unit conversions
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'barspoon' } })
        ).id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'fluid ounce' } })
        ).id,
        factor: 1 / 8,
      },
      {
        fromUnitId: (await prisma.unit.findUnique({ where: { name: 'dash' } }))
          .id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'fluid ounce' } })
        ).id,
        factor: 1 / 32,
      },
      {
        fromUnitId: (await prisma.unit.findUnique({ where: { name: 'drop' } }))
          .id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'fluid ounce' } })
        ).id,
        factor: 1 / 480,
      },
      {
        fromUnitId: (await prisma.unit.findUnique({ where: { name: 'pinch' } }))
          .id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'fluid ounce' } })
        ).id,
        factor: 1 / 96,
      },
      {
        fromUnitId: (
          await prisma.unit.findUnique({ where: { name: 'splash' } })
        ).id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'fluid ounce' } })
        ).id,
        factor: 1,
      },
      {
        fromUnitId: (await prisma.unit.findUnique({ where: { name: 'count' } }))
          .id,
        toUnitId: (
          await prisma.unit.findUnique({ where: { name: 'fluid ounce' } })
        ).id,
        factor: 1 / 4,
      },
      // Conversions for items
      {
        fromUnitId: (await prisma.unit.findUnique({ where: { name: 'each' } }))
          .id,
        toUnitId: (await prisma.unit.findUnique({ where: { name: 'dozen' } }))
          .id,
        factor: 1 / 12,
      },
    ],
    skipDuplicates: true,
  });

  console.log({ units, conversions });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
