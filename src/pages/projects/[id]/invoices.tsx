import { useRouter } from 'next/router';
import { Box } from '@mantine/core';
import { useProject } from '@/app/api/projects';
import ProjectPageShell from '@/app/components/projects/ProjectPageShell';
import ProjectInvoicesWidget from '@/app/components/projects/ProjectInvoicesWidget';

export default function ProjectInvoicesPage() {
  const router = useRouter();
  const query = router.query;
  const { data: project, isLoading } = useProject(query.id as string);

  return (
    <ProjectPageShell project={project} isLoading={isLoading}>
      <ProjectInvoicesWidget id={query.id as string} project={project} />
    </ProjectPageShell>
  );
}
