import { TextInput } from '@mantine/core';
import { FormElement } from '@/core/types';

interface Props {
  element: FormElement;
}

export default function SingleTextPreviewElement({ element }: Props) {
  return <TextInput label={element.label} required={element.required} />;
}
