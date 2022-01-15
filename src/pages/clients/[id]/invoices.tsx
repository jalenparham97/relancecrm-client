import { useRouter } from 'next/router';
import { useClient } from '@/app/api/clients';
import ClientPageContainer from '@/app/components/clients/ClientPageContainer';
import ClientTasksWidget from '@/app/components/clients/ClientTasksWidget';
import ClientInvoicesWidget from '@/app/components/clients/ClientInvoicesWidget';

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
