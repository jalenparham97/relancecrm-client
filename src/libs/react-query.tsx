import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from 'react-query';

export const queryClient = new QueryClient();

export const QueryClientProvider = ({ children }) => {
  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>;
};
