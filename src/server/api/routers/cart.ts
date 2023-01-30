import { z } from "zod";
import { TRPCError } from "@trpc/server";
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
              stripe_api_id: true,
              name: true,
              price: true,
              image: true,
              description: true,
            },
          },
        },
      });
    }),
  addOne: protectedProcedure
    .input(z.object({ userId: z.string().optional(), dishId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, dishId } = input;
      // check if dish is already in the cart
      const cartItem = await ctx.prisma.cart.findFirst({
        where: {
          userId,
          dishId,
        },
      });

      if (cartItem) {
        return ctx.prisma.cart.update({
          where: { id: cartItem.id },
          data: {
            quantity: cartItem.quantity + 1,
          },
        });
      }

      return ctx.prisma.cart.create({
        data: {
          user: { connect: { id: userId } },
          dish: { connect: { stripe_api_id: dishId } },
          quantity: 1,
        },
      });
    }),
  removeOne: protectedProcedure
    .input(z.object({ userId: z.string().optional(), dishId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, dishId } = input;
      // check if dish is already in the cart
      const cartItem = await ctx.prisma.cart.findFirst({
        where: {
          userId,
          dishId,
        },
      });

      if (cartItem && cartItem.quantity > 1) {
        return ctx.prisma.cart.update({
          where: { id: cartItem.id },
          data: {
            quantity: cartItem.quantity - 1,
          },
        });
      }

      if (cartItem && cartItem.quantity === 1) {
        return ctx.prisma.cart.delete({
          where: { id: cartItem.id },
        });
      }

      if (!cartItem) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "cart item not found or is not accessable",
        });
      }
    }),
  deleteItem: protectedProcedure
    .input(z.object({ userId: z.string().optional(), dishId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, dishId } = input;
      // check if the item exists in the cart
      const cartItem = await ctx.prisma.cart.findFirst({
        where: {
          userId,
          dishId,
        },
      });

      if (cartItem) {
        return ctx.prisma.cart.delete({
          where: { id: cartItem.id },
        });
      }

      throw new TRPCError({
        code: "FORBIDDEN",
        message: "cart item not found or is not accessable",
      });
    }),
});
