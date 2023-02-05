import AddRounded from '@mui/icons-material/AddRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Typography } from '@mui/material';
import React from 'react';

import { PageWrapper, Toolbar } from '../../components';
import { GridLoader } from '../../components/GridLoader';
import { Account } from '../../lib/api/accounts';
import { ErrorData } from '../../lib/api/utils';
import { NotificationContext } from '../../lib/notifications';
import { resetTransactions, setSelectedAccount } from '../../redux/accounts/accountsSlice';
import { getAccounts, getSelectedAccount, getTransactions } from '../../redux/accounts/selectors';
import { fetchAccounts, fetchTransactions } from '../../redux/accounts/thunks';
import { fetchCategories } from '../../redux/categories/thunks';
import { useDispatch, useSelector } from '../../redux/hooks';
import { fetchPayees } from '../../redux/payees/thunks';
import { fetchTags } from '../../redux/tags/thunks';

import { AccountModal, TransactionCard, TransferCard } from './components';
import { AccountsPanel } from './components/AccountsPanel';
import { CreateTransactionModal } from './components/TransactionFormsModals';

export function AccountsView() {
  const accounts = useSelector(getAccounts);
  const selectedAccount = useSelector(getSelectedAccount);
  const transactions = useSelector(getTransactions);
  const dispatch = useDispatch();
  const { notifyError } = React.useContext(NotificationContext);

  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = React.useState(false);

  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = React.useState(false);
  const [transactionsCursor, setTransactionsCursor] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (transactions.data.length === transactions.count) {
      setTransactionsCursor(undefined);
    }
  }, [transactions.count, transactions.data.length]);

  const loadAccountTransactions = async (accountId: string, cursor?: string, limit = 10) => {
    const resultAction = await dispatch(fetchTransactions({ accountId, data: { cursor, limit } }));

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    } else {
      if (resultAction.payload && 'transactions' in resultAction.payload) {
        const isEmpty = resultAction.payload.transactions.length === 0;
        if (isEmpty) {
          setTransactionsCursor(undefined);
          return;
        }
        const lastItemIndex = resultAction.payload.transactions.length - 1;
        setTransactionsCursor(resultAction.payload.transactions[lastItemIndex].id);
      }
    }
  };

  const loadAccounts = async () => {
    const resultAction = await dispatch(fetchAccounts());

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    }

    return resultAction.payload;
  };

  const loadCategories = async () => {
    const resultAction = await dispatch(fetchCategories());

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    }
  };

  const loadPayees = async () => {
    const resultAction = await dispatch(fetchPayees());

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    }
  };

  const loadTags = async () => {
    const resultAction = await dispatch(fetchTags());

    if (resultAction.meta.requestStatus === 'rejected') {
      notifyError((resultAction.payload as ErrorData).message);
    }
  };

  const loadData = async () => {
    dispatch(resetTransactions());
    await Promise.all([loadAccounts(), loadCategories(), loadPayees(), loadTags()]);
  };

  React.useEffect(() => {
    dispatch(resetTransactions());
    loadData();
  }, []);

  React.useEffect(() => {
    if (selectedAccount) {
      dispatch(resetTransactions());
      loadAccountTransactions(selectedAccount.id, undefined, 10);
    }
  }, [selectedAccount]);

  const handleLoadMore = async () => {
    if (selectedAccount && transactionsCursor !== undefined) {
      await loadAccountTransactions(selectedAccount.id, transactionsCursor, 10);
    }
  };

  const handleSelectAccount = (account: Account) => {
    setTransactionsCursor(undefined);
    dispatch(setSelectedAccount(account));
  };

  const renderTransactions = () => {
    if (transactions.loading === 'pending' && transactions.data.length === 0) {
      return <GridLoader />;
    }

    if (transactions.data.length && selectedAccount) {
      return (
        <Box width="100%" display="flex" flexDirection="column" gap={4}>
          {transactions.data.map((transaction) =>
            transaction.type === 'TRANSFER' ? (
              <TransferCard
                key={transaction.id}
                transaction={transaction}
                accounts={accounts.data}
                selectedAccount={selectedAccount}
              />
            ) : (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                accounts={accounts.data}
              />
            ),
          )}
        </Box>
      );
    }

    return <Typography>Ви поки не маєте жодної транзакції. Додайте першу!</Typography>;
  };

  return (
    <PageWrapper>
      <Toolbar />
      <Box width="100%" display="flex" flexDirection="column" gap={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Regular Currency Accounts</Typography>
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => setIsCreateAccountModalOpen(true)}
          >
            Створити аккаунт
          </Button>
        </Box>

        <AccountsPanel onSelectAccount={handleSelectAccount} />
        {Boolean(accounts.data.length) && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Transactions</Typography>
              <Button
                variant="contained"
                disabled={accounts.data.length === 0}
                startIcon={<AddRounded />}
                onClick={() => setIsCreateTransactionModalOpen(true)}
              >
                Додати транзакцію
              </Button>
            </Box>
            {renderTransactions()}
          </>
        )}
      </Box>
      {transactionsCursor !== undefined && (
        <Box width="100%" display="flex" justifyContent="center" pt={2}>
          <LoadingButton
            loading={transactions.loading === 'pending' && transactions.data.length > 0}
            variant="contained"
            onClick={handleLoadMore}
          >
            Більше
          </LoadingButton>
        </Box>
      )}

      <Dialog
        open={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
        fullWidth
        keepMounted={false}
      >
        <AccountModal onClose={() => setIsCreateAccountModalOpen(false)} />
      </Dialog>

      <Dialog
        open={isCreateTransactionModalOpen}
        onClose={() => setIsCreateTransactionModalOpen(false)}
        fullWidth
        keepMounted={false}
      >
        <CreateTransactionModal onClose={() => setIsCreateTransactionModalOpen(false)} />
      </Dialog>
    </PageWrapper>
  );
}

/**
 *     box-shadow: inset 0 0 50px #fff, inset 20px 0 80px #ff5722, inset -20px 0 80px #1c00ff, inset 20px 0 300px #ff5722, inset -20px 0 300px #0ff, 0 0 50px #fff, -10px 0 80px #2196f3, 10px 0 80px #673ab7;
 */
