import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dishRouter = createTRPCRouter({
  getAllDishes: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.dish.findMany();
  }),
});
