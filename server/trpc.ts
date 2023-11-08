import type { Context } from './context';

import { TRPCError, initTRPC } from '@trpc/server';

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;

const secure = middleware(async ({ ctx, next }) => {
  if (!ctx.userHash) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      userHash: ctx.userHash,
    },
  });
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const procedure = t.procedure.use(secure);
