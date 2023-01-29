import AddRounded from '@mui/icons-material/AddRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

import { PageWrapper, Toolbar } from '../../components';

import { AccountCard, AccountModal, TransactionCard } from './components';
import { TransactionModal } from './components/TransactionModal';
import { Account, AccountIconsNames, AvailableIcons, Transaction } from './types';

const accounts: Account[] = [
  {
    id: '1',
    name: 'Credit card UAH',
    balance: -2000,
    currency: 'UAH',
    icon: 'BANK',
    isCredit: true,
  },
  {
    id: '2',
    name: 'Universal Bank USD',
    balance: 1322,
    currency: 'USD',
    icon: 'CARD',
    isCredit: false,
  },
  {
    id: '3',
    name: 'Raifaisen Bank EUR',
    balance: 1322,
    currency: 'USD',
    icon: 'WALLET',
    isCredit: false,
  },

  {
    id: '4',
    name: 'Binance BTC',
    balance: 0.0828264,
    currency: 'BTC',
    icon: 'BTC',
    isCredit: false,
  },
];

export function AccountsView() {
  const cryptoCurrency = ['BTC', 'ETH'];
  const accountsByType = accounts.reduce(
    (accountTypes, acc) => {
      if (cryptoCurrency.includes(acc.currency)) {
        accountTypes.crypto.push(acc);
      } else {
        accountTypes.regular.push(acc);
      }
      return accountTypes;
    },
    { crypto: [] as Account[], regular: [] as Account[] },
  );

  const [selectedAccount, setSelectedAccount] = React.useState(accountsByType.regular[0]);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = React.useState(false);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = React.useState(false);
  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = React.useState(false);

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  const transactions: Transaction[] = [
    {
      id: 1,
      amount: 100,
      description: 'Bills',
      category: 'Salary',
      date: new Date(),
      payee: null,
      account: selectedAccount.name,
      type: 'DEPOSIT',
      tags: ['betbureau'],
    },
    {
      id: 2,
      amount: 12.34,
      description: null,
      category: null,
      date: new Date(),
      payee: 'Aroma Kava',
      account: selectedAccount.name,
      type: 'WITHDRAWAL',
      tags: ['bills', 'chears'],
    },
    {
      id: 3,
      amount: 230,
      description: 'New clothes',
      category: 'Shopping',
      date: new Date(),
      payee: 'Zara',
      account: selectedAccount.name,
      type: 'WITHDRAWAL',
      tags: ['clothes', 'accessories'],
    },
    {
      id: 4,
      amount: 500,
      description: 'Payback',
      category: 'Utilities',
      date: new Date(),
      payee: null,
      account: selectedAccount.name,
      type: 'DEPOSIT',
      tags: ['bills', 'chears'],
    },
  ];

  const handleTriggerUpdateAccountModal = () => {
    setIsUpdateAccountModalOpen(true);
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
            Create new account
          </Button>
        </Box>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {accountsByType.regular.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              isSelected={selectedAccount.id === account.id}
              onCardClick={handleSelectAccount}
              onEditAccountClick={handleTriggerUpdateAccountModal}
            />
          ))}
        </Box>
        <Typography variant="h6">Cryptocurrency Accounts</Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {accountsByType.crypto.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              isSelected={selectedAccount.id === account.id}
              onCardClick={handleSelectAccount}
              onEditAccountClick={handleTriggerUpdateAccountModal}
            />
          ))}
        </Box>
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
        <Box width="100%" display="flex" flexDirection="column" gap={4}>
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              selectedAccount={selectedAccount}
              accounts={accounts}
            />
          ))}
        </Box>
      </Box>
      <Box width="100%" display="flex" justifyContent="center" pt={2}>
        <LoadingButton variant="contained">Load more</LoadingButton>
      </Box>
      <AccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
      />
      <AccountModal
        isOpen={isUpdateAccountModalOpen}
        onClose={() => setIsUpdateAccountModalOpen(false)}
        defaultValues={{
          balance: selectedAccount.balance,
          name: selectedAccount.name,
          currency: selectedAccount.currency,
          isCredit: selectedAccount.isCredit,
          icon: AccountIconsNames[selectedAccount.icon as keyof typeof AccountIconsNames],
        }}
      />
      <TransactionModal
        isOpen={isCreateTransactionModalOpen}
        onClose={() => setIsCreateTransactionModalOpen(false)}
        accounts={accounts}
        defaultValues={{
          account: selectedAccount,
        }}
      />
    </PageWrapper>
  );
}

/**
 *       defaultValues={{
          account: selectedAccount,
          category: null,
          payee: null,
          tags: [],
          amount: 0,
          transactionType: 'WITHDRAWAL',
          receivingAccount: null,
          description: '',
        }}
 */

/**
 *     box-shadow: inset 0 0 50px #fff, inset 20px 0 80px #ff5722, inset -20px 0 80px #1c00ff, inset 20px 0 300px #ff5722, inset -20px 0 300px #0ff, 0 0 50px #fff, -10px 0 80px #2196f3, 10px 0 80px #673ab7;
 */
