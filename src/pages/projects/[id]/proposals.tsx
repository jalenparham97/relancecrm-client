import { useRouter } from 'next/router';
import { useProject } from '@/app/api/projects';
import ProjectPageShell from '@/app/components/projects/ProjectPageShell';

export default function ProjectProposalsPage() {
  const router = useRouter();
  const query = router.query;
  const { data: project, isLoading } = useProject(query.id as string);

  return (
    <ProjectPageShell project={project} isLoading={isLoading}>
      {/* <ProjectTasksWidget id={query.id as string} /> */}
    </ProjectPageShell>
  );
}
