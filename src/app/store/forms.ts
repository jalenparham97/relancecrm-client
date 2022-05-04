import { atom } from 'recoil';
import { Form } from '@/core/types';

export const selectedElementState = atom<string | number>({
  key: 'selectedElementState',
  default: '',
});

export const selectedBlockState = atom<string | number>({
  key: 'selectedBlockState',
  default: '',
});

export const formState = atom<Form>({
  key: 'formState',
  default: {},
});
