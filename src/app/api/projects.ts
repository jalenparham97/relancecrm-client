import { useMutation, useQueryClient, useQuery } from 'react-query';
import { projectsService } from '@/app/services/projects.service';
import { CreateProject, Project, ServiceResponse } from '@/core/types';

const queryKey = 'projects';
const service = projectsService;

export const useProjects = () => {
  const fetchData = async () => {
    const data = await service.find<Project>();
    return data;
  };
  return useQuery(queryKey, fetchData);
};

export const useProjectsClient = (id: string) => {
  const fetchData = async () => {
    const data = await service.findAllClientProjects(id);
    return data;
  };
  return useQuery(`${queryKey}/${id}`, fetchData);
};

export const useProject = (id: string) => {
  const fetchData = async () => {
    const data: Project = await service.get(id);
    return data;
  };
  return useQuery<Project>(id, fetchData);
};

export const useProjectAddMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (data: CreateProject) => await projectsService.createProject(data), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<ServiceResponse<Project>>(queryKey);
      return { previousQueryData };
    },
    onSuccess: async (newEntity: Project, _, { previousQueryData }: { previousQueryData }) => {
      queryClient.setQueryData<ServiceResponse<Project>>(queryKey, {
        total: previousQueryData.total + 1,
        data: [newEntity, ...previousQueryData.data],
      });
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<ServiceResponse<Project>>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useProjectUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: CreateProject) => await service.patch<Project>(id, data as Project),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(id);
        const previousQueryData = queryClient.getQueryData<Project>(id);
        return { previousQueryData };
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<Project>(id, context.previousQueryData);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(id);
      },
    }
  );
};

export const useProjectUpdateStatusMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: CreateProject) => await service.patch<Project>(id, data as Project),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(queryKey);
        const previousQueryData = queryClient.getQueryData<Project>(queryKey);
        return { previousQueryData };
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<Project>(queryKey, context.previousQueryData);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export const useProjectDeleteManyMutation = (ids: string[]) => {
  const queryClient = useQueryClient();

  return useMutation(async () => await projectsService.removeMany(ids), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Project[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Project[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useProjectDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (id: string) => await projectsService.remove(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Project[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Project[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useProjectIdAddMutation = (id: string) => {
  const queryClient = useQueryClient();
  const projectsQueryKey = `${queryKey}/${id}`;

  return useMutation(async (data: CreateProject) => await projectsService.createProject(data), {
    onMutate: async () => {
      await queryClient.cancelQueries(projectsQueryKey);
      const previousQueryData =
        queryClient.getQueryData<ServiceResponse<Project>>(projectsQueryKey);
      return { previousQueryData };
    },
    onSuccess: async (newEntity: Project, _, { previousQueryData }: { previousQueryData }) => {
      queryClient.setQueryData<ServiceResponse<Project>>(projectsQueryKey, {
        total: previousQueryData.total + 1,
        data: [newEntity, ...previousQueryData.data],
      });
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<ServiceResponse<Project>>(
          projectsQueryKey,
          context.previousQueryData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(projectsQueryKey);
    },
  });
};

export const useProjectIdUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();
  const projectsQueryKey = `${queryKey}/${id}`;

  return useMutation(
    async (data: CreateProject) => await service.patch<Project>(id, data as Project),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(projectsQueryKey);
        const previousQueryData = queryClient.getQueryData<Project>(projectsQueryKey);
        return { previousQueryData };
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<Project>(projectsQueryKey, context.previousQueryData);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(projectsQueryKey);
      },
    }
  );
};

export const useProjectIdDeleteMutation = (id: string) => {
  const queryClient = useQueryClient();
  const projectsQueryKey = `${queryKey}/${id}`;

  return useMutation(async (id: string) => await projectsService.remove(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(projectsQueryKey);
      const previousQueryData = queryClient.getQueryData<Project[]>(projectsQueryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Project[]>(projectsQueryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(projectsQueryKey);
    },
  });
};
