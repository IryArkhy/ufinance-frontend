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

import { AccountIconsNames, AvailableCurrency } from '../types';
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
  defaultValues?: FormValues;
}

export function AccountModal({ isOpen, onClose, defaultValues: propsValues }: AccountModalProps) {
  type IconOption = keyof typeof ACCOUNT_ICONS;
  const iconOptions = Object.keys(ACCOUNT_ICONS) as IconOption[];

  const currencyOptions = ['UAH', 'USD', 'EUR', 'BTC', 'ETH'] as AvailableCurrency[];

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

  const handleSubmit = (values: FormValues) => undefined;

  React.useEffect(() => {
    if (propsValues) {
      reset(propsValues);
    }
  }, [propsValues]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{defaultValues ? 'Update' : 'Create'} account</DialogTitle>

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
                  renderInput={(params) => <TextField label="Currency" {...params} size="small" />}
                />
              </FormControl>
            )}
          />
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
            rules={{
              required: true,
            }}
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
        <LoadingButton onClick={onSubmit(handleSubmit)} color="success">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
