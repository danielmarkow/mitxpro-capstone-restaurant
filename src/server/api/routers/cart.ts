import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cartRouter = createTRPCRouter({
  getCart: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      const { userId } = input;
      return ctx.prisma.cart.findMany({
        where: { userId },
        include: {
          dish: {
            select: {
              name: true,
              price: true,
              image: true,
              description: true,
            },
          },
        },
      });
    }),
});
