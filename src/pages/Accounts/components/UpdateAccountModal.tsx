import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Account,
  AvailableCurrency,
  createAccount,
  updateAccount,
} from '../../../lib/api/accounts';
import { AccountIconsNames } from '../types';
import { ACCOUNT_ICONS } from '../utils';

type FormValues = {
  name: string;
  balance: number;
  currency: AvailableCurrency;
  isCredit: boolean;
  icon: AccountIconsNames;
};

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFinish: (account: Account) => void;
  defaultValues?: FormValues;
  accountId?: string;
}

export function UpdateAccountModal({
  accountId,
  isOpen,
  onClose,
  defaultValues: propsValues,
  onSubmitFinish,
}: AccountModalProps) {
  type IconOption = keyof typeof ACCOUNT_ICONS;
  const iconOptions = Object.keys(ACCOUNT_ICONS) as IconOption[];
  const isCreate = Boolean(propsValues);

  const currencyOptions = ['UAH', 'USD', 'EUR', 'BTC', 'ETH'] as AvailableCurrency[];

  console.log({ propsValues });
  const defaultValues = {
    name: '',
    balance: 0.0,
    currency: currencyOptions[0],
    isCredit: false,
    icon: iconOptions[0],
  };

  const {
    control,
    handleSubmit: onSubmit,
    reset,
  } = useForm<FormValues>({
    defaultValues,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      if (isCreate) {
        const response = await createAccount({
          ...values,
          balance: typeof values.balance === 'string' ? parseFloat(values.balance) : values.balance,
        });
        onSubmitFinish(response.data.account);
      } else {
        if (accountId) {
          const { isCredit, icon, name } = values;
          const response = await updateAccount(accountId, { isCredit, icon, name });
          onSubmitFinish(response.data.account);
        }
      }
      onClose();
    } catch (error) {
      console.log();
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isCreate) {
      reset(defaultValues);
    } else {
      reset(propsValues);
    }
  }, [propsValues]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{isCreate ? 'Create' : 'Update'} account</DialogTitle>

      <DialogContent>
        <Box width="100%" display="flex" flexDirection="column" gap={3} pt={2}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormControl>
                <TextField type="text" size="small" label="Account name" {...field} />
              </FormControl>
            )}
          />

          {isCreate && (
            <>
              <Controller
                name="balance"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormControl>
                    <TextField type="number" size="small" label="Balance" {...field} />
                  </FormControl>
                )}
              />
              <Controller
                name="currency"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormControl>
                    <Autocomplete
                      options={currencyOptions}
                      {...field}
                      isOptionEqualToValue={(o, v) => isEqual(o, v)}
                      onChange={(_e, nextValue) => field.onChange(nextValue)}
                      renderInput={(params) => (
                        <TextField label="Currency" {...params} size="small" />
                      )}
                    />
                  </FormControl>
                )}
              />
            </>
          )}
          <Controller
            name="icon"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormControl>
                <Autocomplete
                  options={iconOptions}
                  {...field}
                  isOptionEqualToValue={(o, v) => isEqual(o, v)}
                  onChange={(_e, nextValue) => field.onChange(nextValue)}
                  getOptionLabel={(option) =>
                    `${option.toLocaleLowerCase().charAt(0).toUpperCase()}${option
                      .toLocaleLowerCase()
                      .slice(1)}`
                  }
                  renderOption={(props, iconKey) => {
                    const { Icon, color } = ACCOUNT_ICONS[iconKey as AccountIconsNames];
                    return (
                      <MenuItem {...props}>
                        <Icon sx={{ color, mr: 2 }} />{' '}
                        {iconKey.toLocaleLowerCase().charAt(0).toUpperCase() +
                          iconKey.toLocaleLowerCase().slice(1)}
                      </MenuItem>
                    );
                  }}
                  renderInput={(params) => {
                    const { Icon, color } = ACCOUNT_ICONS[field.value as AccountIconsNames];
                    return (
                      <TextField
                        {...params}
                        size="small"
                        label="Icon"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon sx={{ color }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    );
                  }}
                />
              </FormControl>
            )}
          />
          <Controller
            name="isCredit"
            control={control}
            render={({ field }) => (
              <FormControl>
                {propsValues && propsValues.balance < 0 ? (
                  <Tooltip title="Account cannot be negative if you want to change this field">
                    <FormControlLabel
                      control={<Checkbox defaultChecked {...field} />}
                      label="Credit account"
                      disabled={propsValues && propsValues.balance < 0}
                    />
                  </Tooltip>
                ) : (
                  <FormControlLabel
                    control={<Checkbox defaultChecked {...field} />}
                    label="Credit account"
                    disabled={propsValues && propsValues.balance < 0}
                  />
                )}
              </FormControl>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={isLoading} onClick={onSubmit(handleSubmit)} color="success">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
