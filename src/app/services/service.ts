import { axios } from '@/app/libs/axios';
import { ServiceResponse } from '@/core/types';

export class Service<S> {
  constructor(protected service: string) {}

  async find<T>(filter: Partial<T> | {} = {}) {
    const { data } = await axios.get<ServiceResponse<T>>(`/${this.service}`, {
      params: { filter },
    });
    return data;
  }

  async get<T>(id: string) {
    const { data } = await axios.get<T>(`/${this.service}/${id}`);
    return data;
  }

  async create<T>(createData?: S) {
    const { data } = await axios.post<T>(`/${this.service}`, createData);
    return data;
  }

  async patch<T>(id: string, updateData: S) {
    const { data } = await axios.patch<T>(`/${this.service}/${id}`, updateData);
    return data;
  }

  async removeMany(ids: string[]) {
    return await axios.delete(`/${this.service}`, { params: { ids } });
  }

  async remove(id: string) {
    return await axios.delete(`/${this.service}/${id}`);
  }
}
