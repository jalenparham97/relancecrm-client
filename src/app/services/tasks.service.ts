import { Service } from './service';
import { ServiceResponse, Task } from '@/core/types';
import { axios } from '@/app/libs/axios';

class TasksService extends Service<Task> {
  async findAllClientTasks(clientId: string) {
    const { data } = await axios.get<ServiceResponse<Task>>(`/${this.service}/client`, {
      params: { clientId },
    });
    return data;
  }

  async findAllProjectTasks(projectId: string) {
    const { data } = await axios.get<ServiceResponse<Task>>(`/${this.service}/project`, {
      params: { projectId },
    });
    return data;
  }
}

export const tasksService = new TasksService('tasks');
