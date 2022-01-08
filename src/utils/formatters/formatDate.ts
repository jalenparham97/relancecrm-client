import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format = 'MMM DD, YYYY') => {
  return dayjs(date).format(format);
};
