import { Service } from './service';
import { Client } from '../@/types';

class ClientsService extends Service<Client> {}

export const clientsService = new ClientsService('clients');
