export * from './user.types';
export * from './payment.types';
export * from './invoice.types';
export * from './auth.types';
export * from './integration.types';
export * from './client.types';
export * from './project.types';
export * from './task.types';
export * from './http.types';

export type UpdateParams<T> = {
  id: string;
  data: T;
};

export type FormProps<T> = {
  onFormSubmit?: (data: T) => Promise<T | void>;
  loading?: boolean;
};

export type ServiceResponse<T> = {
  data: T[];
  limit?: number;
  skip?: number;
  total: number;
};

export type PaginationParams = {
  startId?: string;
  skip?: number;
  limit?: number;
};
