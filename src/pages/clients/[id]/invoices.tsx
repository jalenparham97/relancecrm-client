import { useRouter } from 'next/router';
import { useClient } from '@/api/clients';
import ClientPageContainer from '@/components/clients/ClientPageContainer';
import ClientTasksWidget from '@/components/clients/ClientTasksWidget';
import ClientInvoicesWidget from '@/components/clients/ClientInvoicesWidget';

export default function ClientPageInvoices() {
  const router = useRouter();
  const query = router.query;
  const { data: client, isLoading } = useClient(query.id as string);

  return (
    <ClientPageContainer client={client} isLoading={isLoading}>
      <ClientInvoicesWidget id={query.id as string} client={client} />
    </ClientPageContainer>
  );
}
