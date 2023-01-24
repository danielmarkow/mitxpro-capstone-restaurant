import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const dishesRouter = createTRPCRouter({
  getDishes: publicProcedure
    .input(
      z.object({
        restaurantId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      const { restaurantId } = input;
      return ctx.prisma.dish.findMany({
        where: {
          restaurantId,
        },
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      });
    }),
});
