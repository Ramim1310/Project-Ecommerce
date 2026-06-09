const prisma = require('../config/db.js');

async function main() {
  console.log('--- Seeding mock products ---');
  
  const mockProducts = [
    {
      category: 'Audio',
      brand: 'HyperX',
      name: 'Cloud II Wireless',
      description: 'Legendary comfort goes wireless.',
      specifications: { driver: '53mm', connection: '2.4GHz Wireless', battery: '30 hours' },
      variants: [
        { sku: 'HYP-CL2W-RED', variantName: 'Red/Black', price: 149.99, stock: 25, isDefault: true, images: ['https://www.startech.com.bd/image/cache/catalog/headphone/hyperx/cloud-ii-wireless/cloud-ii-wireless-01-500x500.jpg'] }
      ]
    },
    {
      category: 'Audio',
      brand: 'SteelSeries',
      name: 'Arctis Nova Pro Wireless',
      description: 'Almighty audio for gaming.',
      specifications: { driver: '40mm Neodymium', connection: 'Bluetooth/2.4GHz', anc: 'Active Noise Cancellation' },
      variants: [
        { sku: 'SS-NOVA-PRO-BLK', variantName: 'Black', price: 349.99, stock: 10, isDefault: true, images: ['https://www.startech.com.bd/image/cache/catalog/headphone/steelseries/arctis-nova-pro-wireless/arctis-nova-pro-wireless-01-500x500.jpg'] }
      ]
    },
    {
      category: 'Monitors',
      brand: 'LG',
      name: 'UltraGear 27GL850-B',
      description: '27 inch QHD Nano IPS 1ms 144Hz Gaming Monitor.',
      specifications: { resolution: '2560x1440', refresh_rate: '144Hz', panel: 'Nano IPS', response_time: '1ms' },
      variants: [
        { sku: 'LG-27GL850', variantName: 'Standard', price: 399.99, stock: 15, isDefault: true, images: ['https://www.startech.com.bd/image/cache/catalog/monitor/lg-monitor/27gl850/27gl850-01-500x500.jpg'] }
      ]
    },
    {
      category: 'Monitors',
      brand: 'ASUS',
      name: 'ROG Swift PG259QN',
      description: 'The world\'s first 360Hz esports gaming monitor.',
      specifications: { resolution: '1920x1080', refresh_rate: '360Hz', panel: 'Fast IPS', response_time: '1ms' },
      variants: [
        { sku: 'ASUS-PG259QN', variantName: 'Standard', price: 699.99, stock: 5, isDefault: true, images: ['https://www.startech.com.bd/image/cache/catalog/monitor/asus/pg259qn/pg259qn-01-500x500.jpg'] }
      ]
    },
    {
      category: 'Laptops',
      brand: 'Razer',
      name: 'Blade 15 Advanced',
      description: 'Ultra-fast. Ultra-small. Ultra-powerful.',
      specifications: { cpu: 'Intel i7-12800H', gpu: 'RTX 3070 Ti', ram: '16GB DDR5', storage: '1TB NVMe' },
      variants: [
        { sku: 'RAZ-BLD15-3070TI', variantName: 'QHD 240Hz', price: 2499.99, stock: 8, isDefault: true, images: ['https://www.startech.com.bd/image/cache/catalog/laptop/razer/blade-15/blade-15-01-500x500.jpg'] }
      ]
    },
    {
      category: 'Chairs',
      brand: 'Secretlab',
      name: 'TITAN Evo 2022 Series',
      description: 'The award-winning gaming chair.',
      specifications: { material: 'Neo Hybrid Leatherette', size: 'Regular', mechanism: 'Multi-tilt' },
      variants: [
        { sku: 'SEC-TITAN-EVO-BLK', variantName: 'Stealth', price: 549.00, stock: 20, isDefault: true, images: ['https://www.startech.com.bd/image/cache/catalog/gaming-chair/secretlab/titan-evo-2022-stealth/titan-evo-2022-stealth-01-500x500.jpg'] }
      ]
    },
    {
      category: 'Accessories',
      brand: 'Elgato',
      name: 'Stream Deck MK.2',
      description: '15 customizable LCD keys to control apps and platforms.',
      specifications: { keys: '15 LCD Keys', interface: 'USB-C' },
      variants: [
        { sku: 'ELG-STRMDK-MK2', variantName: 'Black', price: 149.99, stock: 40, isDefault: true, images: ['https://www.startech.com.bd/image/cache/catalog/stream-deck/elgato/stream-deck-mk2/stream-deck-mk2-01-500x500.jpg'] }
      ]
    }
  ];

  for (const productData of mockProducts) {
    const { category, variants, ...productInfo } = productData;
    
    // Find category
    const catRecord = await prisma.category.findUnique({ where: { name: category } });
    if (!catRecord) {
      console.warn(`Category ${category} not found. Skipping product ${productInfo.name}.`);
      continue;
    }

    // Upsert product (using name as identifier for simplicity of seeding)
    // Wait, Prisma doesn't let us upsert by non-unique field easily unless we have a unique constraint on name.
    // Let's check if there is an existing product with this name first.
    const existingProduct = await prisma.product.findFirst({ where: { name: productInfo.name } });
    
    let productId;
    if (existingProduct) {
      console.log(`Product ${productInfo.name} already exists.`);
      productId = existingProduct.id;
    } else {
      console.log(`Creating product ${productInfo.name}...`);
      const newProduct = await prisma.product.create({
        data: {
          ...productInfo,
          categoryId: catRecord.id,
        }
      });
      productId = newProduct.id;
    }

    // Insert variants
    for (const v of variants) {
      const existingVariant = await prisma.productVariant.findUnique({ where: { sku: v.sku } });
      if (!existingVariant) {
        await prisma.productVariant.create({
          data: {
            ...v,
            productId: productId
          }
        });
      }
    }
  }

  console.log('--- Finished seeding mock products ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
