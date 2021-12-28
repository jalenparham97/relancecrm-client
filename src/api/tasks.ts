import { useMutation, useQueryClient, useQuery, useInfiniteQuery, InfiniteData } from 'react-query';
import { tasksService } from '@/services/tasks.service';
import { PaginationParams, ServiceResponse, Task, TaskResponse, UpdateParams } from '@/types';

const queryKey = 'tasks';
const service = tasksService;

export const useTasks = (filter?: Partial<Task>, paginationParams?: PaginationParams) => {
  const queryClient = useQueryClient();

  const fetchData = async (pageParam?: string) => {
    const data = await service.find<Task>(filter, { startId: pageParam });
    return data;
  };
  const {
    isLoading,
    data: tasks,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(queryKey, async ({ pageParam }) => await fetchData(pageParam), {
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length > 0) {
        return lastPage.data[lastPage.data.length - 1]?._id;
      }
      return false;
    },
  });

  let allItems = [];

  console.log({ tasks });

  if (tasks) {
    // allItems = tasks?.pages
    //   .map((page) => page.data.map((item) => item))
    //   .reduce((items, item) => items.concat(item));
  }

  const data: ServiceResponse<Task> = { total: 0, data: allItems };

  console.log({ data });

  queryClient.setQueryData(queryKey, data);

  return { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage };
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
