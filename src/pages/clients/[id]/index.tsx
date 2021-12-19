import { useRouter } from 'next/router';
import { useClient } from '@/api/clients';
import ClientPageContainer from '@/components/clients/ClientPageContainer';
import ClientTasksWidget from '@/components/clients/ClientTasksWidget';

export default function ClientPageTasks() {
  const router = useRouter();
  const query = router.query;
  const { data: client, isLoading } = useClient(query.id as string);

  return (
    <ClientPageContainer client={client} isLoading={isLoading}>
      <ClientTasksWidget id={query.id as string} />
    </ClientPageContainer>
  );
}
