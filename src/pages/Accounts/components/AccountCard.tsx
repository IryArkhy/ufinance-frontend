import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';

import { ActionConfirmationModalContext } from '../../../lib/userConfirmation';
import { Account } from '../types';
import { ACCOUNT_ICONS } from '../utils';

interface AccountCardProps {
  account: Account;
  isSelected: boolean;
  onCardClick: (account: Account) => void;
}

export function AccountCard({ account, isSelected, onCardClick }: AccountCardProps) {
  const { onTriggerConfirmation } = useContext(ActionConfirmationModalContext);
  const { Icon, color } = ACCOUNT_ICONS[account.icon as keyof typeof ACCOUNT_ICONS];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteMenuItemClick = () => {
    onTriggerConfirmation(
      () => undefined,
      "Are you sure, you'd like to delete account?",
      'This action will case deletion of all transactions that you looged as well as modifing your account balance.',
    );
  };
  return (
    <Card
      sx={{
        width: 350,
        mb: 2,
        cursor: 'pointer',
        transition: 'box-shadow ease-in 0.2s',
        ...(isSelected
          ? {
              transition: 'box-shadow ease-in 0.2s',
              boxShadow:
                'inset 0 0 50px #fff, inset 20px 0 80px #f0f,  inset -20px 0 80px #0ff, inset 20px 0 300px #f0f,inset -20px 0 300px #0ff, 0 0 50px #fff,-10px 0 80px #f0f,  10px 0 80px #0ff',
            }
          : {}),
      }}
      onClick={() => onCardClick(account)}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreHorizRoundedIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>Edit</MenuItem>
            <MenuItem onClick={handleDeleteMenuItemClick}>
              <Typography color="error.light">Delete</Typography>
            </MenuItem>
          </Menu>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, pt: 1, alignItems: 'center' }}>
          <Box>{<Icon sx={{ fill: color }} />}</Box>
          <Box>
            <Box display="flex" gap={1} alignItems="center">
              <Typography variant="subtitle1">{account.name}</Typography>
              {account.isCredit && <Chip label="Credit" size="small" />}
            </Box>
            <Box display="flex" gap={1}>
              <Typography>{account.balance}</Typography>
              <Typography>{account.currency}</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
