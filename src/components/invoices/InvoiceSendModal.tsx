import { useUser } from '@/api/auth';
import { createInvoiceState } from '@/store';
import { Box, Group, Modal, ModalProps, Alert, Text, Textarea, Checkbox } from '@mantine/core';
import dayjs from 'dayjs';
import { useToggle } from 'react-use';
import { useRecoilValue } from 'recoil';
import Button from '@/components/shared/Button';
import InvoiceRecipientItem from './InvoiceRecipientItem';
import { isEmpty } from 'lodash';

interface Props extends ModalProps {
  loading?: boolean;
  testLoading?: boolean;
  resetError?: () => void;
  testResetError?: () => void;
  error?: any;
  testError?: any;
  onSubmit?: () => Promise<void>;
  onSubmitTest?: () => Promise<void>;
  sendUserCopy?: boolean;
  setSendUserCopy?: (checked: boolean) => void;
  message?: string;
  setMessage?: (message: string) => void;
}

export default function InvoiceSendModal({
  opened,
  onClose,
  onSubmit,
  onSubmitTest,
  resetError,
  testResetError,
  testError,
  error,
  loading,
  testLoading,
  sendUserCopy,
  setSendUserCopy,
  message,
  setMessage,
}: Props) {
  const user = useUser();
  const invoice = useRecoilValue(createInvoiceState);
  const [invoiceItemError, toggleInvoiceItemError] = useToggle(false);
  const [invoiceDueDateError, toggleInvoiceDueDateError] = useToggle(false);
  const [sentSuccessTest, toggleSentSuccessTest] = useToggle(false);

  const handleSubmitTest = async () => {
    if (invoice.items.length === 1 && invoice.items[0].subtotal === 0) {
      toggleInvoiceItemError(true);
    } else {
      await onSubmitTest();
      toggleSentSuccessTest();
    }
  };

  const handleSubmit = async () => {
    if (invoice.items.length === 1 && invoice.items[0].subtotal === 0) {
      toggleInvoiceItemError(true);
    } else if (dayjs(invoice?.dueOn).isBefore(dayjs())) {
      toggleInvoiceDueDateError(true);
    } else {
      await onSubmit();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendUserCopy(event.target.checked);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const getFrom = () => {
    if (user?.businessInfo?.businessName) {
      return `${user?.fullName} at ${user?.businessInfo.businessName}`;
    }
    return user?.fullName;
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Your invoice email" size="lg">
      <Box className="space-y-2">
        <Group>
          <Text className="font-semibold">From:</Text>
          <Text>{getFrom()}</Text>
        </Group>
        <Group>
          <Text className="font-semibold">To:</Text>
          {invoice?.client && (
            <Text>{`${invoice?.client.fullName} (${invoice?.client.email})`}</Text>
          )}
        </Group>
        <Group>
          <Text className="font-semibold">Subject:</Text>
          <Text>{`${getFrom()}`} sent you an invoice</Text>
        </Group>
      </Box>

      {!isEmpty(invoice?.recipients) && (
        <Box className="mt-3">
          <Text className="font-semibold">Additional recipients</Text>
          <Box className="mt-2 space-y-2">
            {invoice.recipients.map((recipient) => (
              <Box key={recipient._id}>
                <InvoiceRecipientItem client={recipient} showCancel={false} />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box className="mt-4 space-y-3">
        <Textarea placeholder="Enter your message" value={message} onChange={handleMessageChange} />
        <Checkbox
          label="Send youself a copy of this invoice"
          checked={sendUserCopy}
          onChange={handleChange}
        />
      </Box>

      <Box mt={20}>
        <Group position="apart" align="center">
          <Button variant="default" onClick={handleSubmitTest} loading={testLoading}>
            Send yourself a test
          </Button>
          <Group spacing="sm">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={loading} onClick={handleSubmit}>
              Send invoice
            </Button>
          </Group>
        </Group>
      </Box>
    </Modal>
  );
}
