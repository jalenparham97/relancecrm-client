import { Box, Title, Text } from '@mantine/core';
import { FormElement } from '@/core/types';

interface Props {
  element: FormElement;
}

export default function HeadingPreviewElement({ element }: Props) {
  return (
    <Box className="space-y-2">
      <Box className="space-y-2">
        {element.label && <Title order={4}>{element?.label}</Title>}
        {element.showDescription && <Text>{element?.description}</Text>}
      </Box>
    </Box>
  );
}
