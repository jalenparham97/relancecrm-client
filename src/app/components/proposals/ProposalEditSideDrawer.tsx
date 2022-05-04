import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Title, Group } from '@mantine/core';
import {
  IconLetterT,
  IconPhoto,
  IconClock,
  IconReceipt,
  IconDeviceFloppy,
} from '@tabler/icons';
import { useDialog, useIsDarkMode } from '@/app/hooks';
import {
  Client,
  Project,
  ProposalContent,
  ProposalContentBlocksType,
} from '@/core/types';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import Button from '@/app/components/shared/Button';
import Avatar from '@/app/components/shared/Avatar';
import ProposalContentBlock from './ProposalContentBlock';
import BrandColorPicker from '@/app/components/shared/BrandColorPicker';
import { proposalState, selectedBlockState } from '@/app/store';
import { nanoid } from 'nanoid';
import { isEqual } from 'lodash';
import { useProposal } from '@/app/api/proposals';
import { estimateContent, textContent, timelineContent } from '@/app/utils';
import { useToggle } from 'react-use';

interface Props {
  updateProposalSubmit?: () => Promise<void>;
  updateLoading?: boolean;
}

export default function ProposalEditSideDrawer({
  updateProposalSubmit,
  updateLoading,
}: Props) {
  const { query } = useRouter();
  const { data: proposalData } = useProposal(query.id as string);
  const [proposal, setProposal] = useRecoilState(proposalState);
  const [selectedId, setSelectedId] = useRecoilState(selectedBlockState);
  const [addingElement, toggleAddingElement] = useToggle(false);

  // useEffect(() => {
  //   window.scrollTo({
  //     left: 0,
  //     top: document.getElementById('proposal-edit-page').scrollHeight,
  //     behavior: 'smooth',
  //   });
  // }, [addingElement]);

  const insertBlock = (
    content: ProposalContent[],
    type: ProposalContentBlocksType
  ) => {
    const newContent = [...content];

    const block: ProposalContent = {
      id: nanoid(8),
      type,
    };

    switch (type) {
      case 'text':
        block.content = textContent;
        break;
      case 'timeline':
        block.content = timelineContent;
        break;
      case 'estimate':
        block.discount = 0;
        block.subtotal = 0;
        block.total = 0;
        block.items = [
          {
            id: nanoid(8),
            description: '',
            rate: 0,
            units: 0,
            unitsType: 'units',
          },
        ];
        block.content = estimateContent;
        break;
      default:
        break;
    }

    // const insertIndex = newContent.findIndex((el) => el.id === selectedId);

    // if (selectedId) {
    //   newContent.splice(insertIndex, 0, block);
    // } else {
    // }

    newContent.push(block);
    return newContent;
  };

  const addTextBlock = () => {
    setProposal((prevProposal) => ({
      ...prevProposal,
      content: insertBlock(prevProposal.content, 'text'),
    }));
    setSelectedId('');
    // if (!selectedId) {
    //   toggleAddingElement();
    // }
  };

  const addTimelineBlock = () => {
    setProposal((prevProposal) => ({
      ...prevProposal,
      content: insertBlock(prevProposal.content, 'timeline'),
    }));
    // if (!selectedId) {
    //   toggleAddingElement();
    // }
  };
  const addEstimateBlock = () => {
    setProposal((prevProposal) => ({
      ...prevProposal,
      content: insertBlock(prevProposal.content, 'estimate'),
    }));
    // if (!selectedId) {
    //   toggleAddingElement();
    // }
  };

  const setTextColor = (color: string) => {
    setProposal((prevForm) => ({
      ...prevForm,
      brandTextColor: color,
    }));
  };

  const setBgColor = (color: string) => {
    setProposal((prevForm) => ({
      ...prevForm,
      brandFillColor: color,
    }));
  };

  return (
    <Box>
      <Box>
        <Box>
          <Group
            className="pb-14 w-[97.5%] m-auto"
            direction="column"
            spacing="lg"
            grow
          >
            <Box className="space-y-5">
              <Button
                fullWidth
                leftIcon={<IconDeviceFloppy size={16} />}
                onClick={updateProposalSubmit}
                loading={updateLoading}
                disabled={isEqual(proposalData, proposal)}
              >
                Save changes
              </Button>
              <Title order={2}>Content blocks</Title>
              <Box className="space-y-2">
                <ProposalContentBlock
                  icon={<IconLetterT size="20px" />}
                  name="Text"
                  onClick={addTextBlock}
                />
                <ProposalContentBlock
                  icon={<IconPhoto size="20px" />}
                  name="Image"
                  // onClick={addHeadingElement}
                />
                <ProposalContentBlock
                  icon={<IconClock size="20px" />}
                  name="Timeline"
                  onClick={addTimelineBlock}
                />
                <ProposalContentBlock
                  disabled={
                    !!proposal?.content.find(
                      (block) => block.type === 'estimate'
                    )
                  }
                  icon={<IconReceipt size="20px" />}
                  name="Estimate"
                  onClick={addEstimateBlock}
                />
              </Box>
            </Box>

            <Box className="space-y-4">
              <Title order={2}>Branding options</Title>
              <Box className="space-y-2">
                <BrandColorPicker
                  bgColor={proposal?.brandFillColor}
                  textColor={proposal?.brandTextColor}
                  setTextColor={setTextColor}
                  setBgColor={setBgColor}
                />
                <Box>
                  <Button variant="default" compact to="/settings/account">
                    Set your default brand colors
                  </Button>
                </Box>
              </Box>
            </Box>
          </Group>
        </Box>
      </Box>
    </Box>
  );
}
