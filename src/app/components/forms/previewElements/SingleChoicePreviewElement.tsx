import { Box, Radio, RadioGroup } from '@mantine/core';
import { FormElement } from '@/core/types';

interface Props {
  element: FormElement;
  isPreview?: boolean;
}

export default function SingleChoicePreviewElement({ element, isPreview = false }: Props) {
  return (
    <Box>
      <RadioGroup
        label={element?.label}
        description={element?.showDescription && element?.description}
        required={element.required}
        variant="vertical"
        color="blue"
      >
        {element?.options.map((option) => (
          <Radio
            key={option}
            disabled={isPreview}
            value={option}
            sx={(theme) => ({
              '& span': {
                color: isPreview && theme.colors.dark[8],
                fontSize: '14px',
              },
            })}
          >
            {option}
          </Radio>
        ))}
      </RadioGroup>
    </Box>
  );
}
