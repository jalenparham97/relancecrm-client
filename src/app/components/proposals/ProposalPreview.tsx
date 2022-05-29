import {
  Paper,
  Title,
  Box,
  Text,
  Group,
  Table,
  Divider,
  SimpleGrid,
  Center,
  Avatar,
} from '@mantine/core';
import { Proposal } from '@/core/types';
import { JSONContent } from '@tiptap/react';
import ProposalContentRenderer from './ProposalContentRenderer';

interface Props {
  proposal: Proposal;
}

export default function ProposalPreview({ proposal }: Props) {
  return (
    <Paper
      withBorder
      className="border-gray-300 shadow-sm border-t-8"
      sx={{
        borderTopColor: `${proposal?.brandFillColor} !important`,
      }}
    >
      <Box
        className="flex justify-center items-center px-[80px] py-[80px]"
        sx={{
          backgroundImage: `url("${proposal?.headerImgUrl}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box
          className={`${
            proposal?.headerImgUrl && ' bg-white px-8 py-3 rounded'
          }`}
        >
          <Title className={`text-center`} order={2}>
            {proposal?.title}
          </Title>
        </Box>
      </Box>

      <Box
        p={50}
        className="flex justify-between space-x-10 border-t border-t-gray-300"
      >
        <Box className="w-1/2 space-y-2">
          <Title order={5}>FROM:</Title>
          <Text>{proposal?.fromName || ''}</Text>
          <Text>{proposal?.fromCompany || ''}</Text>
          <Text>{proposal?.fromAddress || ''}</Text>
        </Box>
        <Box className="w-1/2 space-y-2">
          <Title order={5}>TO:</Title>
          <Text>{proposal?.toName || ''}</Text>
          <Text>{proposal?.toCompany || ''}</Text>
          <Text>{proposal?.toAddress || ''}</Text>
        </Box>
      </Box>

      {proposal?.content?.map((block) => (
        <Box
          key={block.id}
          className={`px-[50px] py-[40px] border-transparent border-y-[1px] border-solid border-x-0  relative`}
        >
          <ProposalContentRenderer block={block} />
        </Box>
      ))}
    </Paper>
  );
}
