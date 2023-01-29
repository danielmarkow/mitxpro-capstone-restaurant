import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Dish {
  stripe_api_id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  restaurantId: string;
}

const dishes: Array<Dish> = [
  {
    stripe_api_id: "price_1MTOOGFxWqY7tc2qt4Owhp7z",
    name: "steak",
    description: "organic beef ribeye",
    image: "mono-steak.jpg",
    price: 49.99,
    restaurantId: "cldhqul5c0000psub60zlgdlu",
  },
  {
    stripe_api_id: "price_1MTOPEFxWqY7tc2qicI2JAKQ",
    name: "sushi",
    description: "mono sushi selection extra fresh",
    image: "mono-sushi.jpg",
    price: 62.99,
    restaurantId: "cldhqul5c0000psub60zlgdlu",
  },
  {
    stripe_api_id: "price_1MTOPjFxWqY7tc2qCbFausOM",
    name: "salat",
    description: "vietnamese style salat with beef",
    image: "littlehanoi-salat.jpg",
    price: 18.99,
    restaurantId: "cldhqul5d0002psubab4df3p0",
  },
  {
    stripe_api_id: "price_1MTOQOFxWqY7tc2qU3G0ofgJ",
    name: "pho soup",
    description: "vietnamese style pho soup, extra chili",
    image: "littlehanoi-pho.jpg",
    price: 14.45,
    restaurantId: "cldhqul5d0002psubab4df3p0",
  },
  {
    stripe_api_id: "price_1MTOROFxWqY7tc2qe00gzb1n",
    name: "chicken with knoedel",
    description: "half a roasted chicken with knoedel and kraut",
    image: "heinrich-bird.jpg",
    price: 28.75,
    restaurantId: "cldhqul5d0004psubh8s0rrc6",
  },
  {
    stripe_api_id: "price_1MTORzFxWqY7tc2qfLfW7shH",
    name: "traditional pork steak",
    description: "pork with side dishes",
    image: "heinrich-steak.jpg",
    price: 39.99,
    restaurantId: "cldhqul5d0004psubh8s0rrc6",
  },
];

async function run() {
  const createDishes = dishes.map((dish) =>
    prisma.dish.create({
      data: {
        stripe_api_id: dish.stripe_api_id,
        name: dish.name,
        description: dish.description,
        image: dish.image,
        price: dish.price,
        restaurant: {
          connect: { id: dish.restaurantId },
        },
      },
    })
  );

  const dish = await prisma.$transaction(createDishes);
}

run().catch((error) => console.log(error));
