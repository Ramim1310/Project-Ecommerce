const prisma = require('../config/db.js');

async function main() {
  console.log('--- Seeding mock categories ---');
  const categories = ['Mice', 'Keyboards', 'Audio', 'Monitors', 'Laptops', 'Chairs', 'Desks', 'Accessories'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log('--- Finished seeding mock categories ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
