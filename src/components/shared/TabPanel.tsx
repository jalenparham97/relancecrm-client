import { Box } from '@mantine/core';

interface Props {
  activeIndex: number;
  index: number;
  children?: React.ReactNode;
}

export default function TabPanel({ activeIndex, index, children }: Props) {
  return <>{activeIndex === index && <Box>{children}</Box>}</>;
}
