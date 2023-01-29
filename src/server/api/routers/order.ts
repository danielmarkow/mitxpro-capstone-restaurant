import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";

export const orderRouter = createTRPCRouter({
  createOrders: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = input;

      const userCart = await ctx.prisma.cart.findMany({
        where: { userId },
        include: {
          dish: {
            select: {
              price: true,
            },
          },
        },
      });

      const orders = userCart.map((item) => {
        return ctx.prisma.order.create({
          data: {
            user: {
              connect: { id: item.userId },
            },
            dish: {
              connect: { stripe_api_id: item.dishId },
            },
            quantity: item.quantity,
            price: item.dish.price,
          },
        });
      });

      const ordersCreated = await ctx.prisma.$transaction(orders);

      if (ordersCreated) {
        const cartItemsToDelete = userCart.map((item) => {
          return ctx.prisma.cart.delete({
            where: { id: item.id },
          });
        });

        const deletedCartItems = await ctx.prisma.$transaction(
          cartItemsToDelete
        );

        return ordersCreated;
      }

      throw new TRPCError({
        code: "FORBIDDEN",
        message: "cart item not found or is not accessable",
      });
    }),
  getOrders: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      const { userId } = input;
      return ctx.prisma.order.findMany({
        where: { userId },
        include: {
          dish: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    }),
});
