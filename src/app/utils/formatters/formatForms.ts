import { isEmpty } from 'lodash';
import { formatDate } from '@/app/utils';
import { Form } from '@/core/types';

export const formatForms = (forms: Form[]) => {
  if (!isEmpty(forms)) {
    return forms.map((form) => ({
      ...form,
      id: form._id,
      createdAt: formatDate(form.createdAt),
      updatedAt: formatDate(form.updatedAt),
    }));
  }
  return [];
};
