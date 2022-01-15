import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { usersService } from '@/app/services/users.service';
import { userState } from '@/app/store/store';
import { User } from '@/core/types';
import { useToasts } from '@/app/hooks';

const queryKey = 'users';
const service = usersService;

export const useUserUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();
  const setUser = useSetRecoilState(userState);
  const toasts = useToasts();

  return useMutation(async (data: User) => await service.patch<User>(id, data), {
    onMutate: async () => {
      await queryClient.cancelQueries(id);
      const previousQueryData = queryClient.getQueryData<User>(id);
      return { previousQueryData };
    },
    onSuccess: (newEntity: User) => {
      setUser(newEntity);
      toasts.success('Account updated!');
    },
    onError: (error, _, context) => {
      console.log(error);
      if (context?.previousQueryData) {
        queryClient.setQueryData<User>(id, context.previousQueryData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(id);
    },
  });
};
