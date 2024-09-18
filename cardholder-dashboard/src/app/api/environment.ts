export const STRIPE_API_KEY = process.env.stripe_api_key ?? "";
export const STRIPE_CARD_NUMBER = process.env.stripe_card_number ?? "";
export const STRIPE_TRANSACTIONS_LIST_LIMIT =
  Number(process.env.stripe_transactions_list_limit) ?? 10;
export const STRIPE_AUTHORIZATIONS_LIST_LIMIT =
  Number(process.env.stripe_authorizations_list_limit) ?? 10;
export const STRIPE_WEBHOOK_KEY = process.env.stripe_webhook_key ?? "";
export const __DEV__ = process.env.NODE_ENV === "development";
