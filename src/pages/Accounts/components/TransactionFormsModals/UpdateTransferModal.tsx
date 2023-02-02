import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { isEqual } from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Account } from '../../../../lib/api/accounts';
import {
  Transaction,
  TransactionType,
  UpdateTransferReqBody,
  updateTransfer,
} from '../../../../lib/api/transactions';
import { TransactionTypeToggleBtn } from '../TransactionTypeToggleBtn';

import { TransferFormValues } from './types';
import { getAccountOption, getDefaultTransferFormValues } from './utils';

export type FormTransferType = Omit<Transaction, 'type'> & {
  type: Extract<TransactionType, 'TRANSFER'>;
};

export type UpdateTransferModalProps = {
  transaction: Omit<Transaction, 'type'> & { type: Extract<TransactionType, 'TRANSFER'> };
  accounts: Account[];
  isOpen: boolean;
  onClose: () => void;
};

export function UpdateTransferModal({
  transaction,
  isOpen,
  onClose,
  accounts,
}: UpdateTransferModalProps) {
  const [isAllOptionsVisible, setIsAllOptionsVisible] = React.useState(false);
  const accountsOptions = accounts.map(getAccountOption);
  const defaultValues = getDefaultTransferFormValues(accountsOptions, transaction);

  const {
    control,
    handleSubmit: onSubmit,
    watch,
  } = useForm<TransferFormValues>({
    defaultValues,
  });

  const watchSendingAccountValue = watch('sendingAccount');
  const watchReceivingAccountValue = watch('receivingAccount');

  const handleSubmit = async (values: TransferFormValues) => {
    const sameCurrencies = values.sendingAccount.currency === values.receivingAccount.currency;

    const body: UpdateTransferReqBody = {
      fromAccountId: values.sendingAccount.value,
      toAccountId: values.receivingAccount.value,
      fromAccountAmount: values.fromAmount,
      toAccountAmount: sameCurrencies ? values.fromAmount : values.toAmount,
      date: values.date.toISOString(),
      description: values.description ?? undefined,
    };

    await updateTransfer(body, transaction.id);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth keepMounted={false}>
      <DialogContent>
        <Box width="100%" display="flex" flexDirection="column" gap={3} pt={2}>
          <Controller
            name="transactionType"
            control={control}
            render={({ field }) => (
              <FormControl>
                <TransactionTypeToggleBtn
                  value={field.value}
                  onChange={field.onChange}
                  options={['TRANSFER']}
                />
              </FormControl>
            )}
          />
          <Controller
            name="sendingAccount"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormControl>
                <Autocomplete
                  options={[...accountsOptions].filter(
                    (o) => o.value !== watchReceivingAccountValue.value,
                  )}
                  {...field}
                  isOptionEqualToValue={(o, v) => isEqual(o, v)}
                  onChange={(_e, nextValue) => field.onChange(nextValue)}
                  renderInput={(params) => (
                    <TextField label="Sending Account" {...params} size="small" required />
                  )}
                />
              </FormControl>
            )}
          />
          <Controller
            name="receivingAccount"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormControl>
                <Autocomplete
                  options={[...accountsOptions].filter(
                    (o) => o.value !== watchSendingAccountValue.value,
                  )}
                  {...field}
                  isOptionEqualToValue={(o, v) => isEqual(o, v)}
                  onChange={(_e, nextValue) => field.onChange(nextValue)}
                  renderInput={(params) => (
                    <TextField label="Receiving Account" {...params} size="small" required />
                  )}
                />
              </FormControl>
            )}
          />
          <Controller
            name="fromAmount"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormControl>
                <TextField
                  type="number"
                  size="small"
                  label="From account"
                  {...field}
                  required
                  InputProps={{
                    startAdornment: (
                      <Box display="flex" mr={1} gap={1} alignItems="center">
                        <Typography>{watchSendingAccountValue.currency}</Typography>
                        <Divider orientation="vertical" sx={{ height: '20px' }} />
                      </Box>
                    ),
                  }}
                />
              </FormControl>
            )}
          />
          {watchReceivingAccountValue.currency !== watchSendingAccountValue.currency && (
            <Controller
              name="toAmount"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <FormControl>
                  <TextField
                    type="number"
                    size="small"
                    label="To account"
                    {...field}
                    required
                    InputProps={{
                      startAdornment: (
                        <Box display="flex" mr={1} gap={1} alignItems="center">
                          <Typography>{watchReceivingAccountValue.currency}</Typography>
                          <Divider orientation="vertical" sx={{ height: '20px' }} />
                        </Box>
                      ),
                    }}
                  />
                </FormControl>
              )}
            />
          )}

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Date Time "
                  {...field}
                />
              </LocalizationProvider>
            )}
          />
          {isAllOptionsVisible && (
            <>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <TextField
                      multiline
                      type="text"
                      size="small"
                      rows={3}
                      label="Description"
                      {...field}
                    />
                  </FormControl>
                )}
              />
            </>
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" my={2}>
          <Button
            startIcon={isAllOptionsVisible ? <ExpandLessRounded /> : <ExpandMoreRounded />}
            onClick={() => setIsAllOptionsVisible((current) => !current)}
          >
            {isAllOptionsVisible ? 'Show less' : 'Show more'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton onClick={onSubmit(handleSubmit)} color="success">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
