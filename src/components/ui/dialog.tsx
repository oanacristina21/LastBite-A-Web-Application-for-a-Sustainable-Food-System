import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const MyDialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button>Deschide Dialog</button>
      </Dialog.Trigger>

      <Dialog.Overlay className="overlay" />
      <Dialog.Content className="dialog-content">
        <Dialog.Title>Modifică Produs</Dialog.Title>
        <Dialog.Description>Detalii despre produs...</Dialog.Description>
        {children}
        <Dialog.Close asChild>
          <button>Închide</button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default MyDialog;
