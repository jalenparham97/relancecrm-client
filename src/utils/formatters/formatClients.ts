import { isEmpty } from 'lodash';
import { formatDate } from '@/utils';
import { Client } from '@/types';

export const formatClients = (clients: Client[]) => {
  if (!isEmpty(clients)) {
    return clients.map((client) => ({
      id: client._id,
      fullName: client.fullName,
      initials: client.initials,
      email: client.email || '-',
      phone: client.phone || '-',
      company: client.company || '-',
      website: client.website || '-',
      createdAt: formatDate(client.createdAt),
      backgroundColor: client.backgroundColor,
    }));
  }
  return [];
};
