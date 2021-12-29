import { InfiniteData } from 'react-query';
import { ServiceResponse } from '@/types';

export const mergePaginatedResults = <T>(items: InfiniteData<ServiceResponse<T>>) => {
  return items.pages
    .map((page) => page.data.map((item) => item))
    .reduce((items, item) => items.concat(item));
};
