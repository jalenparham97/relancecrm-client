import { InfiniteData } from 'react-query';
import { ServiceResponse } from '@/types';

export const getPageItemsCount = <T>(items: InfiniteData<ServiceResponse<T>>) => {
  let allItems = 0;

  items?.pages?.forEach((page) => {
    allItems += page.data.length;
  });

  return allItems;
};
