import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  getRestaurants: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.restaurant.findMany({});
  }),
});
