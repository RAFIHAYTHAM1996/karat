# Karat Cardholder Dashboard

A dashboard for Karat cardholders that includes full card activity, metrics and a chart breaking down the relative frequency of transaction categories across all captured transactions

**Note**: This dashboard is built with [Next.js](https://nextjs.org); which is a framework built on top of React and NodeJs. It is recommended to familiarize yourself with its concepts - especially API and custom route setup - before proceeding.

## Demo

🎥 Download demo video [here](https://github.com/RAFIHAYTHAM1996/karat/blob/master/demo/cardholder-dashboard.mp4?raw=true)

📸 Screenshot
![Cardholder Dashboard](https://github.com/RAFIHAYTHAM1996/karat/blob/master/demo/cardholder-dashboard.png?raw=true)

## Architecture

### Backend

- All API results are cached using `unstable_cache` which is set to revalidate data every 1 hour, or when triggered by process (for ex. when a new authorization/transaction is created).
- API functions under `app/api/actions` are only accessible from within the codebase, and not publicly accessible through URLs. Also, their code & secrets is not visible to the front-end.
- Stripe events webhook is found at `app/api/webhook/stripe/route.ts`, which is a custom-route to handle `issuing_transaction.created` and `issuing_authorization.created` events.

### Frontend

3 main components:

- Greeting: fetches and displays the cardholder's first name, card's last 4 digits and expiration date
- DataTable: asynchronously fetches, merges and displays Authorization and Transaction data for the given card
- SummaryCard: fetches and displays total sum and average transaction amounts, as well as a chart breaking down the relative frequency of transaction categories across all captured transactions

## Getting Started

Enter the cardholder-dashboard directory and create the local configuration file:

```bash
cd cardholder-dashboard && touch .env.local
```

Copy-paste the following into `.env.local`, replacing all placeholder values with your own.
Stripe-related configuration can be retrieved from your [Stripe Dashboard](https://dashboard.stripe.com/login).

```
stripe_api_key=<<STRIPE_API_KEY>>
stripe_card_number=<<STRIPE_CARD_NUMBER>>
stripe_transactions_list_limit=20
stripe_authorizations_list_limit=20
stripe_webhook_key=<<STRIPE_WEBHOOK_KEY>>
```

Install dependencies

```bash
npm install
# or
yarn install
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The main entry point for the app is `app/page.tsx`, with the API endpoints and functions all located under `app/api`.

For testing Stripe events webhook locally, make sure you read comments inside [cardholder-dashboard/src/app/api/webhook/stripe/route.ts](https://github.com/RAFIHAYTHAM1996/karat/blob/master/cardholder-dashboard/src/app/api/webhook/stripe/route.ts) first.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
