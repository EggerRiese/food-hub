import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dishRouter = createTRPCRouter({
  getAllDishes: publicProcedure.query(async ({ ctx }) => {
    const dishes = await ctx.prisma.dish.findMany({
      take: 8,
    })
    return ctx.prisma.dish.findMany();
  }),
});
