import Head from 'next/head';
import { AppProps } from 'next/app';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/app/libs/stripe';
import { RecoilRoot } from 'recoil';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from '@/app/libs/react-query';
import { NotificationsProvider } from '@mantine/notifications';
import { DebugObserver } from '@/app/store';
import { ThemeProvider } from '@/app/theme';
import '@/app/styles/globals.css';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Relance CRM</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <Elements stripe={stripePromise}>
        <QueryClientProvider>
          <RecoilRoot>
            <DebugObserver />
            <ThemeProvider>
              <NotificationsProvider zIndex={3000} position="top-right">
                <Component {...pageProps} />
              </NotificationsProvider>
            </ThemeProvider>
          </RecoilRoot>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </Elements>
    </>
  );
}
