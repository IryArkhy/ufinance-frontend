import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { PageWrapper, Toolbar } from '../../components';
import { ErrorData } from '../../lib/api/utils';
import { stringAvatar } from '../../lib/avatar';
import { NotificationContext } from '../../lib/notifications';
import { passwordRegex } from '../../lib/password';
import { useDispatch, useSelector } from '../../redux/hooks';
import { getUser } from '../../redux/user/selectors';
import { changePassword } from '../../redux/user/thunks';

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
};

export function ProfileView() {
  const user = useSelector(getUser);
  const { notifyError, notifySuccess } = React.useContext(NotificationContext);
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const [isOldPasswordVisible, setIsOldPasswordVisible] = React.useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleOldPasswordVisibility = () => {
    setIsOldPasswordVisible((current) => !current);
  };

  const handleNewPasswordVisibility = () => {
    setIsNewPasswordVisible((current) => !current);
  };

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    setIsLoading(true);
    const resultAction = await dispatch(changePassword(values));
    setIsLoading(false);

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    } else {
      reset({ newPassword: '', oldPassword: '' });
      notifySuccess('???????????? ??????????????!');
    }
  };

  const avatarProps = stringAvatar(user.username);

  return (
    <PageWrapper>
      <Toolbar />
      <Card sx={{ mb: 5 }}>
        <CardHeader title={<Typography variant="h6">???????????????????? ??????????????????????</Typography>} />
        <CardContent>
          <Box display="flex" gap={3}>
            <Avatar sx={{ ...avatarProps.sx, width: 100, height: 100, fontSize: '2rem' }}>
              {avatarProps.children}
            </Avatar>
            <Box flex={1}>
              <Box display="flex" flexDirection="column" mb={2}>
                <Typography color="GrayText">???????????????????? ??????????</Typography>
                <Typography>{user.email}</Typography>
              </Box>
              <Box display="flex" flexDirection="column">
                <Typography color="GrayText">??????????????</Typography>
                <Typography>{user.username}</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title={<Typography variant="h6">?????????????????? ????????????????</Typography>} />
        <CardContent>
          <Box width="100%" display="flex" flexDirection="column" gap={3}>
            <FormControl sx={{ gap: 2, width: '45%' }}>
              <Controller
                control={control}
                name="oldPassword"
                rules={{
                  required: "???? ???????? ????????'???????????? ?????? ????????????????????.",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <FormLabel>?????????????? ????????????</FormLabel>
                    <TextField
                      label="???????????????? ????????????"
                      autoComplete="current-password"
                      required
                      type={isOldPasswordVisible ? 'text' : 'password'}
                      {...field}
                      error={fieldState.invalid}
                      helperText={fieldState.error ? fieldState.error.message : undefined}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleOldPasswordVisibility}
                            >
                              {isOldPasswordVisible ? (
                                <Visibility fontSize="small" />
                              ) : (
                                <VisibilityOff fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}
              />
              <Controller
                control={control}
                name="newPassword"
                rules={{
                  required: "???? ???????? ????????'???????????? ?????? ????????????????????.",
                  pattern: {
                    value: passwordRegex,
                    message:
                      '???????????? ?????????????? ?????????????? ?????????? 1 ???????????? ?? 1 ???????????????? ????????????, 1 ???????????? (!@#$&*_), 1 ??????????, ???????????????? ?????????????????? ?? 8 ????????????????.',
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="?????????? ????????????"
                    type={isNewPasswordVisible ? 'text' : 'password'}
                    {...field}
                    required
                    error={fieldState.invalid}
                    helperText={fieldState.error ? fieldState.error.message : undefined}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleNewPasswordVisibility}
                          >
                            {isNewPasswordVisible ? (
                              <Visibility fontSize="small" />
                            ) : (
                              <VisibilityOff fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Box alignSelf="flex-end">
                <LoadingButton
                  onClick={handleSubmit(handleChangePassword)}
                  loading={isLoading}
                  variant="contained"
                >
                  ??????????????
                </LoadingButton>
              </Box>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
