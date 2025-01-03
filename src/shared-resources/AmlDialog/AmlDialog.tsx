import React from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';

type AmlDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
};

const AmlDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  primaryButtonText,
  secondaryButtonText,
}: AmlDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='text-lg font-medium mb-3'>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <div className='flex gap-4 justify-end'>
        {onSecondaryButtonClick && (
          <Button variant='outline' size='lg' onClick={onSecondaryButtonClick}>
            {secondaryButtonText || 'No'}
          </Button>
        )}
        {onPrimaryButtonClick && (
          <Button variant='default' size='lg' onClick={onPrimaryButtonClick}>
            {primaryButtonText || 'Yes'}
          </Button>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export default AmlDialog;
