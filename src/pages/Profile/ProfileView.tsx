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

import { PageWrapper, Toolbar } from '../../components';
import { stringAvatar } from '../../lib/avatar';
import { useSelector } from '../../redux/hooks';
import { getUser } from '../../redux/user/selectors';

export function ProfileView() {
  const user = useSelector(getUser);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = React.useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = React.useState(false);

  const handleOldPasswordVisibility = () => {
    setIsOldPasswordVisible((current) => !current);
  };

  const handleNewPasswordVisibility = () => {
    setIsNewPasswordVisible((current) => !current);
  };

  const avatarProps = stringAvatar(user.username);

  return (
    <PageWrapper>
      <Toolbar />
      <Card sx={{ mb: 5 }}>
        <CardHeader title={<Typography variant="h6">User Information</Typography>} />
        <CardContent>
          <Box display="flex" gap={3}>
            <Avatar sx={{ ...avatarProps.sx, width: 100, height: 100, fontSize: '2rem' }}>
              {avatarProps.children}
            </Avatar>
            <Box flex={1}>
              <Box display="flex" flexDirection="column" mb={2}>
                <Typography color="GrayText">Email</Typography>
                <Typography>{user.email}</Typography>
              </Box>
              <Box display="flex" flexDirection="column">
                <Typography color="GrayText">Username</Typography>
                <Typography>{user.username}</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title={<Typography variant="h6">Manage profile</Typography>} />
        <CardContent>
          <Box width="100%" display="flex" flexDirection="column" gap={3}>
            <FormControl sx={{ gap: 2, width: '45%' }}>
              <FormLabel>Change password</FormLabel>
              <TextField
                label="Old password"
                autoComplete="current-password"
                type={isOldPasswordVisible ? 'text' : 'password'}
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
              <TextField
                label="New password"
                type={isNewPasswordVisible ? 'text' : 'password'}
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
              <Box alignSelf="flex-end">
                <LoadingButton loading={false} variant="contained">
                  Submit
                </LoadingButton>
              </Box>
            </FormControl>
            <FormControl sx={{ gap: 2, width: '45%' }}>
              <FormLabel>Change username</FormLabel>
              <TextField label="New username" />
              <Box alignSelf="flex-end">
                <LoadingButton loading={false} variant="contained">
                  Submit
                </LoadingButton>
              </Box>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
