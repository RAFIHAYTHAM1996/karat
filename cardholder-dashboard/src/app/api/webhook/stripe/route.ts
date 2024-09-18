import { NextResponse } from "next/server";
import Stripe from "stripe";

import { invalidateCachedAuthorizations } from "@/app/api/actions/getAuthorizations";
import { invalidateCachedTransactions } from "@/app/api/actions/getTransactions";
import { invalidateCachedSummary } from "@/app/api/actions/getTransactionsSummary";
import {
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_KEY,
  __DEV__,
} from "@/app/api/environment";

const stripe = new Stripe(STRIPE_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = String(req.headers.get("stripe-signature"));

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_KEY);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  /**
   * With stripe-cli it's not possible to trigger 'issuing_transaction.created' event.
   * Therefore, we can simulate such events by overriding received event type 'issuing_transaction.created'.
   *
   * To test as a live webhook, you can comment out the below code and trigger the `issuing_transaction.created` or `issuing_authorization.created` event.
   * To test webhook locally, forward events to `stripe listen --forward-to localhost:3000/api/webhook/stripe` and;
   *  - For triggering `issuing_transaction.created`, run `stripe trigger customer.created`
   *  - For triggering `issuing_authorization.created`, run `stripe trigger account.updated`
   **/

  if (__DEV__) {
    /**
     * Casting 'as any' to prevent typescript errors.
     * This is only acceptable for local development purposes
     */
    switch (event.type) {
      case "customer.created":
        event.type = "issuing_transaction.created" as any;
        break;
      case "account.updated":
        event.type = "issuing_authorization.created" as any;
        break;
      default:
        break;
    }
  }

  switch (event.type) {
    case "issuing_transaction.created":
      invalidateCachedSummary();
      invalidateCachedTransactions();
      break;
    case "issuing_authorization.created":
      invalidateCachedAuthorizations();
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
