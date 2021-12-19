import { axios } from '@/libs/axios';
import { Service } from './service';
import { Integration, User } from '@/types';

class UsersService extends Service<User> {
  async updateIntegrations(id: string, integration: Integration) {
    const { data } = await axios.patch<User>(`/${this.service}/${id}/integrations`, {
      integration,
    });
    return data;
  }
}

export const usersService = new UsersService('users');
