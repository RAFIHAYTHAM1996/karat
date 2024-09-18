"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import Stripe from "stripe";

import {
  STRIPE_API_KEY,
  STRIPE_AUTHORIZATIONS_LIST_LIMIT,
  STRIPE_CARD_NUMBER,
  __DEV__,
} from "@/app/api/environment";

const stripe = new Stripe(STRIPE_API_KEY);

const CACHE_TAG = "authorizations";

export const invalidateCachedAuthorizations = () => {
  __DEV__ && console.log("== clearing", CACHE_TAG);
  revalidateTag(CACHE_TAG);
};

export const getAuthorizations = unstable_cache(
  async ({ startingAfter }: { startingAfter?: string }) => {
    return JSON.stringify(
      await stripe.issuing.authorizations.list({
        card: STRIPE_CARD_NUMBER,
        limit: STRIPE_AUTHORIZATIONS_LIST_LIMIT,
        starting_after: startingAfter,
        status: "closed",
      })
    );
  },
  ["authorizations"],
  { revalidate: 3600, tags: [CACHE_TAG] }
);
