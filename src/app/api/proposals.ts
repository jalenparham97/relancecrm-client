import { useMutation, useQueryClient, useQuery } from 'react-query';
import { proposalsService } from '@/app/services/proposals.service';
import {
  CreateProposal,
  HttpStatus,
  Proposal,
  ProposalEmailData,
  ServiceResponse,
} from '@/core/types';
import { useState } from 'react';
import { useRouter } from 'next/router';

const queryKey = 'proposals';
const service = proposalsService;

export const useProposals = () => {
  const fetchData = async () => {
    const data = await service.find<Proposal>();
    return data;
  };
  return useQuery(queryKey, fetchData);
};

export const useProposalsClient = (clientId: string) => {
  const fetchData = async () => {
    const data = await service.findAllClientProposals(clientId);
    return data;
  };
  return useQuery(`${queryKey}/${clientId}`, fetchData);
};

export const useProposalsProject = (projectId: string) => {
  const fetchData = async () => {
    const data = await service.findAllProjectProposals(projectId);
    return data;
  };
  return useQuery(`${queryKey}/${projectId}`, fetchData);
};

export const useProposal = (id: string) => {
  const fetchData = async () => {
    const data: Proposal = await service.get(id);
    return data;
  };
  return useQuery<Proposal>(id, fetchData);
};

export const useProposalView = (id: string) => {
  const fetchData = async () => {
    const data: Proposal = await service.findProposalView(id);
    return data;
  };
  return useQuery<Proposal>(id, fetchData);
};

export const useProposalAddMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: CreateProposal) => await proposalsService.createProposal(data),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(queryKey);
        const previousQueryData =
          queryClient.getQueryData<ServiceResponse<Proposal>>(queryKey);
        return { previousQueryData };
      },
      onSuccess: async (
        newEntity: Proposal,
        _,
        { previousQueryData }: { previousQueryData }
      ) => {
        queryClient.setQueryData<ServiceResponse<Proposal>>(queryKey, {
          total: previousQueryData.total + 1,
          data: [newEntity, ...previousQueryData.data],
        });
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<ServiceResponse<Proposal>>(
            queryKey,
            context.previousQueryData
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export const useProposalUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: CreateProposal) =>
      await service.patch<Proposal>(id, data as Proposal),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(id);
        const previousQueryData = queryClient.getQueryData<Proposal>(id);
        return { previousQueryData };
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<Proposal>(id, context.previousQueryData);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(id);
      },
    }
  );
};

export const useProposalUpdateStatusMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: CreateProposal) =>
      await service.patch<Proposal>(id, data as Proposal),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(queryKey);
        const previousQueryData = queryClient.getQueryData<Proposal>(queryKey);
        return { previousQueryData };
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<Proposal>(
            queryKey,
            context.previousQueryData
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
};

export const useProposalDeleteManyMutation = (ids: string[]) => {
  const queryClient = useQueryClient();

  return useMutation(async () => await proposalsService.removeMany(ids), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Proposal[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Proposal[]>(
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

export const useProposalDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (id: string) => await proposalsService.remove(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(queryKey);
      const previousQueryData = queryClient.getQueryData<Proposal[]>(queryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Proposal[]>(
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

export const useProposalIdAddMutation = (id: string) => {
  const queryClient = useQueryClient();
  const proposalQueryKey = `${queryKey}/${id}`;

  return useMutation(
    async (data: CreateProposal) => await proposalsService.createProposal(data),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(proposalQueryKey);
        const previousQueryData =
          queryClient.getQueryData<ServiceResponse<Proposal>>(proposalQueryKey);
        return { previousQueryData };
      },
      onSuccess: async (
        newEntity: Proposal,
        _,
        { previousQueryData }: { previousQueryData }
      ) => {
        queryClient.setQueryData<ServiceResponse<Proposal>>(proposalQueryKey, {
          total: previousQueryData.total + 1,
          data: [newEntity, ...previousQueryData.data],
        });
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<ServiceResponse<Proposal>>(
            proposalQueryKey,
            context.previousQueryData
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(proposalQueryKey);
      },
    }
  );
};

export const useProposalIdUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();
  const proposalQueryKey = `${queryKey}/${id}`;

  return useMutation(
    async (data: CreateProposal) =>
      await service.patch<Proposal>(id, data as Proposal),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(proposalQueryKey);
        const previousQueryData =
          queryClient.getQueryData<Proposal>(proposalQueryKey);
        return { previousQueryData };
      },
      onError: (error, _, context) => {
        console.log(error);
        if (context?.previousQueryData) {
          queryClient.setQueryData<Proposal>(
            proposalQueryKey,
            context.previousQueryData
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(proposalQueryKey);
      },
    }
  );
};

export const useProposalIdDeleteMutation = (id: string) => {
  const queryClient = useQueryClient();
  const proposalQueryKey = `${queryKey}/${id}`;

  return useMutation(async (id: string) => await proposalsService.remove(id), {
    onMutate: async () => {
      await queryClient.cancelQueries(proposalQueryKey);
      const previousQueryData =
        queryClient.getQueryData<Proposal[]>(proposalQueryKey);
      return { previousQueryData };
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<Proposal[]>(
          proposalQueryKey,
          context.previousQueryData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(proposalQueryKey);
    },
  });
};

export const useProposalSendTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetError = () => {
    setError(null);
  };

  const sendTestProposal = async (emailData: ProposalEmailData) => {
    try {
      setIsLoading(true);
      const response = await service.sendTestProposalEmail(emailData);
      if (response.status === HttpStatus.OK) {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  return { sendTestProposal, error, resetError, isLoading };
};

export const useProposalSend = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetError = () => {
    setError(null);
  };

  const sendProposal = async (emailData: ProposalEmailData) => {
    try {
      setIsLoading(true);
      const response = await service.sendProposalEmail(emailData);
      if (response.status === HttpStatus.OK) {
        setIsLoading(false);
        router.push('/proposals');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  return { sendProposal, error, resetError, isLoading };
};
