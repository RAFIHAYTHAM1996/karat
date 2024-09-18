"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import Stripe from "stripe";

import {
  STRIPE_API_KEY,
  STRIPE_CARD_NUMBER,
  __DEV__,
} from "@/app/api/environment";
import { TransactionCategory, TransactionsSummary } from "@/app/api/types";

const stripe = new Stripe(STRIPE_API_KEY);
const CACHE_TAG = "transactions-summary";

export const invalidateCachedSummary = () => {
  __DEV__ && console.log("== clearing", CACHE_TAG);
  revalidateTag(CACHE_TAG);
};

export const getTransactionsSummary = unstable_cache(
  async (): Promise<TransactionsSummary> => {
    let allTransactions: Stripe.Issuing.Transaction[] = [];
    let startingAfter: string | undefined = undefined;

    while (true) {
      const result = await stripe.issuing.transactions.list({
        card: STRIPE_CARD_NUMBER,
        limit: 200,
        starting_after: startingAfter,
        type: "capture",
      });

      allTransactions = [...allTransactions, ...result.data];

      if (!result.has_more) break;
      startingAfter = allTransactions[allTransactions.length - 1].id;
    }

    const categories: Record<
      string,
      Omit<TransactionCategory, "category" | "percentage">
    > = {};

    let sum = 0;
    const totalCount = allTransactions.length;

    // Sum up all transactions and sum each category on its own
    allTransactions.forEach((tx) => {
      const sanitizedAmount = Math.abs(tx.amount);
      sum += sanitizedAmount;

      if (!categories[tx.merchant_data.category]) {
        categories[tx.merchant_data.category] = {
          amount: 0,
          count: 0,
        };
      }
      categories[tx.merchant_data.category].amount += sanitizedAmount;
      categories[tx.merchant_data.category].count += 1;
    });

    // Format transaction category breakdown list
    const categoryArray: TransactionCategory[] = Object.entries(categories)
      .map(([k, v]) => ({
        ...v,
        amount: v.amount / 100,
        category: k,
        percentage: Number((v.count / totalCount) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Divide by 100 to account for cents - assuming card currency is always USD
    sum /= 100;

    const average = sum / totalCount;

    return { average, categories: categoryArray, count: totalCount, sum };
  },
  [STRIPE_CARD_NUMBER],
  { revalidate: 3600, tags: [CACHE_TAG] }
);
