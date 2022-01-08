import { useRouter } from 'next/router';
import { useProject } from '@/api/projects';
import ProjectPageShell from '@/components/projects/ProjectPageShell';
import ProjectTasksWidget from '@/components/projects/ProjectTasksWidget';

export default function ProjectPage() {
  const router = useRouter();
  const query = router.query;
  const { data: project, isLoading } = useProject(query.id as string);

  console.log({ queryId: query.id });

  return (
    <ProjectPageShell project={project} isLoading={isLoading}>
      <ProjectTasksWidget id={query.id as string} />
    </ProjectPageShell>
  );
}
