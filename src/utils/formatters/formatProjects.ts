import { isEmpty } from 'lodash';
import { formatDate } from '@/utils';
import { Project } from '@/types';

export const formatProjects = (projects: Project[]) => {
  if (!isEmpty(projects)) {
    return projects.map((project) => ({
      id: project._id,
      projectName: project.projectName || '-',
      endDate: project.endDate ? formatDate(project.endDate) : '-',
      status: project.status || '-',
      createdAt: formatDate(project.createdAt),
      initials: project.initials,
      backgroundColor: project.backgroundColor,
    }));
  }
  return [];
};
