import { useMutation, useQueryClient, useQuery } from 'react-query';
import { formsService } from '@/app/services/forms.service';
import { Form, ServiceResponse } from '@/core/types';

const queryKey = 'forms';
const service = formsService;

export const useForms = () => {
  const fetchData = async () => {
    const data = await service.find<Form>();
    return data;
  };
  return useQuery(queryKey, fetchData);
};

export const useForm = (id: string) => {
  const fetchData = async () => {
    const data: Form = await service.get(id);
    return data;
  };
  return useQuery<Form>(id, fetchData);
};

export const useFormAddMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (data: Form) => await service.create<Form>(data), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<ServiceResponse<Form>>(queryKey);
      return { previousQueryData };
    },
    onSuccess: async (newEntity: Form, _, { previousQueryData }) => {
      console.log(previousQueryData);
      queryClient.setQueryData<ServiceResponse<Form>>(queryKey, {
        total: previousQueryData.total + 1,
        data: [newEntity, ...previousQueryData.data],
      });
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<ServiceResponse<Form>>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useFormUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(async (data: Form) => await service.patch<Form>(id, data), {
    onMutate: async () => {
      await queryClient.cancelQueries(id);
      const previousQueryData = queryClient.getQueryData<Form>(id);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Form>(id, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(id);
    },
  });
};

export const useFormDeleteManyMutation = (ids: string[]) => {
  const queryClient = useQueryClient();

  return useMutation(async () => await service.removeMany(ids), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Form[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Form[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useFormDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (id: string) => await service.remove(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Form[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Form[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};
