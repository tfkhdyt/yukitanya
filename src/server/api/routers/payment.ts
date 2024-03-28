import { and, eq, gt } from 'drizzle-orm';
import { z } from 'zod';

import { snap } from '@/lib/midtrans';
import { memberships } from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure } from '../trpc';

type InvoiceOpts = {
  price: number;
  duration: number;
  premiumType: string;
  user: {
    id: string;
    name: string;
  };
};

async function createInvoice({
  price,
  duration,
  premiumType,
  user,
}: InvoiceOpts) {
  try {
    const invoice = {
      transaction_details: {
        order_id: `${premiumType}_${duration}_${user.id}_${crypto
          .randomUUID()
          .slice(0, 5)}`,
        gross_amount: price,
      },
      item_details: [
        {
          id: premiumType,
          name: `${
            premiumType === 'standard' ? 'Premium' : 'Premium+'
          } Membership (${duration} bulan)`,
          quantity: 1,
          price,
        },
      ],
      customer_details: {
        first_name: user.name?.split(' ')[0],
        last_name: user.name?.split(' ').slice(1).join(' '),
      },
    };

    const token = await snap.createTransactionToken(invoice);

    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const paymentRouter = createTRPCRouter({
  getInvoiceToken: protectedProcedure
    .input(
      z.object({
        price: z.number(),
        duration: z.number(),
        premiumType: z.string(),
        user: z.object({
          id: z.string(),
          name: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [membership] = await ctx.db
        .select()
        .from(memberships)
        .where(
          and(
            eq(memberships.userId, input.user.id),
            gt(memberships.expiresAt, new Date()),
          ),
        )
        .limit(1);
      if (membership) {
        throw new Error('Kamu telah berlangganan!');
      }

      return createInvoice({
        user: {
          id: input.user.id,
          name: input.user.name,
        },
        premiumType: input.premiumType,
        duration: input.duration,
        price: input.price,
      });
    }),
});
