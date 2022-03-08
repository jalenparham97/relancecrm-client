import { useMutation, useQueryClient, useQuery } from 'react-query';
import { responsesService } from '@/app/services/responses.service';
import { FormResponse, ServiceResponse } from '@/core/types';

const queryKey = 'responses';
const service = responsesService;

export const useResponses = (formId: string) => {
  const fetchData = async () => {
    const data = await service.findResponses<FormResponse>(formId);
    return data;
  };
  return useQuery(queryKey, fetchData);
};

export const useResponse = (id: string) => {
  const fetchData = async () => {
    const data: FormResponse = await service.get(id);
    return data;
  };
  return useQuery<FormResponse>(id, fetchData);
};

export const useResponseAddMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (data: FormResponse) => await service.create(data), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<ServiceResponse<FormResponse>>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<ServiceResponse<FormResponse>>(
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

export const useResponseDeleteManyMutation = (ids: string[]) => {
  const queryClient = useQueryClient();

  return useMutation(async () => await service.removeMany(ids), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<FormResponse[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<FormResponse[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useResponseDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (id: string) => await service.remove(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<FormResponse[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<FormResponse[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};
