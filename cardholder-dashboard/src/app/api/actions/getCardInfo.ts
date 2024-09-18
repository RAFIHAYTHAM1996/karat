"use server";

import { unstable_cache } from "next/cache";
import Stripe from "stripe";

import { STRIPE_API_KEY, STRIPE_CARD_NUMBER } from "@/app/api/environment";

const stripe = new Stripe(STRIPE_API_KEY);

export const getCardInfo = unstable_cache(
  async () => {
    return JSON.stringify(
      await stripe.issuing.cards.retrieve(STRIPE_CARD_NUMBER)
    );
  },
  [STRIPE_CARD_NUMBER],
  { revalidate: 3600, tags: ["card"] }
);
