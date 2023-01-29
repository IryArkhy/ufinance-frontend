import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';

import { ActionConfirmationModalContext } from '../../../lib/userConfirmation';
import { Account, Transaction } from '../types';

import { TransactionModal } from './TransactionModal';

interface TransactionCardProps {
  transaction: Transaction;
  selectedAccount: Account;
  accounts: Account[];
}

export function TransactionCard({ transaction, selectedAccount, accounts }: TransactionCardProps) {
  const { onTriggerConfirmation } = React.useContext(ActionConfirmationModalContext);
  const [isShowingMore, setIsShowingMore] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isUpdateTransactionModalOpen, setIsUpdateTransactionModalOpen] = React.useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditAccountClick = () => {
    setIsUpdateTransactionModalOpen(true);
  };

  const handleDeleteMenuItemClick = () => {
    handleCloseMenu();
    onTriggerConfirmation(
      () => undefined,
      "Are you sure, you'd like to delete this transaction?",
      'This action will cause changes in your account(-s) balance.',
    );
  };
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <Typography variant="overline">{format(transaction.date, 'dd MMMM yyyy')}</Typography>

            <Divider orientation="vertical" sx={{ height: 20 }} />
            <Typography
              variant="overline"
              color={transaction.type === 'DEPOSIT' ? 'success.light' : 'error.light'}
            >
              {transaction.type}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreHorizRoundedIcon />
            </IconButton>
            <Menu
              id="transaction-actions-menu"
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
                  handleEditAccountClick();
                }}
              >
                Edit
              </MenuItem>
              <MenuItem onClick={handleDeleteMenuItemClick}>
                <Typography color="error.light">Delete</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box display="flex" alignItems="center">
          <Box flex={1}>
            {isShowingMore && (
              <Box display="flex" flexDirection="column" gap={2} width="100%" mb={3}>
                <Box display="flex" alignItems="center" gap={1} width="100%">
                  <Typography
                    width="15%"
                    textOverflow="ellipsis"
                    noWrap
                    color="GrayText"
                    fontWeight={600}
                    variant="body2"
                  >
                    Category
                  </Typography>{' '}
                  <Typography variant="body2">{transaction.category ?? '-'}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} width="100%">
                  <Typography
                    width="15%"
                    noWrap
                    textOverflow="ellipsis"
                    color="GrayText"
                    fontWeight={600}
                    variant="body2"
                  >
                    Payee
                  </Typography>{' '}
                  <Typography variant="body2">{transaction.payee ?? '-'}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} width="100%">
                  <Typography
                    width="15%"
                    noWrap
                    textOverflow="ellipsis"
                    color="GrayText"
                    fontWeight={600}
                    variant="body2"
                  >
                    Description
                  </Typography>{' '}
                  <Typography variant="body2">{transaction.description ?? '-'}</Typography>
                </Box>
              </Box>
            )}
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <Button
                startIcon={isShowingMore ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                onClick={() => setIsShowingMore((current) => !current)}
              >
                {isShowingMore ? 'Show less' : 'Show more'}
              </Button>
            </Box>
          </Box>
          <Box>
            <Typography color={transaction.type === 'DEPOSIT' ? 'success.light' : 'error.light'}>
              {transaction.type === 'DEPOSIT' ? transaction.amount : `-${transaction.amount}`}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <TransactionModal
        isOpen={isUpdateTransactionModalOpen}
        onClose={() => setIsUpdateTransactionModalOpen(false)}
        accounts={accounts}
        defaultValues={{
          account: selectedAccount,
          category: { id: '1', name: transaction.category ?? '' },
          payee: { id: '1', name: transaction.payee ?? '' },
          tags: [],
          amount: transaction.amount,
          transactionType: transaction.type,
          receivingAccount: null,
          description: transaction.description ?? '',
        }}
      />
    </Card>
  );
}
