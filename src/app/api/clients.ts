import { useMutation, useQueryClient, useQuery } from 'react-query';
import { clientsService } from '@/app/services/clients.service';
import { Client, ServiceResponse } from '@/core/types';

const queryKey = 'clients';
const service = clientsService;

export const useClients = () => {
  const fetchData = async () => {
    const data = await service.find<Client>();
    return data;
  };
  return useQuery(queryKey, fetchData);
};

export const useClient = (id: string) => {
  const fetchData = async () => {
    const data: Client = await service.get(id);
    return data;
  };
  return useQuery<Client>(id, fetchData);
};

export const useClientAddMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (data: Client) => await service.create<Client>(data), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<ServiceResponse<Client>>(queryKey);
      return { previousQueryData };
    },
    onSuccess: async (newEntity: Client, _, { previousQueryData }) => {
      console.log(previousQueryData);
      queryClient.setQueryData<ServiceResponse<Client>>(queryKey, {
        total: previousQueryData.total + 1,
        data: [newEntity, ...previousQueryData.data],
      });
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<ServiceResponse<Client>>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useClientUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(async (data: Client) => await service.patch<Client>(id, data), {
    onMutate: async () => {
      await queryClient.cancelQueries(id);
      const previousQueryData = queryClient.getQueryData<Client>(id);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Client>(id, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(id);
    },
  });
};

export const useClientDeleteManyMutation = (ids: string[]) => {
  const queryClient = useQueryClient();

  return useMutation(async () => await service.removeMany(ids), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Client[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Client[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useClientDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (id: string) => await service.remove(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Client[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Client[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};
