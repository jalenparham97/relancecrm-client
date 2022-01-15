import { Client } from '@/core/types';

interface Props {
  client: Client;
  onCancel?: () => void;
  hideCancel?: boolean;
  showEmail?: boolean;
}

export default function InvoiceClientItem({
  client,
  onCancel,
  hideCancel = false,
  showEmail = true,
}: Props) {
  return <div></div>;
}
