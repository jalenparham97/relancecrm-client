import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Text,
  Navbar,
  Title,
  Group,
  ActionIcon,
  Badge,
} from '@mantine/core';
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
import { useRecoilState, useRecoilValue } from 'recoil';
import Button from '@/app/components/shared/Button';
import Avatar from '@/app/components/shared/Avatar';
import ProposalContentBlock from './ProposalContentBlock';
import BrandColorPicker from '@/app/components/shared/BrandColorPicker';
import { proposalState } from '@/app/store';
import { nanoid } from 'nanoid';
import { isEqual } from 'lodash';
import { JSONContent } from '@tiptap/react';
import { useProposal } from '@/app/api/proposals';

interface Props {
  updateProposalSubmit?: () => Promise<void>;
  updateLoading?: boolean;
}

export default function ProposalEditSideDrawer({
  updateProposalSubmit,
  updateLoading,
}: Props) {
  const { query } = useRouter();
  const isDarkMode = useIsDarkMode();
  const { data: proposalData } = useProposal(query.id as string);
  const [proposal, setProposal] = useRecoilState(proposalState);

  const insertBlock = (
    content: ProposalContent[],
    type: ProposalContentBlocksType
  ) => {
    const newContent = [...content];

    const block: ProposalContent = {
      id: nanoid(8),
      type,
      content: [
        {
          type: 'heading',
          attrs: {
            textAlign: 'left',
            level: 1,
          },
          content: [
            {
              type: 'text',
              marks: [
                {
                  type: 'bold',
                },
              ],
              text: 'Text section title',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            textAlign: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Enter details for the text section...',
            },
          ],
        },
      ],
    };

    newContent.push(block);

    return newContent;
  };

  const addTextBlock = () => {
    return setProposal((preProposal) => ({
      ...preProposal,
      content: insertBlock(preProposal.content, 'text'),
    }));
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
                  // onClick={addHeadingElement}
                />
                <ProposalContentBlock
                  icon={<IconReceipt size="20px" />}
                  name="Estimate"
                  // onClick={addHeadingElement}
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
