import { useMutation, useQueryClient, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { usersService } from '@/services/users.service';
import { userState } from '@/store/store';
import { Integration, User } from '@/types';

const queryKey = 'users';
const service = usersService;

export const useUserUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();
  const setUser = useSetRecoilState(userState);

  return useMutation(async (data: User) => await service.patch<User>(id, data), {
    onMutate: async () => {
      await queryClient.cancelQueries(id);
      const previousQueryData = queryClient.getQueryData<User>(id);
      return { previousQueryData };
    },
    onSuccess: (newEntity: User) => {
      setUser(newEntity);
      toast.success('Account updated!');
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
