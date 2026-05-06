import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // @ts-ignore
  apiVersion: '2024-04-10', // Latest stable API version
  appInfo: {
    name: 'Zoniraz Jewellery',
    version: '0.1.0',
  },
});
