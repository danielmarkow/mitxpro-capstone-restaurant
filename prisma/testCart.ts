import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Cart {
  userId: string;
  dishId: string;
  quantity: number;
}

const cartContent: Array<Cart> = [
  {
    userId: "cld7rk4t40000ps0h9stuxahw",
    dishId: "price_1MTOQOFxWqY7tc2qU3G0ofgJ",
    quantity: 2,
  },
  {
    userId: "cld7rk4t40000ps0h9stuxahw",
    dishId: "price_1MTOPjFxWqY7tc2qCbFausOM",
    quantity: 2,
  },
];

async function run() {
  const createCartContent = cartContent.map((cart) =>
    prisma.cart.create({
      data: {
        quantity: cart.quantity,
        user: { connect: { id: cart.userId } },
        dish: { connect: { stripe_api_id: cart.dishId } },
      },
    })
  );

  const myCart = await prisma.$transaction(createCartContent);
}

run().catch((error) => console.log(error));
