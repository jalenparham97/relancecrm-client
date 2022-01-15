import { Title, createStyles, Affix, Box } from '@mantine/core';

export default function Navbar() {
  return (
    <Box className=" border-b-[0.5px] top-16 px-3 py-3 fixed left-0 right-0 w-full z-[10000]">
      <Box>
        <Title order={2}>ZenRecruit</Title>
      </Box>
    </Box>
  );
}
