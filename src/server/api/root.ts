import { createTRPCRouter } from "./trpc";
// import { exampleRouter } from "./routers/example";
import { restaurantRouter } from "./routers/restaurants";
import { dishesRouter } from "./routers/dishes";
import { cartRouter } from "./routers/cart";
import { checkoutRouter } from "./routers/checkout";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  // example: exampleRouter,
  restaurants: restaurantRouter,
  dishes: dishesRouter,
  cart: cartRouter,
  checkout: checkoutRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
