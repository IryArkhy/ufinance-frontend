import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Slide,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as LoginPicture } from '../../assets/login-pic.svg';
import { ReactComponent as Logo } from '../../assets/logo-no-background.svg';
import { ErrorData } from '../../lib/api/utils';
import { NotificationContext } from '../../lib/notifications';
import { ROUTES } from '../../lib/router';
import { useDispatch } from '../../redux/hooks';
import { login, signUp } from '../../redux/user/thunks';

type LoginFormValues = {
  email: string;
  password: string;
};

type SignUpFormValues = {
  email: string;
  username: string;
  password: string;
};

export function AuthenticationView() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mode, setMode] = React.useState('login');

  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { control: registrationControll, handleSubmit: handleRegistration } =
    useForm<SignUpFormValues>({
      defaultValues: {
        email: '',
        username: '',
        password: '',
      },
    });

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const { notifyError } = React.useContext(NotificationContext);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible((current) => !current);
  };

  const changeToRegistration = () => {
    setMode('registration');
  };

  const changeToLogin = () => {
    setMode('login');
  };

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    const resultAction = await dispatch(login({ email: values.email, password: values.password }));
    setIsLoading(false);

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleSignUp = async ({ email, username, password }: SignUpFormValues) => {
    setIsLoading(true);
    const resultAction = await dispatch(signUp({ email, username, password }));
    setIsLoading(false);
    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <Box
        width={0.5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Slide
          direction="down"
          in={mode === 'login'}
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 800, exit: 100 }}
        >
          <Card sx={{ width: 0.7 }}>
            <CardContent sx={{ display: 'flex', gap: 7, px: 8 }}>
              <form onSubmit={handleSubmit(handleLogin)} style={{ flex: 1 }}>
                <Stack gap={4} flex={1}>
                  <Logo
                    style={{
                      width: 150,
                      height: 100,
                      alignSelf: 'center',
                    }}
                  />
                  <Typography align="center" variant="subtitle1">
                    Увійдіть у ваш профіль
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <FormControl>
                        <TextField
                          type="email"
                          autoComplete="email"
                          size="medium"
                          label="Електронна пошта"
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <FormControl variant="standard">
                        <TextField
                          id="standard-adornment-password"
                          type={isPasswordVisible ? 'text' : 'password'}
                          {...field}
                          label="Пароль"
                          autoComplete="current-password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handlePasswordVisibility}
                                >
                                  {isPasswordVisible ? (
                                    <VisibilityOff fontSize="small" />
                                  ) : (
                                    <Visibility fontSize="small" />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>
                    )}
                  />
                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    variant="contained"
                    sx={{ alignSelf: 'center' }}
                  >
                    Увійти
                  </LoadingButton>

                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="caption">Немає профілю?</Typography>
                    <Button
                      size="small"
                      color="primary"
                      variant="text"
                      onClick={changeToRegistration}
                    >
                      створити
                    </Button>
                  </Box>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Slide>
        <Slide
          direction="up"
          in={mode === 'registration'}
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 800, exit: 100 }}
        >
          <Card sx={{ width: 0.7 }}>
            <CardContent sx={{ display: 'flex', gap: 7, px: 8 }}>
              <form onSubmit={handleRegistration(handleSignUp)} style={{ flex: 1 }}>
                <Stack gap={4} flex={1}>
                  <Logo
                    style={{
                      width: 150,
                      height: 100,
                      alignSelf: 'center',
                    }}
                  />
                  <Typography align="center" variant="subtitle1">
                    Створити новий профіль
                  </Typography>
                  <Controller
                    name="email"
                    control={registrationControll}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <FormControl>
                        <TextField
                          type="email"
                          autoComplete="email"
                          size="medium"
                          label="Електронна пошта"
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="username"
                    control={registrationControll}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <FormControl>
                        <TextField
                          type="username"
                          autoComplete="username"
                          size="medium"
                          label="Нікнейм"
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="password"
                    control={registrationControll}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <FormControl variant="standard">
                        <TextField
                          id="standard-adornment-password"
                          type={isPasswordVisible ? 'text' : 'password'}
                          {...field}
                          label="Пароль"
                          autoComplete="current-password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handlePasswordVisibility}
                                >
                                  {isPasswordVisible ? (
                                    <VisibilityOff fontSize="small" />
                                  ) : (
                                    <Visibility fontSize="small" />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>
                    )}
                  />
                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    variant="contained"
                    sx={{ alignSelf: 'center' }}
                  >
                    Зареєструватись
                  </LoadingButton>

                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="caption">Вже маєш аккаунт?</Typography>

                    <Button size="small" color="primary" variant="text" onClick={changeToLogin}>
                      Увійти
                    </Button>
                  </Box>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Slide>
      </Box>
      <Box
        width={0.5}
        bgcolor="primary.main"
        flexDirection="column"
        justifyContent="center"
        sx={{ borderTopLeftRadius: '10%', borderBottomLeftRadius: '10%' }}
      >
        <Box
          width="100%"
          px={5}
          pt={3}
          display="flex"
          flexDirection="column"
          height="100%"
          gap={5}
          justifyContent="center"
        >
          <LoginPicture style={{ width: '95%', alignSelf: 'center' }} />
          <Box
            width={0.7}
            color={palette.getContrastText(palette.primary.main)}
            sx={{ backdropFilter: 'blur(10px)' }}
          >
            <List>
              <ListItem>
                <Typography variant="h4" fontWeight={900} letterSpacing="0.2rem">
                  Зміни свою фінансову дисципліну
                </Typography>
              </ListItem>
              <ListItem>
                <Typography textAlign="justify" variant="body2">
                  Переглядайте свій грошовий потік, прибутки та витрати
                </Typography>
              </ListItem>
              <ListItem>
                <Typography textAlign="justify" variant="body2">
                  Щоденний моніторинг транзакцій.{' '}
                  <Typography component="span" color="secondary.main" fontWeight="bold">
                    UFinance
                  </Typography>{' '}
                  відобразить гістограму, яка показує зміну щоденних загальних витрат
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
