import { useState } from 'react';
import {
  ActionIcon,
  Box,
  Paper,
  Title,
  Tooltip,
  TextInput,
  Text,
} from '@mantine/core';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Client, Proposal, ProposalContent } from '@/core/types';
import { useRecoilState } from 'recoil';
import { proposalState } from '@/app/store';
import { useDialog } from '@/app/hooks';
import { useToggle } from 'react-use';
import { useProposalUpdateMutation } from '@/app/api/proposals';
import { IconDeviceFloppy, IconPhoto, IconX } from '@tabler/icons';
import { isEmpty } from 'lodash';
import { useClients } from '@/app/api/clients';
import Button from '../shared/Button';
import ProposalHeaderImagePicker from './ProposalHeaderImagePicker';
import ProposalBlock from './ProposalBlock';
import ClientPicker from '../clients/ClientPicker';
import Link from '../shared/Link';

const reorder = (
  list: ProposalContent[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function ProposalEditForm() {
  const [proposal, setProposal] = useRecoilState(proposalState);
  const [imagePickerOpen, openImagePicker, closeImagePicker] = useDialog();
  const [editMode, toggleEditMode] = useToggle(false);
  const [client, setClient] = useState<Client>({});
  const { data: clients } = useClients();

  const handleUpdateProposal = useProposalUpdateMutation(proposal?._id);

  const handleChange = (
    e: React.ChangeEvent<{ value: string; name: string }>
  ) => {
    const { name, value } = e.target;
    setProposal((prevState) => ({ ...prevState, [name]: value }));
  };

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

  const resetClient = () => {
    setClient({});
    setProposal((prevState) => ({
      ...prevState,
      toName: '',
      toEmail: '',
      toCompany: '',
      toAddress: '',
      client: {},
    }));
  };

  const handleClientChange = (client: Client) => {
    if (client) {
      setClient(client);
      setProposal((prevState) => ({
        ...prevState,
        toName: client.fullName,
        toEmail: client.email,
        toCompany: client.company,
        toAddress: client.address,
        client,
      }));
    }
  };

  const onDragEnd = ({ source, destination }: DropResult) => {
    // dropped outside the list
    if (!destination) {
      return;
    }
    const updatedContent = reorder(
      proposal?.content,
      source.index,
      destination.index
    );
    setProposal((prevProposal) => ({
      ...prevProposal,
      content: updatedContent,
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
          className="flex justify-center items-center px-[80px] py-[80px]"
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
                proposal?.headerImgUrl &&
                ' bg-white px-8 py-3 rounded cursor-pointer'
              }`}
            >
              <Title
                className={`text-center cursor-pointer`}
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
              size="xl"
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
            <TextInput
              placeholder="Enter your name"
              name="fromName"
              value={proposal?.fromName || ''}
              onChange={handleChange}
            />
            <TextInput
              placeholder="Company name"
              name="fromCompany"
              value={proposal?.fromCompany || ''}
              onChange={handleChange}
            />
            <TextInput
              placeholder="Address"
              name="fromAddress"
              value={proposal?.fromAddress || ''}
              onChange={handleChange}
            />
          </Box>
          <Box className="w-1/2 space-y-2">
            <Title order={5}>TO:</Title>
            {isEmpty(proposal?.toName) ? (
              <ClientPicker
                clients={clients?.data || []}
                setClient={handleClientChange}
                noLabel
              />
            ) : (
              <Box>
                <Box mt={-8}>
                  <Text>{proposal?.toName}</Text>
                  <Box mt={-2}>
                    <Link size="sm" onClick={resetClient} underline>
                      Choose a different client
                    </Link>
                  </Box>
                </Box>
              </Box>
            )}
            <TextInput
              placeholder="Company name"
              name="toCompany"
              value={proposal?.toCompany}
              onChange={handleChange}
            />
            <TextInput
              placeholder="Address"
              name="toAddress"
              onChange={handleChange}
              value={proposal?.toAddress}
            />
          </Box>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${snapshot.isDraggingOver && 'bg-indigo-500'}`}
              >
                {proposal?.content?.map((block, index: number) => (
                  <ProposalBlock block={block} key={block.id} index={index} />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
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
