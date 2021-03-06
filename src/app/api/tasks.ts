import { useMutation, useQueryClient, useQuery } from 'react-query';
import { tasksService } from '@/app/services/tasks.service';
import { ServiceResponse, Task, TaskResponse, UpdateParams } from '@/core/types';

const queryKey = 'tasks';
const service = tasksService;

export const useTasks = (filter?: Partial<Task>) => {
  const fetchData = async () => {
    const data = await service.find<Task>(filter);
    return data;
  };
  return useQuery(queryKey, fetchData);
};

export const useTasksClient = (id: string) => {
  const fetchData = async () => {
    const data = await service.findAllClientTasks(id);
    return data;
  };
  return useQuery(`${queryKey}/${id}`, fetchData);
};

export const useTasksProject = (id: string) => {
  const fetchData = async () => {
    const data = await service.findAllProjectTasks(id);
    return data;
  };
  return useQuery(`${queryKey}/${id}`, fetchData);
};

export const useTaskAddMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (newEntity: Task) => await service.create<TaskResponse>(newEntity), {
    onMutate: async (newEntity: Task) => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<ServiceResponse<TaskResponse>>(queryKey);
      return { previousQueryData };
    },
    onSuccess: async (newEntity: Task, _, { previousQueryData }) => {
      queryClient.setQueryData<ServiceResponse<TaskResponse>>(queryKey, {
        total: previousQueryData.total,
        data: [newEntity, ...previousQueryData.data],
      });
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<ServiceResponse<TaskResponse>>(
          queryKey,
          context.previousQueryData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useTaskUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, data }: UpdateParams<Task>) => await service.patch<Task>(id, data),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(queryKey);
        const previousQueryData = queryClient.getQueryData<Task[]>(queryKey);
        return { previousQueryData };
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<Task[]>(queryKey, context.previousQueryData);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export const useTaskDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (id: string) => await service.remove(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Task[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Task[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useTaskIdAddMutation = (id: string) => {
  const queryClient = useQueryClient();
  const tasksQueryKey = `${queryKey}/${id}`;

  return useMutation(async (newEntity: Task) => await service.create<TaskResponse>(newEntity), {
    onMutate: async (newEntity: Task) => {
      await queryClient.cancelQueries(tasksQueryKey);
      const previousQueryData =
        queryClient.getQueryData<ServiceResponse<TaskResponse>>(tasksQueryKey);
      return { previousQueryData };
    },
    onSuccess: async (newEntity: Task, _, { previousQueryData }) => {
      queryClient.setQueryData<ServiceResponse<TaskResponse>>(tasksQueryKey, {
        total: previousQueryData.total + 1,
        data: [newEntity, ...previousQueryData.data],
      });
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<ServiceResponse<TaskResponse>>(
          tasksQueryKey,
          context.previousQueryData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(tasksQueryKey);
    },
  });
};

export const useTaskIdUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();
  const tasksQueryKey = `${queryKey}/${id}`;

  return useMutation(
    async ({ id, data }: UpdateParams<Task>) => await service.patch<Task>(id, data),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(tasksQueryKey);
        const previousQueryData = queryClient.getQueryData<Task[]>(tasksQueryKey);
        return { previousQueryData };
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<Task[]>(tasksQueryKey, context.previousQueryData);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(tasksQueryKey);
      },
    }
  );
};

export const useTaskIdDeleteMutation = (id: string) => {
  const queryClient = useQueryClient();
  const tasksQueryKey = `${queryKey}/${id}`;

  return useMutation(async (taskId: string) => await service.remove(taskId), {
    onMutate: async () => {
      await queryClient.cancelQueries(tasksQueryKey);
      const previousQueryData = queryClient.getQueryData<Task[]>(tasksQueryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Task[]>(tasksQueryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(tasksQueryKey);
    },
  });
};
