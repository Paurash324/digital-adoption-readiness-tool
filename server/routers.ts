import { COOKIE_NAME } from "@shared/const";
import { createReadinessSubmission } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  readiness: router({
    submit: publicProcedure
      .input(z.object({
        language: z.enum(["en", "hi", "pa"]),
        answers: z.record(z.string(), z.enum(["always", "sometimes", "rarely", "never"])),
        categoryScores: z.array(z.object({
          category: z.string(),
          score: z.number().int(),
          max: z.number().int(),
          percent: z.number().int(),
        })),
        totalScore: z.number().int(),
        maxScore: z.number().int(),
        percent: z.number().int(),
      }))
      .mutation(async ({ input }) => {
        return createReadinessSubmission({
          language: input.language,
          answersJson: JSON.stringify(input.answers),
          categoryScoresJson: JSON.stringify(input.categoryScores),
          totalScore: input.totalScore,
          maxScore: input.maxScore,
          percent: input.percent,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
