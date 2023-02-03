import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';

import { ActionConfirmationModal } from '../../../components/ConfirmationModal';
import { Account } from '../../../lib/api/accounts';
import { Transaction } from '../../../lib/api/transactions';
import { ErrorData } from '../../../lib/api/utils';
import { NotificationContext } from '../../../lib/notifications';
import { removeTransaction } from '../../../redux/accounts/thunks';
import { fetchBalance } from '../../../redux/balance/thunks';
import { useDispatch } from '../../../redux/hooks';

import { FormTransactionType, UpdateTransactionModal } from './TransactionFormsModals';

interface TransactionCardProps {
  transaction: Transaction;

  accounts: Account[];
}

export function TransactionCard({ transaction, accounts }: TransactionCardProps) {
  const dispatch = useDispatch();
  const { notifyError, notifySuccess } = React.useContext(NotificationContext);
  const [isShowingMore, setIsShowingMore] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isUpdateTransactionModalOpen, setIsUpdateTransactionModalOpen] = React.useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = React.useState(false);
  const [isDeleteTransactionLoading, setIsDeleteTransactionLoading] = React.useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditTransactionClick = () => {
    setIsUpdateTransactionModalOpen(true);
  };

  const deleteTransaction = async () => {
    setIsDeleteTransactionLoading(true);

    const resultAction = await dispatch(
      removeTransaction({ accountId: transaction.fromAccountId, id: transaction.id }),
    );
    setIsConfirmationModalOpen(false);

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    } else {
      await dispatch(fetchBalance());

      notifySuccess('Transaction deleted');
      setIsConfirmationModalOpen(false);
    }
    setIsDeleteTransactionLoading(false);
  };

  const handleDeleteMenuItemClick = () => {
    handleCloseMenu();
    setIsConfirmationModalOpen(true);
  };

  const getCardData = (): { color: string; sign: '+' | '-'; amount: number } => {
    if (transaction.type === 'DEPOSIT') {
      return { color: 'success.light', sign: '+', amount: transaction.amount };
    }

    return { color: 'error.light', sign: '-', amount: transaction.amount };
  };

  const cardData = getCardData();

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <Typography variant="overline">
              {format(new Date(transaction.date), 'dd MMMM yyyy, HH:mm')}
            </Typography>

            <Divider orientation="vertical" sx={{ height: 20 }} />
            <Typography variant="overline" color={cardData.color}>
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
                  handleEditTransactionClick();
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
                  <Typography variant="body2">{transaction.category?.name ?? '-'}</Typography>
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
                  </Typography>
                  <Typography variant="body2">{transaction.payee?.name ?? '-'}</Typography>
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
                  </Typography>
                  <Typography variant="body2">
                    {transaction.description ? transaction.description : '-'}
                  </Typography>
                </Box>
                {transaction.tags && (
                  <Box display="flex" alignItems="center" gap={1} width="100%">
                    <Typography
                      width="15%"
                      textOverflow="ellipsis"
                      noWrap
                      color="GrayText"
                      fontWeight={600}
                      variant="body2"
                    >
                      Tags
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      {transaction.tags.map((tagOnTransaction) => (
                        <Chip
                          key={tagOnTransaction.id}
                          label={tagOnTransaction.tag.name}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
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
            <Typography color={cardData.color}>
              {cardData.sign}
              {cardData.amount}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <UpdateTransactionModal
        isOpen={isUpdateTransactionModalOpen}
        onClose={() => setIsUpdateTransactionModalOpen(false)}
        transaction={transaction as FormTransactionType}
        accounts={accounts}
      />
      <ActionConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        title="Are you sure, you'd like to delete this transaction?"
        description="This action will cause current account balance change."
        onConfirm={deleteTransaction}
        loading={isDeleteTransactionLoading}
      />
    </Card>
  );
}
