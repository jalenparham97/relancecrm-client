import { SubscriptionPlan } from '@/core/types';

export const config = {
  apiURL: process.env.NEXT_PUBLIC_API_URL,
  publicWebAppURL: process.env.NEXT_PUBLIC_WEB_APP_URL,
  webAppURL: process.env.WEB_APP_URL,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  pizzlyHost: process.env.NEXT_PUBLIC_PIZZLY_HOST,
  firebaseConfig: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  database: {
    uri: process.env.DB_URI,
    serverlessUri: process.env.SERVERLESS_DB_URI,
  },
  stripe: {
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    secretKey: process.env.STRIPE_SECRET_KEY,
    plans: {
      pro: {
        id: process.env.PRO_PLAN_ID,
        trialDays: 1,
        name: 'Pro' as SubscriptionPlan,
      },
    },
  },
  email: {
    apiUrl: process.env.EMAIL_API_URL,
    apiKey: process.env.EMAIL_API_KEY,
    emailFrom: 'no-reply@relancecrm.com',
    invoiceTestTemplateId: 'd-cb5c1bca499649d3b6e8472282069b49',
    invoiceTemplateId: '3z0vklo6enxl7qrx',
  },
};
