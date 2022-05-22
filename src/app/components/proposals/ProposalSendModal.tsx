import React from 'react';

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

export default function ProposalSendModal() {
  return <div>ProposalSendModal</div>;
}
