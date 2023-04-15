import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ingridientRouter = createTRPCRouter({
  getAllIngridients: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.ingridient.findMany();
  }),
});
