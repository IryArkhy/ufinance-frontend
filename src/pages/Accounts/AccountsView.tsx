import AddRounded from '@mui/icons-material/AddRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React from 'react';

import { PageWrapper, Toolbar } from '../../components';
import { Account, deleteAccount, getAccounts } from '../../lib/api/accounts';
import { Transaction, getTransactions } from '../../lib/api/transactions';
import { fetchBalance } from '../../redux/balance.ts/thunks';
import { useDispatch, useSelector } from '../../redux/hooks';
import { getToken } from '../../redux/user/selectors';

import { AccountCard, AccountModal, TransactionCard, TransferCard } from './components';
import { CreateTransactionModal } from './components/TransactionFormsModals';
import { AccountIconsNames } from './types';
import { groupAccountsByType } from './utils';

export function AccountsView() {
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [accountsByType, setAccountsByType] = React.useState<{
    crypto: Account[];
    regular: Account[];
  }>({ regular: [], crypto: [] });

  const token = useSelector(getToken);
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = React.useState(false);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = React.useState(false);
  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = React.useState(false);
  const [isAcccountsLoading, setIsAccountsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [transactionsOffset, setTransactionsOffset] = React.useState<number | null>(0);
  const [transactionsLimit, setTransactionsLimit] = React.useState(3);
  const [isTransactionLoading, setIsTransactionLoading] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      setIsAccountsLoading(true);

      getAccounts()
        .then((response) => {
          if (response.data) {
            setAccounts(response.data.accounts);
            const accountsByType = groupAccountsByType(response.data.accounts);
            setAccountsByType(accountsByType);
            handleSelectAccount(accountsByType.regular[0] ?? null);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setIsAccountsLoading(false));
    }
  }, [token]);

  React.useEffect(() => {
    if (selectedAccount) {
      setIsTransactionLoading(true);
      getTransactions(selectedAccount.id, {
        offset: transactionsOffset ?? 0,
        limit: transactionsLimit,
      })
        .then((response) => {
          setTransactions(response.data.transactions);
          setTransactionsOffset(response.data.offset);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsTransactionLoading(false);
        });
    }
  }, [selectedAccount]);

  React.useEffect(() => {
    if (accounts.length) {
      setAccountsByType(groupAccountsByType(accounts));
    }
  }, [accounts.length]);

  const handleLoadMore = async () => {
    try {
      if (transactionsOffset && selectedAccount) {
        setIsTransactionLoading(true);
        const response = await getTransactions(selectedAccount.id, {
          offset: transactionsOffset ?? 0,
          limit: transactionsLimit,
        });

        setTransactions((current) => [...current, ...response.data.transactions]);
        setTransactionsOffset(response.data.offset);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setTransactionsOffset(0);
  };

  const handleTriggerUpdateAccountModal = () => {
    setIsUpdateAccountModalOpen(true);
  };

  const handleSubmitNewAccountCompleted = (newAccount: Account) => {
    setAccounts((c) => [...c, newAccount]);
  };

  const handleSubmitAccountUpdateCompleted = (account: Account) => {
    setAccounts((c) => c.map((acc) => (acc.id === account.id ? account : acc)));
    setAccountsByType((current) => {
      if (['BTC', 'ETH'].includes(account.currency)) {
        current.crypto = current.crypto.map((acc) => (acc.id === account.id ? account : acc));
      } else {
        current.regular = current.regular.map((acc) => (acc.id === account.id ? account : acc));
      }
      return current;
    });
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const response = await deleteAccount(accountId);
      setAccounts((c) => c.filter((acc) => acc.id !== response.data.deletedAccount.id));
      await dispatch(fetchBalance());
    } catch (error) {
      console.log(error);
    }
  };

  const renderAccounts = () => {
    if (isAcccountsLoading) {
      return <CircularProgress />;
    }
    if (accounts.length && selectedAccount) {
      return (
        <>
          <Box display="flex" flexWrap="wrap" gap={3}>
            {accountsByType.regular.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                isSelected={selectedAccount.id === account.id}
                onCardClick={handleSelectAccount}
                onEditAccountClick={handleTriggerUpdateAccountModal}
                onDeleteAccount={handleDeleteAccount}
              />
            ))}
          </Box>
          <Typography variant="h6">Cryptocurrency Accounts</Typography>
          <Box display="flex" flexWrap="wrap" gap={3}>
            {accountsByType.crypto.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                isSelected={selectedAccount.id === account.id}
                onCardClick={handleSelectAccount}
                onEditAccountClick={handleTriggerUpdateAccountModal}
                onDeleteAccount={handleDeleteAccount}
              />
            ))}
          </Box>
        </>
      );
    }

    return <Typography> You have no accounts. Create one</Typography>;
  };

  const renderTransactions = () => {
    if (isTransactionLoading && transactions.length === 0) {
      return <CircularProgress />;
    }

    if (transactions.length && selectedAccount) {
      return (
        <Box width="100%" display="flex" flexDirection="column" gap={4}>
          {transactions.map((transaction) =>
            transaction.type === 'TRANSFER' ? (
              <TransferCard
                key={transaction.id}
                transaction={transaction}
                accounts={accounts}
                selectedAccount={selectedAccount}
              />
            ) : (
              <TransactionCard key={transaction.id} transaction={transaction} accounts={accounts} />
            ),
          )}
        </Box>
      );
    }

    return <Typography>You have no transactions. Create one</Typography>;
  };

  if (accounts.length === 0 && !selectedAccount) {
    return <CircularProgress />;
  }

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
            Create new account
          </Button>
        </Box>
        {renderAccounts()}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Transactions</Typography>
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => setIsCreateTransactionModalOpen(true)}
          >
            Add transaction
          </Button>
        </Box>
        {renderTransactions()}
      </Box>
      {transactionsOffset && (
        <Box width="100%" display="flex" justifyContent="center" pt={2}>
          <LoadingButton
            loading={isTransactionLoading && transactions.length > 0}
            variant="contained"
            onClick={handleLoadMore}
          >
            Load more
          </LoadingButton>
        </Box>
      )}

      <AccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
        onSubmitFinish={handleSubmitNewAccountCompleted}
      />

      <AccountModal
        accountId={selectedAccount?.id}
        isOpen={isUpdateAccountModalOpen}
        onClose={() => setIsUpdateAccountModalOpen(false)}
        defaultValues={
          selectedAccount
            ? {
                balance: selectedAccount.balance,
                name: selectedAccount.name,
                currency: selectedAccount.currency,
                isCredit: selectedAccount.isCredit,
                icon: AccountIconsNames[selectedAccount.icon as keyof typeof AccountIconsNames],
              }
            : undefined
        }
        onSubmitFinish={handleSubmitAccountUpdateCompleted}
      />
      <CreateTransactionModal
        isOpen={isCreateTransactionModalOpen}
        onClose={() => setIsCreateTransactionModalOpen(false)}
        accounts={accounts}
        selectedAccount={selectedAccount}
      />
    </PageWrapper>
  );
}

/**
 *     box-shadow: inset 0 0 50px #fff, inset 20px 0 80px #ff5722, inset -20px 0 80px #1c00ff, inset 20px 0 300px #ff5722, inset -20px 0 300px #0ff, 0 0 50px #fff, -10px 0 80px #2196f3, 10px 0 80px #673ab7;
 */
