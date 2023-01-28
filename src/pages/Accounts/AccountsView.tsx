import { ExpandMoreRounded } from '@mui/icons-material';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CardTravelRoundedIcon from '@mui/icons-material/CardTravelRounded';
import CurrencyBitcoinRoundedIcon from '@mui/icons-material/CurrencyBitcoinRounded';
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import MoneyRoundedIcon from '@mui/icons-material/MoneyRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded';
import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';

import { PageWrapper, Toolbar } from '../../components';

const ACCOUNT_ICONS = {
  BANK: {
    Icon: AccountBalanceRoundedIcon,
    color: '#00425A',
  },
  CARD: {
    Icon: PaymentRoundedIcon,
    color: '#F48484',
  },
  MONEY: {
    Icon: MonetizationOnRoundedIcon,
    color: '#FC7300',
  },
  BILL: {
    Icon: MoneyRoundedIcon,
    color: '#1F8A70',
  },
  SAVINGS: {
    Icon: SavingsRoundedIcon,
    color: '#EBC7E6',
  },
  WALLET: {
    Icon: AccountBalanceWalletRoundedIcon,
    color: '#BFDB38',
  },
  USD: {
    Icon: AttachMoneyRoundedIcon,
    color: '#84D2C5',
  },
  EUR: {
    Icon: EuroRoundedIcon,
    color: '#B05A7A',
  },
  BTC: {
    Icon: CurrencyBitcoinRoundedIcon,
    color: '#FEBE8C',
  },
  PAYMENTS: {
    Icon: PaymentsRoundedIcon,
    color: '#F7A4A4',
  },
  SHOPPING: {
    Icon: ShoppingBasketRoundedIcon,
    color: '#E3ACF9',
  },
  TRAVEL: {
    Icon: CardTravelRoundedIcon,
    color: '#FBC252',
  },
};
type Account = {
  id: string;
  name: string;
  balance: number;
  currency: string;
  icon: string;
  isCredit: boolean;
};

const accounts: Account[] = [
  {
    id: '1',
    name: 'Credit card UAH',
    balance: 2000,
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
  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = React.useState(false);

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  const transactions = [
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

  return (
    <PageWrapper>
      <Toolbar />
      <Box width="100%" display="flex" flexDirection="column" gap={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Regular Currency Accounts</Typography>
          <Button variant="contained" startIcon={<AddRounded />}>
            Create new account
          </Button>
        </Box>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {accountsByType.regular.map((account) => {
            const { Icon, color } = ACCOUNT_ICONS[account.icon as keyof typeof ACCOUNT_ICONS];
            return (
              <Card
                key={account.id}
                sx={{
                  width: 350,
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'box-shadow ease-in 0.2s',
                  ...(selectedAccount.id === account.id
                    ? {
                        transition: 'box-shadow ease-in 0.2s',
                        boxShadow:
                          'inset 0 0 50px #fff, inset 20px 0 80px #f0f,  inset -20px 0 80px #0ff, inset 20px 0 300px #f0f,inset -20px 0 300px #0ff, 0 0 50px #fff,-10px 0 80px #f0f,  10px 0 80px #0ff',
                      }
                    : {}),
                }}
                onClick={() => handleSelectAccount(account)}
              >
                <CardContent sx={{ display: 'flex', gap: 3, pt: 1 }}>
                  <Box>{<Icon sx={{ fill: color }} />}</Box>
                  <Box>
                    <Typography variant="subtitle1">{account.name}</Typography>
                    <Box display="flex" gap={1}>
                      <Typography>{account.balance}</Typography>
                      <Typography>{account.currency}</Typography>
                    </Box>
                  </Box>
                  <Box flex={1}>
                    {account.isCredit && (
                      <Typography
                        color={selectedAccount.id === account.id ? 'white' : 'secondary'}
                        textAlign="end"
                      >
                        Credit
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
        <Typography variant="h6">Cryptocurrency Accounts</Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {accountsByType.crypto.map((account) => {
            const { Icon, color } = ACCOUNT_ICONS[account.icon as keyof typeof ACCOUNT_ICONS];
            return (
              <Card
                key={account.id}
                sx={{
                  width: 350,
                  cursor: 'pointer',
                  ...(selectedAccount.id === account.id
                    ? {
                        transition: 'box-shadow ease-in 0.2s',
                        boxShadow:
                          'inset 0 0 50px #fff, inset 20px 0 80px #f0f,  inset -20px 0 80px #0ff, inset 20px 0 300px #f0f,inset -20px 0 300px #0ff, 0 0 50px #fff,-10px 0 80px #f0f,  10px 0 80px #0ff',
                      }
                    : {}),
                }}
                onClick={() => handleSelectAccount(account)}
              >
                <CardContent sx={{ display: 'flex', gap: 3, pt: 1 }}>
                  <Box>{<Icon sx={{ fill: color }} />}</Box>
                  <Box>
                    <Typography variant="subtitle1">{account.name}</Typography>
                    <Box display="flex" gap={1}>
                      <Typography>{account.balance}</Typography>
                      <Typography>{account.currency}</Typography>
                    </Box>
                  </Box>
                  <Box flex={1}>
                    {account.isCredit && (
                      <Typography
                        color={selectedAccount.id === account.id ? 'white' : 'secondary'}
                        textAlign="end"
                      >
                        Credit
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Transactions</Typography>
          <Button variant="contained" startIcon={<AddRounded />}>
            Add transaction
          </Button>
        </Box>
        <Box width="100%" display="flex" flexDirection="column" gap={4}>
          {transactions.map((transaction) => {
            return (
              <Card key={transaction.id}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={1} flex={1}>
                      <Typography variant="overline">
                        {format(transaction.date, 'dd MMMM yyyy')}
                      </Typography>

                      <Divider orientation="vertical" sx={{ height: 20 }} />
                      <Typography
                        variant="overline"
                        color={transaction.type === 'DEPOSIT' ? 'success.light' : 'error.light'}
                      >
                        {transaction.type}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        color={transaction.type === 'DEPOSIT' ? 'success.light' : 'error.light'}
                      >
                        {transaction.type === 'DEPOSIT'
                          ? transaction.amount
                          : `-${transaction.amount}`}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="flex-start">
                    <Button startIcon={<ExpandMoreRounded />}>Show more</Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </PageWrapper>
  );
}

/**
 *     box-shadow: inset 0 0 50px #fff, inset 20px 0 80px #ff5722, inset -20px 0 80px #1c00ff, inset 20px 0 300px #ff5722, inset -20px 0 300px #0ff, 0 0 50px #fff, -10px 0 80px #2196f3, 10px 0 80px #673ab7;
 */
