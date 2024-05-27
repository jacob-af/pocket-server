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
      { fromUnitName: 'g', toUnitName: 'kg', factor: 0.001 },
      { fromUnitName: 'kg', toUnitName: 'g', factor: 1000 },
      { fromUnitName: 'g', toUnitName: 'mg', factor: 1000 },
      { fromUnitName: 'mg', toUnitName: 'g', factor: 0.001 },
      { fromUnitName: 'g', toUnitName: 'lb', factor: 0.00220462 },
      { fromUnitName: 'lb', toUnitName: 'g', factor: 453.592 },
      { fromUnitName: 'g', toUnitName: 'ounce', factor: 0.035274 },
      { fromUnitName: 'ounce', toUnitName: 'g', factor: 28.3495 },
      // Conversions for volume
      { fromUnitName: 'ml', toUnitName: 'tsp', factor: 0.202884 },
      { fromUnitName: 'tsp', toUnitName: 'ml', factor: 4.92892 },
      { fromUnitName: 'ml', toUnitName: 'tbsp', factor: 0.067628 },
      { fromUnitName: 'tbsp', toUnitName: 'ml', factor: 14.7868 },
      { fromUnitName: 'ml', toUnitName: 'oz', factor: 0.033814 },
      { fromUnitName: 'oz', toUnitName: 'ml', factor: 29.5735 },
      { fromUnitName: 'ml', toUnitName: 'cup', factor: 0.00422675 },
      { fromUnitName: 'cup', toUnitName: 'ml', factor: 240 },
      { fromUnitName: 'ml', toUnitName: 'pt', factor: 0.00211338 },
      { fromUnitName: 'pt', toUnitName: 'ml', factor: 473.176 },
      { fromUnitName: 'ml', toUnitName: 'qt', factor: 0.00105669 },
      { fromUnitName: 'qt', toUnitName: 'ml', factor: 946.353 },
      { fromUnitName: 'ml', toUnitName: 'gal', factor: 0.000264172 },
      { fromUnitName: 'gal', toUnitName: 'ml', factor: 3785.41 },
      { fromUnitName: 'ml', toUnitName: 'l', factor: 0.001 },
      { fromUnitName: 'l', toUnitName: 'ml', factor: 1000 },
      { fromUnitName: 'ml', toUnitName: 'cl', factor: 0.1 },
      { fromUnitName: 'cl', toUnitName: 'ml', factor: 10 },
      { fromUnitName: 'ml', toUnitName: 'bsp', factor: 0.033814 / 8 },
      { fromUnitName: 'bsp', toUnitName: 'ml', factor: 29.5735 / 8 },
      { fromUnitName: 'ml', toUnitName: 'dash', factor: 0.033814 / 32 },
      { fromUnitName: 'dash', toUnitName: 'ml', factor: 29.5735 / 32 },
      { fromUnitName: 'ml', toUnitName: 'drop', factor: 0.033814 / 480 },
      { fromUnitName: 'drop', toUnitName: 'ml', factor: 29.5735 / 480 },
      { fromUnitName: 'ml', toUnitName: 'pinch', factor: 0.033814 / 96 },
      { fromUnitName: 'pinch', toUnitName: 'ml', factor: 29.5735 / 96 },
      { fromUnitName: 'ml', toUnitName: 'splsh', factor: 0.033814 },
      { fromUnitName: 'splsh', toUnitName: 'ml', factor: 29.5735 },
      { fromUnitName: 'ml', toUnitName: 'count', factor: 0.033814 / 4 },
      { fromUnitName: 'count', toUnitName: 'ml', factor: 29.5735 / 4 },
      // Special volume unit conversions to ounces
      { fromUnitName: 'tsp', toUnitName: 'oz', factor: 0.166667 },
      { fromUnitName: 'tbsp', toUnitName: 'oz', factor: 0.5 },
      { fromUnitName: 'cup', toUnitName: 'oz', factor: 8 },
      { fromUnitName: 'pt', toUnitName: 'oz', factor: 16 },
      { fromUnitName: 'qt', toUnitName: 'oz', factor: 32 },
      { fromUnitName: 'gal', toUnitName: 'oz', factor: 128 },
      { fromUnitName: 'l', toUnitName: 'oz', factor: 33.814 },
      { fromUnitName: 'cl', toUnitName: 'oz', factor: 0.33814 },
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
