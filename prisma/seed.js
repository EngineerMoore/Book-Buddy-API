const prisma = require(`../prisma`);
const { faker } = require('@faker-js/faker');


const seed = async () => {
  const books = [];
  for (let i = 0; i < 10; i++) {
    books.push({title: faker.book.title()});
  }
  await prisma.book.createMany({ data: books })
};
seed()
  .then( async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });