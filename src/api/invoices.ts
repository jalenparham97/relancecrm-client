import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { invoicesService } from '@/services/invoices.service';
import { CreateInvoice, HttpStatus, Invoice, InvoiceEmailData, ServiceResponse } from '@/types';

const queryKey = 'invoices';
const service = invoicesService;

export const useInvoices = () => {
  const fetchData = async () => {
    const data = await service.find<Invoice>();
    return data;
  };
  return useQuery(queryKey, fetchData);
};

export const useInvoicesClient = (id: string) => {
  const fetchData = async () => {
    const data = await service.findAllClientInvoices(id);
    return data;
  };
  return useQuery(`${queryKey}/${id}`, fetchData);
};

export const useInvoicesProject = (id: string) => {
  const fetchData = async () => {
    const data = await service.findAllProjectInvoices(id);
    return data;
  };
  return useQuery(`${queryKey}/${id}`, fetchData);
};

export const useInvoice = (id: string) => {
  const fetchData = async () => {
    const data: Invoice = await service.get(id);
    return data;
  };
  return useQuery<Invoice>(id, fetchData);
};

export const useInvoicePay = (id: string) => {
  const fetchData = async () => {
    const data: Invoice = await service.getInvoicePay(id);
    return data;
  };
  return useQuery<Invoice>(id, fetchData);
};

export const useInvoiceAddMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (data: CreateInvoice) => await service.createInvoice(data), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<ServiceResponse<Invoice>>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<ServiceResponse<Invoice>>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useInvoiceUpdateMutation = <T>(id: string) => {
  const queryClient = useQueryClient();

  return useMutation(async (data: T) => await service.patch<Invoice>(id, data), {
    onMutate: async () => {
      await queryClient.cancelQueries(id);
      const previousQueryData = queryClient.getQueryData<T>(id);
      return { previousQueryData };
    },
    onSuccess: async () => {},
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<T>(id, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(id);
    },
  });
};

export const useInvoiceUpdatePopoverMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(async (data: Invoice) => await service.patch<Invoice>(id, data), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useInvoiceRemoveProjectMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(async () => await service.removeInvoiceProject(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(id);
      const previousQueryData = queryClient.getQueryData<Invoice>(id);
      return { previousQueryData };
    },
    onSuccess: async () => {},
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Invoice>(id, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(id);
    },
  });
};

export const useInvoiceDeleteManyMutation = (ids: string[]) => {
  const queryClient = useQueryClient();

  return useMutation(async () => await service.removeMany(ids), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Invoice[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Invoice[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useInvoiceDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (id: string) => await service.remove(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Invoice[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Invoice[]>(queryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useInvoiceIdUpdateMutation = <T>(id: string) => {
  const queryClient = useQueryClient();
  const invoicesQueryKey = `${queryKey}/${id}`;

  return useMutation(async (data: T) => await service.patch<Invoice>(id, data), {
    onMutate: async () => {
      await queryClient.cancelQueries(invoicesQueryKey);
      const previousQueryData = queryClient.getQueryData<T>(invoicesQueryKey);
      return { previousQueryData };
    },
    onSuccess: async () => {},
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<T>(invoicesQueryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(invoicesQueryKey);
    },
  });
};

export const useInvoiceIdDeleteMutation = (id: string) => {
  const queryClient = useQueryClient();
  const invoicesQueryKey = `${queryKey}/${id}`;

  return useMutation(async (invoiceId: string) => await service.remove(invoiceId), {
    onMutate: async () => {
      await queryClient.cancelQueries(invoicesQueryKey);
      const previousQueryData = queryClient.getQueryData<Invoice[]>(invoicesQueryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Invoice[]>(invoicesQueryKey, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(invoicesQueryKey);
    },
  });
};

export const useInvoiceSendTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetError = () => {
    setError(null);
  };

  const sendTest = async (invoice: Invoice) => {
    try {
      setIsLoading(true);
      const response = await service.sendTestInvoiceEmail(invoice);
      if (response.status === HttpStatus.CREATED) {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  return { sendTest, error, resetError, isLoading };
};

export const useInvoiceSend = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetError = () => {
    setError(null);
  };

  const send = async (emailData: InvoiceEmailData) => {
    try {
      setIsLoading(true);
      const response = await service.sendInvoiceEmail(emailData);
      if (response.status === HttpStatus.CREATED) {
        setIsLoading(false);
        router.push('/invoices');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  return { send, error, resetError, isLoading };
};
