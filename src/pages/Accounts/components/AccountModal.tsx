import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
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
  AvailableCurrency,
  CreateAccountReqBody,
  UpdateAccountReqBody,
} from '../../../lib/api/accounts';
import { ErrorData } from '../../../lib/api/utils';
import { NotificationContext } from '../../../lib/notifications';
import { createNewAccount, editAccount } from '../../../redux/accounts/thunks';
import { fetchBalance } from '../../../redux/balance/thunks';
import { useDispatch } from '../../../redux/hooks';
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
  onClose: () => void;
  defaultValues?: FormValues;
  accountId?: string;
}

export function AccountModal({
  accountId,
  onClose,
  defaultValues: propsValues,
}: AccountModalProps) {
  const dispatch = useDispatch();
  const { notifyError, notifySuccess } = React.useContext(NotificationContext);
  const [isLoading, setIsLoading] = React.useState(false);

  type IconOption = keyof typeof ACCOUNT_ICONS;
  const iconOptions = Object.keys(ACCOUNT_ICONS) as IconOption[];
  const isCreate = Boolean(!propsValues);
  const currencyOptions: AvailableCurrency[] = ['UAH', 'USD', 'EUR', 'BTC', 'ETH'];

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

  const handleCreateAccount = async (values: CreateAccountReqBody) => {
    const resultAction = await dispatch(createNewAccount(values));

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    } else {
      await dispatch(fetchBalance());
      notifySuccess('Account created');
    }
  };

  const handleUpdateAccount = async (values: UpdateAccountReqBody) => {
    if (!accountId) {
      console.error('Account id is not provided');
      return;
    }

    const resultAction = await dispatch(editAccount({ data: values, accountId }));

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    } else {
      notifySuccess('Account updated');
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    if (isCreate) {
      const balance =
        typeof values.balance === 'string' ? parseFloat(values.balance) : values.balance;

      await handleCreateAccount({
        ...values,
        balance,
      });
    } else {
      await handleUpdateAccount(values);
    }

    setIsLoading(false);
    onClose();
  };

  React.useEffect(() => {
    if (isCreate) {
      reset(defaultValues);
    } else {
      reset(propsValues);
    }
  }, [propsValues]);

  return (
    <>
      <DialogTitle>{isCreate ? 'Створити' : 'Оновити'} рахунок</DialogTitle>

      <DialogContent>
        <Box width="100%" display="flex" flexDirection="column" gap={3} pt={2}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Поле обов'язкове для заповнення",
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
                    <TextField type="number" size="small" label="Баланс" {...field} />
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
                        <TextField label="Валюта" {...params} size="small" />
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
                        label="Іконка"
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
                  <Tooltip title="Рахунок не може бути від'ємним, якщо ви хочете змінити це поле.">
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Кредитний рахунок"
                      disabled={propsValues && propsValues.balance < 0}
                    />
                  </Tooltip>
                ) : (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Кредитний рахунок"
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
          Підтвердити
        </LoadingButton>
      </DialogActions>
    </>
  );
}
