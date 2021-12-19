import { Service } from './service';
import { CreateProject, Project, ServiceResponse } from '@/types';
import { axios } from '@/libs/axios';

class ProjectsService extends Service<Project> {
  async createProject(createData: CreateProject) {
    const { data } = await axios.post<Project>(`/${this.service}`, createData);
    return data;
  }

  async findAllClientProjects(clientId: string) {
    const { data } = await axios.get<ServiceResponse<Project>>(`/${this.service}/client`, {
      params: { clientId },
    });
    return data;
  }
}

export const projectsService = new ProjectsService('projects');
