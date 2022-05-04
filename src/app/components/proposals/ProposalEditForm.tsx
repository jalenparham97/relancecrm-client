import { useState } from 'react';
import {
  ActionIcon,
  Box,
  Paper,
  Title,
  Tooltip,
  TextInput,
} from '@mantine/core';
import { JSONContent } from '@tiptap/react';
import { Proposal } from '@/core/types';
import { useRecoilState } from 'recoil';
import { proposalState } from '@/app/store';
import { useDialog } from '@/app/hooks';
import { useToggle } from 'react-use';
import { useProposalUpdateMutation } from '@/app/api/proposals';
import { IconDeviceFloppy, IconPhoto, IconX } from '@tabler/icons';
import Button from '../shared/Button';
import ProposalHeaderImagePicker from './ProposalHeaderImagePicker';
import BubbleEditor from '../shared/BubbleEditor';
import { useHover } from '@mantine/hooks';
import ProposalBlock from './ProposalBlock';

export default function ProposalEditForm() {
  const [proposal, setProposal] = useRecoilState(proposalState);
  const [imagePickerOpen, openImagePicker, closeImagePicker] = useDialog();
  const [editMode, toggleEditMode] = useToggle(false);

  const handleUpdateProposal = useProposalUpdateMutation(proposal?._id);

  const updateTitle = async () => {
    await handleUpdateProposal.mutateAsync({ title: proposal?.title });
    toggleEditMode(false);
    // toasts.success('Form updated');
  };

  const onProposalTitleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setProposal((prevForm) => ({
      ...prevForm,
      title: e.currentTarget.value,
    }));
  };

  return (
    <Box>
      <Paper
        withBorder
        className={`relative border-gray-300 shadow-sm border-t-8`}
        sx={{
          borderTopColor: `${proposal?.brandFillColor} !important`,
        }}
      >
        <Box
          className="flex justify-center items-center px-[80px] py-[150px]"
          sx={{
            backgroundImage: `url("${proposal?.headerImgUrl}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Button
            size="xs"
            variant={'default'}
            className={`absolute top-2 right-3`}
            leftIcon={<IconPhoto size="16px" />}
            onClick={openImagePicker}
          >
            {proposal?.headerImgUrl ? 'Change' : 'Add'} cover
          </Button>
          {!editMode && (
            <Box
              className={`${
                proposal?.headerImgUrl && ' bg-white px-8 py-3 rounded'
              }`}
            >
              <Title
                className={`text-center`}
                order={2}
                onClick={() => toggleEditMode(true)}
              >
                {proposal?.title}
              </Title>
            </Box>
          )}
          {editMode && (
            <TextInput
              value={proposal?.title}
              onChange={onProposalTitleChange}
              autoFocus
              className="w-96"
              rightSectionWidth={70}
              rightSection={
                <Box className="flex">
                  <Tooltip label="Save" position="bottom">
                    <ActionIcon
                      variant="default"
                      onClick={updateTitle}
                      loading={handleUpdateProposal.isLoading}
                    >
                      <IconDeviceFloppy size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <ActionIcon
                    variant="default"
                    onClick={toggleEditMode}
                    className="ml-1"
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Box>
              }
            />
          )}
        </Box>

        <Box
          p={50}
          className="flex justify-between space-x-10 border-t border-t-gray-300"
        >
          <Box className="w-1/2 space-y-2">
            <Title order={5}>FROM:</Title>
            <TextInput placeholder="Enter your name" />
            <TextInput placeholder="Company name" />
            <TextInput placeholder="Address" />
          </Box>
          <Box className="w-1/2 space-y-2">
            <Title order={5}>TO:</Title>
            <TextInput />
            <TextInput placeholder="Company name" />
            <TextInput placeholder="Address" />
          </Box>
        </Box>
        {proposal?.content.map((block) => (
          <ProposalBlock block={block} key={block.id} />
        ))}
      </Paper>

      <ProposalHeaderImagePicker
        opened={imagePickerOpen}
        onClose={closeImagePicker}
        submit={handleUpdateProposal.mutateAsync}
        isLoading={handleUpdateProposal.isLoading}
        proposal={proposal}
      />
    </Box>
  );
}
