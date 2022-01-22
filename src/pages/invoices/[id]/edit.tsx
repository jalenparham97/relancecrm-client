import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from 'react-use';
import { Box, Text, Container, Title, Loader, Group } from '@mantine/core';
import { useInvoice, useInvoiceUpdateMutation } from '@/app/api/invoices';
import { createInvoiceState, useRecoilState } from '@/app/store/store';
import { getInvoiceSubtotal, getInvoiceTotal } from '@/app/utils';
import { CreateInvoice, InvoiceStatus } from '@/core/types';
import { useIsDarkMode } from '@/app/hooks';
import InvoicePageShell from '@/app/components/invoices/InvoicePageShell';
import InvoiceEditHeader from '@/app/components/invoices/InvoiceEditHeader';
import InvoiceEditForm from '@/app/components/invoices/InvoiceEditForm';
import InvoicePreview from '@/app/components/invoices/InvoicePreview';
import InvoiceEditSideDrawer from '@/app/components/invoices/InvoiceEditSideDrawer';
import LoadingLoader from '@/app/components/shared/LoadingLoader';

const drawerWidth = 350;

export default function InvoiceEditPage() {
  const { query, push } = useRouter();
  const isDarkMode = useIsDarkMode();
  const { data: invoiceData, isLoading } = useInvoice(query.id as string);
  const [openPreview, toggleOpenPreview] = useToggle(false);
  const [invoice, setInvoice] = useRecoilState(createInvoiceState);

  useEffect(() => {
    setInvoice(invoiceData);
    // eslint-disable-next-line react-@/hooks/exhaustive-deps
  }, [invoiceData]);

  const handleUpdateInvoiceSubmit = useInvoiceUpdateMutation<CreateInvoice>(query.id as string);

  const updateInvoice = async () => {
    try {
      await handleUpdateInvoiceSubmit.mutateAsync({
        ...invoice,
        client: invoice.client?._id,
        project: invoice.project?._id,
        subtotal: getInvoiceSubtotal(invoice?.items),
        total: getInvoiceTotal({ ...invoice }),
      } as CreateInvoice);
    } catch (error) {
      console.log(error);
    }
  };

  if (invoice?.status === InvoiceStatus.PAID) {
    push(`/invoices/${query.id}/details`);
  }

  return (
    <InvoicePageShell
      header={
        !isLoading && (
          <InvoiceEditHeader
            openPreview={openPreview}
            toggleOpenPreview={toggleOpenPreview}
            invoiceData={invoiceData}
          />
        )
      }
    >
      {isLoading && <LoadingLoader height="90vh" />}
      {!isLoading && (
        <Box className="flex">
          <Box sx={{ width: `calc(100% - ${drawerWidth}px)` }}>
            {openPreview ? (
              <Container className="pt-[80px]" size={700}>
                <InvoicePreview invoice={invoice} />
              </Container>
            ) : (
              <Container className="pt-[80px]" size={1000}>
                <InvoiceEditForm invoice={invoice} />
              </Container>
            )}
          </Box>
          <InvoiceEditSideDrawer
            drawerWidth={drawerWidth}
            updateInvoiceSubmit={updateInvoice}
            updateLoading={handleUpdateInvoiceSubmit.isLoading}
          />
        </Box>
      )}
    </InvoicePageShell>
  );
}
