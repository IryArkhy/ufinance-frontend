import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import React from 'react';

import { ActionConfirmationModal } from '../../../components/ConfirmationModal';
import { Account } from '../../../lib/api/accounts';
import { ErrorData } from '../../../lib/api/utils';
import { NotificationContext } from '../../../lib/notifications';
import { removeAccount } from '../../../redux/accounts/thunks';
import { fetchBalance } from '../../../redux/balance/thunks';
import { useDispatch } from '../../../redux/hooks';
import { AccountIconsNames } from '../types';
import { ACCOUNT_ICONS } from '../utils';

import { AccountModal } from './AccountModal';

interface AccountCardProps {
  account: Account;
  isSelected: boolean;
  onCardClick: (account: Account) => void;
}

export function AccountCard({ account, onCardClick, isSelected }: AccountCardProps) {
  const dispatch = useDispatch();

  const { notifyError, notifySuccess } = React.useContext(NotificationContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = React.useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = React.useState(false);
  const [isDeleteAccountLoading, setIsDeleteAcountLoading] = React.useState(false);

  const { Icon, color } = ACCOUNT_ICONS[account.icon as keyof typeof ACCOUNT_ICONS];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteAccount = async () => {
    setIsDeleteAcountLoading(true);
    const resultAction = await dispatch(removeAccount(account.id));

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    } else {
      await dispatch(fetchBalance());

      notifySuccess('Account deleted');
      setIsConfirmationModalOpen(false);
    }
    setIsDeleteAcountLoading(false);
  };

  const handleDeleteMenuItemClick = () => {
    handleCloseMenu();
    setIsConfirmationModalOpen(true);
  };

  return (
    <>
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
              id="account-actions-menu"
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
              onClose={handleCloseMenu}
            >
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  setIsUpdateAccountModalOpen(true);
                }}
              >
                Редагувати
              </MenuItem>
              <MenuItem onClick={handleDeleteMenuItemClick}>
                <Typography color="error.light">Видалити</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, pt: 1, alignItems: 'center' }}>
            <Box>{<Icon sx={{ fill: color }} />}</Box>
            <Box>
              <Box display="flex" gap={1} alignItems="center">
                <Typography variant="subtitle1">{account.name}</Typography>
                {account.isCredit && <Chip label="Кредитний" size="small" />}
              </Box>
              <Box display="flex" gap={1}>
                <Typography>{account.balance}</Typography>
                <Typography>{account.currency}</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <ActionConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        title="Ви впевнені, що хочете видалити рахунок?"
        description="Ця дія призведе до видалення всіх транзакцій, які ви зареєстрували, а також змінить загальний баланс вашого профілю."
        onConfirm={handleDeleteAccount}
        loading={isDeleteAccountLoading}
      />
      <Dialog
        open={isUpdateAccountModalOpen}
        onClose={() => setIsUpdateAccountModalOpen(false)}
        fullWidth
        keepMounted={false}
      >
        <AccountModal
          accountId={account.id}
          onClose={() => setIsUpdateAccountModalOpen(false)}
          defaultValues={{
            balance: account.balance,
            name: account.name,
            currency: account.currency,
            isCredit: account.isCredit,
            icon: AccountIconsNames[account.icon as keyof typeof AccountIconsNames],
          }}
        />
      </Dialog>
    </>
  );
}
