import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { FC, createContext, useMemo, useState } from 'react';

export type InitialModalState = {
  isVisible: boolean;
  title: string;
  description: string;

  onTriggerConfirmation: (calback: () => void, title: string, description: string) => void;
};

const initialContextState: InitialModalState = {
  isVisible: false,
  title: '',
  description: '',
  onTriggerConfirmation: () => undefined,
};

const initModalState: Pick<InitialModalState, 'isVisible' | 'description' | 'title'> = {
  isVisible: false,
  description: '',
  title: '',
};

export const ActionConfirmationModalContext = createContext(initialContextState);

const ActionConfirmationModalProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState(initModalState);
  const [confirmationCallback, setConfirmationCallback] = React.useState<null | (() => void)>(null);

  const onTriggerConfirmation = (callback: () => void, title: string, description: string) => {
    setModalState((current) => ({ ...current, isVisible: true, title, description }));
    setConfirmationCallback(callback);
  };

  const handleClose = () => {
    setModalState(initModalState);
  };

  const value = useMemo(
    () => ({
      ...modalState,
      onTriggerConfirmation,
    }),
    [modalState],
  );

  return (
    <ActionConfirmationModalContext.Provider value={value}>
      {children}

      <Dialog
        open={modalState.isVisible}
        onClose={handleClose}
        aria-labelledby="alert-dialog-user-confirm-action"
      >
        <DialogTitle id="user-action-confirmation-modal">{modalState.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {modalState.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={confirmationCallback ?? handleClose} autoFocus color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ActionConfirmationModalContext.Provider>
  );
};

export default ActionConfirmationModalProvider;
