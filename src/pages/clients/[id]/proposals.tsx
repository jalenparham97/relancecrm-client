import { useRouter } from 'next/router';
import { useClient } from '@/app/api/clients';
import ClientPageContainer from '@/app/components/clients/ClientPageContainer';
import ClientTasksWidget from '@/app/components/clients/ClientTasksWidget';

export default function ClientPageProposals() {
  const router = useRouter();
  const query = router.query;
  const { data: client, isLoading } = useClient(query.id as string);

  return (
    <ClientPageContainer client={client} isLoading={isLoading}>
      {/* <ClientTasksWidget id={query.id as string} /> */}
    </ClientPageContainer>
  );
}
