import { useRouter } from 'next/router';
import {
  Box,
  Group,
  Modal,
  ModalProps,
  Alert,
  Text,
  Textarea,
  Checkbox,
  Paper,
  Title,
  TextInput,
  Tooltip,
  Tabs,
} from '@mantine/core';
import { isEmpty } from 'lodash';
import { useRecoilValue } from 'recoil';
import { useToggle } from 'react-use';
import { useEffect, useState } from 'react';
import { IconCircleCheck, IconLink, IconMail } from '@tabler/icons';
import { useUser } from '@/app/api/auth';
import { proposalState } from '@/app/store';
import {
  useProposal,
  useProposalSend,
  useProposalSendTest,
  useProposalUpdateMutation,
} from '@/app/api/proposals';
import { Proposal, ProposalStatus } from '@/core/types';
import { config } from '@/core/config';
import { useClipboard } from '@mantine/hooks';
import dayjs from 'dayjs';
import Button from '@/app/components/shared/Button';

interface Props extends ModalProps {}

export default function ProposalSendModal({ opened, onClose }: Props) {
  const user = useUser();
  const router = useRouter();
  const clipboard = useClipboard();
  const [invoiceItemError, toggleInvoiceItemError] = useToggle(false);
  const [sentSuccessTest, toggleSentSuccessTest] = useToggle(false);
  const [page, setPage] = useState('email');
  const [showLink, setShowLink] = useState(false);
  const [sendUserCopy, setSendUserCopy] = useState(false);
  // const { data: proposal } = useProposal(router.query.id as string);
  const proposal = useRecoilValue(proposalState);
  const [subject, setSubject] = useState(
    `New proposal from ${user?.fullName} to review.`
  );
  const [message, setMessage] = useState(
    `Hello, Below you can find a link to my proposal, which outlines the work I'll be doing, the deliverables I'll provide, and the estimated cost of my services for this work. Please let me know if you have any questions. I'm looking forward to the possibility of working together.`
  );
  const { sendProposal, isLoading, error, resetError } = useProposalSend();
  const {
    sendTestProposal,
    isLoading: testLoading,
    error: testError,
    resetError: testResetError,
  } = useProposalSendTest();

  const handleUpdateProposal = useProposalUpdateMutation(proposal?._id);

  const proposalLink = `${config.publicWebAppURL}/proposals/${proposal?._id}/view`;

  const getFrom = () => {
    if (user?.businessInfo?.businessName) {
      return `${user?.fullName} at ${user?.businessInfo.businessName}`;
    }
    return user?.fullName;
  };

  const generateLink = async () => {
    try {
      await handleUpdateProposal.mutateAsync({
        status: ProposalStatus.SENT,
      });
      setShowLink(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendProposal = async () => {
    return await sendProposal({
      proposal,
      from: getFrom(),
      subject,
      message,
      sendUserCopy,
    });
  };

  const handleSendProposalTest = async () => {
    await sendTestProposal({
      proposal,
      from: getFrom(),
      subject,
      message,
      sendUserCopy,
    });
    toggleSentSuccessTest();
  };

  const handleClose = () => {
    onClose();
    resetError();
    testResetError();
    setPage('email');
    toggleSentSuccessTest(false);
    toggleInvoiceItemError(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Send Proposal"
      size="lg"
    >
      <Tabs tabPadding="md" grow>
        <Tabs.Tab label="Send Email" icon={<IconMail size={18} />}>
          <Box className="space-y-3">
            {sentSuccessTest && !testError && (
              <Alert
                title="Test Email Sent"
                color="green"
                className="mb-3"
                icon={<IconCircleCheck size={16} />}
                withCloseButton
                onClose={toggleSentSuccessTest}
              >
                A sample proposal email is on its way to you.
              </Alert>
            )}
            <Box className="proposal-send-inputs-container space-y-2">
              <Box className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-gray-400 bg-gray-50 text-gray-500 sm:text-sm">
                  To:
                </span>
                <TextInput
                  value={proposal?.toEmail}
                  disabled
                  className="flex-1"
                  classNames={{ input: '!rounded-l-none' }}
                />
              </Box>
              <Box className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-gray-400 bg-gray-50 text-gray-500 sm:text-sm">
                  Subject:
                </span>
                <TextInput
                  className="flex-1"
                  classNames={{ input: '!rounded-l-none' }}
                  defaultValue={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Box>
            </Box>
            <Box>
              <Textarea
                autosize
                minRows={4}
                label="Message"
                onChange={(e) => setMessage(e.target.value)}
                defaultValue={message}
              />
            </Box>
            <Checkbox
              label="Send myself a copy"
              checked={sendUserCopy}
              onChange={(e) => setSendUserCopy(e.currentTarget.checked)}
            />
            <Group position="right">
              <Button
                variant="default"
                onClick={handleSendProposalTest}
                loading={testLoading}
              >
                Send yourself a test
              </Button>
              <Button onClick={handleSendProposal} loading={isLoading}>
                Send proposal
              </Button>
            </Group>
          </Box>
        </Tabs.Tab>
        <Tabs.Tab label="Sharable Link" icon={<IconLink size={18} />}>
          <Box>
            <Paper withBorder p="lg">
              <Box className="space-y-3">
                <Title order={4}>Send your proposal with a unique link</Title>
                <Box className="space-y-3">
                  {showLink ? (
                    <>
                      <TextInput value={proposalLink} />
                      <Tooltip
                        label="Link copied!"
                        gutter={5}
                        placement="center"
                        position="bottom"
                        radius="xl"
                        transition="slide-down"
                        transitionDuration={200}
                        opened={clipboard.copied}
                      >
                        <Button onClick={() => clipboard.copy(proposalLink)}>
                          Copy link
                        </Button>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Text>
                        To generate a shareable link, the proposal needs to be
                        marked as Sent, and you will need to manually send the
                        link for your proposal to your client.
                      </Text>
                      <Button
                        onClick={generateLink}
                        loading={handleUpdateProposal.isLoading}
                      >
                        Mark it as Sent and generate a link
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Tabs.Tab>
      </Tabs>
    </Modal>
  );
}
