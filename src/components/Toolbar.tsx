import { Avatar, Box, Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';

import UkrFlag from '../assets/ukraine.png';
import { stringAvatar } from '../lib/avatar';
import { getTotalBalance } from '../redux/balance/selectors';
import { fetchBalance } from '../redux/balance/thunks';
import { useDispatch, useSelector } from '../redux/hooks';
import { getUser } from '../redux/user/selectors';

export const Toolbar = React.memo(function Toolbar() {
  const { palette } = useTheme();
  const user = useSelector(getUser);
  const balance = useSelector(getTotalBalance);
  const dispatch = useDispatch();

  const avatarProps = stringAvatar(user.username);

  React.useEffect(() => {
    dispatch(fetchBalance());
  }, []);

  return (
    <Box mb={5} display="flex" justifyContent="flex-end" py={2}>
      <Box display="flex" alignItems="center" gap={3}>
        <img src={UkrFlag} style={{ width: '30px' }} />
        {balance && (
          <Tooltip title="Total balance in USD">
            <Typography
              variant="body2"
              fontWeight="600"
              color={balance.balance > 0 ? palette.success.light : palette.error.main}
            >
              {balance.balance.toLocaleString()} {balance.currency}
            </Typography>
          </Tooltip>
        )}
        <Box p="3px" border={`1px solid ${palette.grey[200]}`} borderRadius="50%">
          <Avatar sx={{ ...avatarProps.sx, width: 35, height: 35 }}>{avatarProps.children}</Avatar>
        </Box>
      </Box>
    </Box>
  );
});
