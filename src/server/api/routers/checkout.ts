import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import Stripe from "stripe";

// eslint-disable-next-line
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export const checkoutRouter = createTRPCRouter({
  createPayment: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = input;
      const userCart = await ctx.prisma.cart.findMany({
        where: { userId },
        include: {
          dish: {
            select: {
              stripe_api_id: true,
            },
          },
        },
      });

      const stripeData = userCart.map((item) => {
        return { price: item.dish.stripe_api_id, quantity: item.quantity };
      });

      const session = await stripe.checkout.sessions.create({
        line_items: stripeData,
        mode: "payment",
        // eslint-disable-next-line
        success_url: process.env.SUCCESS_URL!,
        // eslint-disable-next-line
        cancel_url: process.env.CANCEL_URL!,
      });

      return { url: session.url };
    }),
});
