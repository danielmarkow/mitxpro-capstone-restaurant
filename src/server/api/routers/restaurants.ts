import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  getRestaurants: publicProcedure.input(z.object({})).query(({ ctx }) => {
    return ctx.prisma.restaurant.findMany({});
  }),
});
