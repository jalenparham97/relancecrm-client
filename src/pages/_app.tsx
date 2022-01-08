import Head from 'next/head';
import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from '@/libs/react-query';
import { NotificationsProvider } from '@mantine/notifications';
import { DebugObserver } from 'store';
import { ThemeProvider } from 'theme';
import '../styles/globals.css';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Relance CRM</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <QueryClientProvider>
        <RecoilRoot>
          <DebugObserver />
          <ThemeProvider>
            <NotificationsProvider zIndex={3000} position="top-right">
              <Component {...pageProps} />
            </NotificationsProvider>
          </ThemeProvider>
        </RecoilRoot>
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </>
  );
}
