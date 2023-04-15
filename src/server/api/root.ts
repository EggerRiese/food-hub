import { createTRPCRouter } from "~/server/api/trpc";
import { dishRouter } from "./routers/dish";
import { ingridientRouter } from "./routers/ingridient";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dish: dishRouter,
  ingridient: ingridientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
