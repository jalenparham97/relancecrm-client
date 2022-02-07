import { Center, Loader, MantineColor } from '@mantine/core';

interface Props {
  height?: string;
  color?: MantineColor;
}

export default function LoadingLoader({ height = '80vh', color }: Props) {
  return (
    <Center sx={{ height }}>
      <Loader color={color} />
    </Center>
  );
}
