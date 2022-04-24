import { useState } from 'react';
import { useRouter } from 'next/router';
import { Divider, Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import {
  IconTrash,
  IconEdit,
  IconCopy,
  IconArchive,
  IconThumbUp,
  IconBriefcase,
  IconDownload,
} from '@tabler/icons';
import {
  ProposalStatus,
  Proposal,
  CreateProposal,
  Project,
} from '@/core/types';
import {
  useProposalAddMutation,
  useProposalDeleteMutation,
  useProposalUpdateStatusMutation,
} from '@/app/api/proposals';
import { useDialog } from '@/app/hooks';
import { omitObjProperty } from '@/core/utils';
import DeleteModal from '@/app/components/shared/DeleteModal';
import ProjectPickerModal from '../projects/ProjectPickerModal';
import { isEmpty } from 'lodash';

interface Props {
  id: string;
  status?: ProposalStatus;
  proposal?: Proposal;
}

export default function ProposalActionMenu({ id, status, proposal }: Props) {
  const router = useRouter();
  const [deleteDialog, openDeleteDialog, closeDeleteDialog] = useDialog();
  const [projectDialog, openProjectDialog, closeProjectDialog] = useDialog();
  const [project, setProject] = useState<Project>({});

  const handleDuplicateProposalSubmit = useProposalAddMutation();
  const handleUpdateProposal = useProposalUpdateStatusMutation(id);
  const handleDeleteProposal = useProposalDeleteMutation();

  console.log({ proposal });
  console.log(isEmpty(proposal?.project?.projectName));

  const onDeleteForm = async () => {
    await handleDeleteProposal.mutateAsync(id);
    closeDeleteDialog();
  };

  const handleDuplicateProposal = async () => {
    try {
      const exludedFields = [
        'userId',
        'id',
        '_id',
        'createdAt',
        'updatedAt',
        'sentDate',
        'amount',
        'status',
      ];
      const duplicateProposal: CreateProposal = {
        ...omitObjProperty(proposal, exludedFields),
        title: `Copy ${proposal?.title}`,
        client: proposal?.client?._id,
        project: proposal?.project?._id,
      };
      console.log(proposal);
      const newProposal = await handleDuplicateProposalSubmit.mutateAsync(
        duplicateProposal
      );
      router.push(`/proposals/${newProposal._id}/edit`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveStatus = async () => {
    try {
      await handleUpdateProposal.mutateAsync({
        status: ProposalStatus.APPROVED,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const saveProjectToProposal = async () => {
    try {
      await handleUpdateProposal.mutateAsync({ project: project._id });
      closeProjectDialog();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Menu closeOnItemClick={false}>
        <Menu.Item
          component={NextLink}
          href={`/proposals/${id}/edit`}
          icon={<IconEdit size={16} />}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          icon={<IconCopy size={16} />}
          onClick={handleDuplicateProposal}
          disabled={handleDuplicateProposalSubmit.isLoading}
        >
          Duplicate
        </Menu.Item>
        <Divider />
        <Menu.Item icon={<IconDownload size={16} />}>Download PDF</Menu.Item>
        {proposal.status !== ProposalStatus.APPROVED && (
          <Menu.Item
            icon={<IconThumbUp size={16} />}
            onClick={handleApproveStatus}
            disabled={handleUpdateProposal.isLoading}
          >
            Mark as approved
          </Menu.Item>
        )}
        {isEmpty(proposal?.project) && (
          <Menu.Item
            icon={<IconBriefcase size={16} />}
            onClick={openProjectDialog}
          >
            Add to a project
          </Menu.Item>
        )}
        <Divider />
        <Menu.Item icon={<IconArchive size={16} />}>Archive</Menu.Item>
        <Menu.Item
          icon={<IconTrash size={16} />}
          color="red"
          onClick={openDeleteDialog}
        >
          Delete
        </Menu.Item>
      </Menu>

      <ProjectPickerModal
        opened={projectDialog}
        onClose={closeProjectDialog}
        setProject={setProject}
        submit={saveProjectToProposal}
        isLoading={handleUpdateProposal.isLoading}
      />

      <DeleteModal
        title="Proposal"
        opened={deleteDialog}
        onClose={closeDeleteDialog}
        isLoading={handleDeleteProposal.isLoading}
        onDelete={onDeleteForm}
      />
    </>
  );
}
