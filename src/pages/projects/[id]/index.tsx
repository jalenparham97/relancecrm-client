import { useRouter } from 'next/router';
import { useProject } from '@/app/api/projects';
import ProjectPageShell from '@/app/components/projects/ProjectPageShell';
import ProjectOverviewWidget from '@/app/components/projects/ProjectOverviewWidget';

export default function ProjectPage() {
  const router = useRouter();
  const query = router.query;
  const { data: project, isLoading } = useProject(query.id as string);

  return (
    <ProjectPageShell project={project} isLoading={isLoading}>
      <ProjectOverviewWidget project={project} />
    </ProjectPageShell>
  );
}
