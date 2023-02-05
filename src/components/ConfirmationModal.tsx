import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

interface ActionConfirmationModalProps {
  isOpen: boolean;
  description: string;
  title: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({
  isOpen,
  description,
  title,
  loading,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="alert-dialog-user-confirm-action">
      <DialogTitle id="user-action-confirmation-modal">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Відмінити</Button>
        <LoadingButton loading={loading} onClick={onConfirm} autoFocus color="error">
          Підтвердити
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
