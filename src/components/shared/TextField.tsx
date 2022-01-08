import { Group, Text, Input, InputBaseProps } from '@mantine/core';

interface Props extends InputBaseProps {
  label?: string;
  [x: string]: any;
}

export default function TextField({ label, ...otherProps }: Props) {
  return (
    <Group spacing={5} direction="column" grow>
      {label && (
        <Text size="sm" className="font-medium">
          {label}
        </Text>
      )}
      <Input {...otherProps} />
    </Group>
  );
}
