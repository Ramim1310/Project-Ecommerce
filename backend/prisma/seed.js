const prisma = require('../config/db.js');

async function main() {
  console.log('--- Starting Seed: The Nexus Catalog ---');

  // 1. CLEANUP: Optional but helpful - clear existing data to avoid unique SKU errors
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. CREATE CATEGORIES
  const mice = await prisma.category.create({ data: { name: 'Mice' } });
  const keyboards = await prisma.category.create({ data: { name: 'Keyboards' } });
  const audio = await prisma.category.create({ data: { name: 'Audio' } });
  const monitors = await prisma.category.create({ data: { name: 'Monitors' } });

  // 3. CREATE PRODUCT: LOGITECH G PRO X
  await prisma.product.create({
    data: {
      name: 'G Pro X Superlight 2',
      brand: 'Logitech',
      description: 'The world’s favorite championship-winning mouse, refined and improved.',
      categoryId: mice.id,
      specifications: {
        sensor: 'HERO 2',
        max_dpi: 32000,
        weight: '60g',
        connection: 'LIGHTSPEED Wireless'
      },
      variants: {
        create: [
          {
            sku: 'LOGI-GPX2-BLK',
            variantName: 'Carbon Black',
            price: 159.00,
            stock: 45,
            isDefault: true,
            images: ['https://www.startech.com.bd/image/cache/catalog/mouse/logitech/g-pro-wireless/g-pro-wireless-01-500x500.jpg']
          },
          {
            sku: 'LOGI-GPX2-WHT',
            variantName: 'Ghost White',
            price: 159.00,
            stock: 12,
            images: ['https://www.startech.com.bd/image/cache/catalog/mouse/logitech/g-pro-x-superlight/g-pro-x-superlight-white-500x500.jpg']
          }
        ]
      }
    }
  });

  // 4. CREATE PRODUCT: RAZER DEATHADDER V3
  await prisma.product.create({
    data: {
      name: 'DeathAdder V3 Pro',
      brand: 'Razer',
      description: 'Victory takes a new shape with the Razer DeathAdder V3 Pro.',
      categoryId: mice.id,
      specifications: {
        sensor: 'Focus Pro 30K',
        max_dpi: 30000,
        weight: '63g',
        polling_rate: '4000Hz'
      },
      variants: {
        create: [
          {
            sku: 'RAZ-DAV3-BLK',
            variantName: 'Razer Black',
            price: 149.99,
            stock: 30,
            isDefault: true,
            images: ['https://www.startech.com.bd/image/cache/catalog/mouse/razer/deathadder-v3-pro/deathadder-v3-pro-01-500x500.jpg']
          }
        ]
      }
    }
  });

  // 5. CREATE PRODUCT: KEYBOARD (Testing category scaling)
  await prisma.product.create({
    data: {
      name: 'SteelSeries Apex Pro TKL',
      brand: 'SteelSeries',
      description: 'The world’s fastest and most advanced keyboard.',
      categoryId: keyboards.id,
      specifications: {
        switch_type: 'OmniPoint 2.0',
        layout: 'TKL',
        actuation: '0.1mm - 4.0mm',
        rgb: 'Per-Key'
      },
      variants: {
        create: [
          {
            sku: 'SS-APEX-TKL-2023',
            variantName: 'Standard Edition',
            price: 189.99,
            stock: 15,
            isDefault: true,
            images: ['https://www.startech.com.bd/image/cache/catalog/keyboard/steelseries/apex-pro-tkl/apex-pro-tkl-01-500x500.jpg']
          }
        ]
      }
    }
  });

  console.log('--- Seed Finished Successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });