import { Center, Loader } from '@mantine/core';

interface Props {
  height?: string;
}

export default function LoadingLoader({ height = '80vh' }: Props) {
  return (
    <Center sx={{ height }}>
      <Loader />
    </Center>
  );
}
