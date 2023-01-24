import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const restaurants: { name: string; description: string; image: string }[] = [
  {
    name: "mono",
    description: "asian fusion in nice ambiance",
    image: "mono.jpg",
  },
  {
    name: "Litte Hanoi",
    description: "authentic vietnamese food",
    image: "littleHanoi.jpg",
  },
  {
    name: "Heinrich",
    description: "elevated german cousine",
    image: "heinrich.jpg",
  },
];

async function run() {
  const createRestaurants = restaurants.map((resto) =>
    prisma.restaurant.create({ data: resto })
  );

  const restaurant = await prisma.$transaction(createRestaurants);
  console.log(restaurant);
}

run();
