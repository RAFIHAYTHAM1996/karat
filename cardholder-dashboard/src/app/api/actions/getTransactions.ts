"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import Stripe from "stripe";

import {
  STRIPE_API_KEY,
  STRIPE_CARD_NUMBER,
  STRIPE_TRANSACTIONS_LIST_LIMIT,
  __DEV__,
} from "@/app/api/environment";

const stripe = new Stripe(STRIPE_API_KEY);
const CACHE_TAG = "transactions";

export const invalidateCachedTransactions = () => {
  __DEV__ && console.log("== clearing", CACHE_TAG);
  revalidateTag(CACHE_TAG);
};

export const getTransactions = unstable_cache(
  async ({ startingAfter }: { startingAfter?: string }) => {
    return JSON.stringify(
      await stripe.issuing.transactions.list({
        card: STRIPE_CARD_NUMBER,
        limit: STRIPE_TRANSACTIONS_LIST_LIMIT,
        starting_after: startingAfter,
        type: "capture",
      })
    );
  },
  [CACHE_TAG],
  { revalidate: 3600, tags: [CACHE_TAG] }
);
