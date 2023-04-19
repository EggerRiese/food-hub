import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const dishRouter = createTRPCRouter({
  getAllDishes: publicProcedure.query(async ({ ctx }) => {
    const dishes = await ctx.prisma.dish.findMany({
      take: 8,
    })
    return ctx.prisma.dish.findMany();
  }),

  getdishesByUserId: publicProcedure.input(z.object({
        userId: z.string(),
      }))
    .query(({ ctx, input }) =>
      ctx.prisma.dish.findMany({
          where: {
            authorId: input.userId,
          },
          take: 8,
        })

    ),

    create: privateProcedure.input(
      z.object({
        name: z.string().min(3),
        url: z.string().url("Only urls are allowed")
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      // const { success } = await ratelimit.limit(authorId);
      //if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const dish = await ctx.prisma.dish.create({
        data: {
          name: input.name,
          url: input.url,
          authorId,
        },
      });

      return dish;
    }),
});
