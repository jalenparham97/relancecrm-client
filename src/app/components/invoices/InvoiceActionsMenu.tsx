import { Menu } from '@mantine/core';
import { FiTrash2, FiSend, FiDollarSign } from 'react-icons/fi';
import { InvoiceStatus } from '@/core/types';
import { useInvoiceDeleteMutation, useInvoiceUpdatePopoverMutation } from '@/app/api/invoices';
import DeleteModal from '@/app/components/shared/DeleteModal';
import dayjs from 'dayjs';
import { useDialog } from '@/app/hooks/useDialog';
import InvoiceMarkAsPaidModal from './InvoiceMarkAsPaidModal';

interface Props {
  id: string;
  status?: InvoiceStatus;
}

export default function InvoiceActionsMenu({ id, status }: Props) {
  const [openDeleteModal, toggleOpenDeleteModal, closeDeleteModal] = useDialog();
  const [openMPModal, toggleMPModal, closeMPModal] = useDialog();

  const handleDeleteInvoice = useInvoiceDeleteMutation();
  const handleUpdateInvoiceSubmit = useInvoiceUpdatePopoverMutation(id);

  const markInvoiceAsSent = async () => {
    try {
      await handleUpdateInvoiceSubmit.mutateAsync({ status: InvoiceStatus.SENT });
    } catch (error) {
      console.log(error);
    }
  };

  const markInvoiceAsPaid = async () => {
    try {
      await handleUpdateInvoiceSubmit.mutateAsync({
        status: InvoiceStatus.PAID,
        paymentDate: dayjs().toISOString(),
        paymentDetails: { paymentMethod: 'manual' },
      });
      closeMPModal();
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteInvoice = async () => {
    try {
      await handleDeleteInvoice.mutateAsync(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Menu closeOnItemClick={false}>
        {status !== InvoiceStatus.SENT && status !== InvoiceStatus.PAID && (
          <Menu.Item
            icon={<FiSend />}
            component="button"
            disabled={handleUpdateInvoiceSubmit.isLoading}
            onClick={markInvoiceAsSent}
          >
            Mark as sent
          </Menu.Item>
        )}
        {status !== InvoiceStatus.PAID && (
          <Menu.Item
            icon={<FiDollarSign />}
            component="button"
            disabled={handleUpdateInvoiceSubmit.isLoading}
            onClick={toggleMPModal}
          >
            Mark as paid
          </Menu.Item>
        )}
        <Menu.Item icon={<FiTrash2 />} color="red" onClick={toggleOpenDeleteModal}>
          Delete
        </Menu.Item>
      </Menu>

      <InvoiceMarkAsPaidModal
        opened={openMPModal}
        onClose={closeMPModal}
        onSubmit={markInvoiceAsPaid}
        isLoading={handleUpdateInvoiceSubmit.isLoading}
      />

      <DeleteModal
        title="Invoice"
        opened={openDeleteModal}
        onClose={closeDeleteModal}
        onDelete={onDeleteInvoice}
        isLoading={handleDeleteInvoice.isLoading}
      />
    </>
  );
}
