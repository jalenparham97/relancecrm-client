import { useState, useEffect } from 'react';
import { Box, Group, Modal, Text, ModalProps, Alert, Tooltip } from '@mantine/core';
import { InvoicePaymentMethods } from '@/core/types';
import { useRecoilValue } from 'recoil';
import { isEmpty } from 'lodash';
import { createInvoiceState } from '@/app/store/store';
import { useUser } from '@/app/api/auth';
import { useInvoiceUpdateMutation } from '@/app/api/invoices';
import Button from '@/app/components/shared/Button';
import Link from '@/app/components/shared/Link';
import InvoicePaymentMethodCard from './InvoicePaymentMethodCard';
import { FiInfo } from 'react-icons/fi';

interface Props extends ModalProps {
  isLoading?: boolean;
  onSubmit?: () => Promise<void>;
}

export default function InvoicePaymentsModal({ opened, onClose }: Props) {
  const user = useUser();
  const invoice = useRecoilValue(createInvoiceState);
  const [paymentMethods, setPaymentMethods] = useState<InvoicePaymentMethods>({});

  useEffect(() => {
    setPaymentMethods(invoice?.paymentMethods);
  }, [invoice]);

  const handleUpdateInvoiceSubmit = useInvoiceUpdateMutation(invoice?._id);

  const onSave = async () => {
    try {
      await handleUpdateInvoiceSubmit.mutateAsync({ paymentMethods });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setPaymentMethods(invoice?.paymentMethods);
    onClose();
  };

  const isStripeEnabled = !isEmpty(user?.connectedPayments?.stripe?.accountId);
  const isZelleEnabled = !isEmpty(user?.connectedPayments?.zelle?.accountId);

  return (
    <Modal size="lg" opened={opened} onClose={handleClose} title="Accepted payment methods">
      <Group direction="column" grow>
        <Text>
          We support 2 payout methods. You can choose which one you would like to use for each
          invoice.
        </Text>

        <InvoicePaymentMethodCard
          logo="https://cdn.brandfolder.io/KGT2DTA4/at/8vbr8k4mr5xjwk4hxq4t9vs/Stripe_wordmark_-_blurple.svg"
          appName="stripe"
          paymentMethods={paymentMethods}
          onUpdate={setPaymentMethods}
          isPaymentMethodEnabled={isStripeEnabled}
        >
          <Text className="text-sm">
            2.9% + $0.30 fee.{' '}
            <Link
              className="text-sm"
              href="https://stripe.com/us/pricing"
              target="_blank"
              rel="noopener"
            >
              Learn more at Stripe.
            </Link>
          </Text>
        </InvoicePaymentMethodCard>
        <InvoicePaymentMethodCard
          logo="/assets/logos/zelle-logo.svg"
          appName="zelle"
          paymentMethods={paymentMethods}
          onUpdate={setPaymentMethods}
          isPaymentMethodEnabled={isZelleEnabled}
        >
          <Text className="text-sm">
            Processed outside of Relance.{' '}
            <Tooltip
              label="We do not track external transactions. For these types of payment options, please manually mark invoices as paid."
              classNames={{ body: 'w-60' }}
              withArrow
            >
              <Link className="text-sm">Learn what this means.</Link>
            </Tooltip>
          </Text>
        </InvoicePaymentMethodCard>

        <Alert icon={<FiInfo />} color="blue">
          Update your accepted payment methods in your{' '}
          <Link to="/settings/payments" className="hover:underline text-[#339af0]">
            Account
          </Link>
          .
        </Alert>

        <Box mt={15}>
          <Group spacing="sm" position="right">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={handleUpdateInvoiceSubmit.isLoading} onClick={onSave}>
              Save
            </Button>
          </Group>
        </Box>
      </Group>
    </Modal>
  );
}
