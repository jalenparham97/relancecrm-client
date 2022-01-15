import { InfiniteData } from 'react-query';
import { ServiceResponse } from '@/core/types';
import { getPageItemsCount } from '.';

export function hasNextPage<T>(items: InfiniteData<ServiceResponse<T>>) {
  const allItemsCount = getPageItemsCount<T>(items);
  return items?.pages[0]?.total !== allItemsCount;
}
