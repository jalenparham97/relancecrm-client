import { isEmpty } from 'lodash';
import { formatDate } from '@/app/utils';
import { FormResponse } from '@/core/types';

export const formatResponses = (responses: FormResponse[]) => {
  if (!isEmpty(responses)) {
    return responses.map((response) => ({
      ...response,
      id: response._id,
      createdAt: formatDate(response.createdAt),
    }));
  }
  return [];
};
