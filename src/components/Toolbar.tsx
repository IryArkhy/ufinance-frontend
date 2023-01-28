import { Avatar, Box, Tooltip, Typography, useTheme } from '@mui/material';

import UkrFlag from '../assets/ukraine.png';
import { stringAvatar } from '../lib/avatar';
import { useSelector } from '../redux/hooks';
import { getUser } from '../redux/user/selectors';

export function Toolbar() {
  const { palette } = useTheme();
  const user = useSelector(getUser);

  const avatarProps = stringAvatar(user.username);

  const balance = 1000;

  return (
    <Box mb={5} display="flex" justifyContent="flex-end" py={2}>
      <Box display="flex" alignItems="center" gap={3}>
        <img src={UkrFlag} style={{ width: '30px' }} />
        <Tooltip title="Total balance">
          <Typography
            variant="body2"
            fontWeight="600"
            color={balance > 0 ? palette.success.light : palette.error.main}
          >
            {balance} UAH
          </Typography>
        </Tooltip>
        <Box p="3px" border={`1px solid ${palette.grey[200]}`} borderRadius="50%">
          <Avatar sx={{ ...avatarProps.sx, width: 35, height: 35 }}>{avatarProps.children}</Avatar>
        </Box>
      </Box>
    </Box>
  );
}
