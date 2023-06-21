import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const ingridientRouter = createTRPCRouter({

    getAllIngridients: privateProcedure.query(async ({ctx}) => {
      const ingridients = await ctx.prisma.ingridient.findMany({
        where: {
          dish: {
            some: {
              authorId: ctx.userId,
            }
          }
        }
      })

      return ingridients;
    }),
});
