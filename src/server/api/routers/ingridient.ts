import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const ingridientRouter = createTRPCRouter({

    getAllIngridients: privateProcedure.query(async ({ctx}) => {
      console.log(ctx.userId);
      const ingridients = await ctx.prisma.ingridient.findMany({
        where: {
          dish: {
            some: {
              authorId: ctx.userId,
            }
          }
        }
      })
      console.log(ingridients);

      return ingridients;
    }),
});
