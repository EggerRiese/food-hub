import { Ingridient } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const dishRouter = createTRPCRouter({
  getDishById: privateProcedure
    .input(z.object({id: z.string().cuid()}))
    .query(async({ctx, input}) => {
      return await ctx.prisma.dish.findUnique({
        where: {
          id: input.id,
        },
        include: {
          ingridients: true,
        }
      })
    }),

  getDishesByUserId: privateProcedure
    .input(z.object({limit: z.number(),cursor: z.string().nullish()}))
    .query(async ({ ctx, input }) => {

      const { limit, cursor } = input;
      const dishes = await ctx.prisma.dish.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          authorId: ctx.userId,
        },
      });

      if (dishes.length < 8) {
        const d = await ctx.prisma.dish.findMany({
          take: 8 - dishes.length, 
          where: {
            authorId: ctx.userId,
          }
        });

        dishes.push(...d);
      }
      

      let nextCursor: typeof cursor | undefined = undefined;
      if (dishes.length > limit) {
        const nextItem = dishes.pop();
        nextCursor = nextItem?.id;
      }
      return {
        dishes,
        nextCursor,
      };
    },
  ),

  getDishesByIngridient: privateProcedure
    .input(z.object({limit: z.number(),
      cursor: z.string().nullish(), 
      ingridients: z.object({
        id: z.string(),
        name: z.string()
      }).array()
      }))
    .query(async ({ ctx, input }) => {

      const { limit, cursor, ingridients } = input;

      const findManyOrCondition = [];
      for (let i = 0; i < ingridients.length; i++) {
        // AND condition between part_num and color_id is implicit
        findManyOrCondition.push({ 
            id: ingridients[i]?.id
        });
    }

      const dishes = await ctx.prisma.dish.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          authorId: ctx.userId,
          ingridients: {
            some: {
              OR: findManyOrCondition,
            }
          },
        }
      });

      if (dishes.length < 4) {
        const d = await ctx.prisma.dish.findMany({
          take: 4 - dishes.length, 
          where: {
            authorId: ctx.userId,
            ingridients: {
              some: {
                OR: findManyOrCondition,
              }
            },
          }
        });

        dishes.push(...d);
      }
      

      let nextCursor: typeof cursor | undefined = undefined;
      if (dishes.length > limit) {
        const nextItem = dishes.pop();
        nextCursor = nextItem?.id;
      }

      return {
        dishes,
        nextCursor,
      };
    }
  ),

  create: privateProcedure
    .input(z.object({
        name: z.string().min(3, "Name to short"),
        url: z.string().url("Only urls are allowed")
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

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
