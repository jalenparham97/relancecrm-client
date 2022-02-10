import { Box, Checkbox } from '@mantine/core';
import { FormElement } from '@/core/types';
import CheckboxGroup from '../../shared/CheckboxGroup';

interface Props {
  element: FormElement;
  isPreview?: boolean;
}

export default function MultipleChoicePreviewElement({ element, isPreview = false }: Props) {
  return (
    <Box>
      <CheckboxGroup
        label={element?.label}
        description={element?.showDescription && element?.description}
        required={element?.required}
      >
        {element?.options.map((option) => (
          <Checkbox
            color="blue"
            disabled={isPreview}
            label={option.option}
            key={option.id}
            classNames={{
              input: isPreview && '!cursor-default',
              label: isPreview && '!cursor-default',
            }}
          />
        ))}
      </CheckboxGroup>
    </Box>
  );
}
