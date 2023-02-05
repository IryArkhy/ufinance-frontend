import { Box, Typography } from '@mui/material';
import React from 'react';

import { Account } from '../../../lib/api/accounts';
import { setSelectedAccount } from '../../../redux/accounts/accountsSlice';
import { getAccounts, getSelectedAccount } from '../../../redux/accounts/selectors';
import { useDispatch, useSelector } from '../../../redux/hooks';
import { groupAccountsByType } from '../utils';

import { AccountCard } from './AccountCard';
import { AccountsLoader } from './AccountsLoader';

interface AccountsPanelProps {
  onSelectAccount: (account: Account) => void;
}

export function AccountsPanel({ onSelectAccount }: AccountsPanelProps) {
  const accounts = useSelector(getAccounts);
  const dispatch = useDispatch();
  const selectedAccount = useSelector(getSelectedAccount);
  const [accountsByType, setAccountsByType] = React.useState<{
    crypto: Account[];
    regular: Account[];
  }>({ regular: [], crypto: [] });

  React.useEffect(() => {
    if (accounts.data.length) {
      const groupedAccounts = groupAccountsByType(accounts.data);
      setAccountsByType(groupedAccounts);
    }
  }, [accounts.data]);

  React.useEffect(() => {
    if (!selectedAccount) {
      if (accountsByType.regular.length) {
        dispatch(setSelectedAccount(accountsByType.regular[0]));
      } else if (accountsByType.crypto.length) {
        dispatch(setSelectedAccount(accountsByType.crypto[0]));
      }
    }
  }, [accountsByType]);

  if (accounts.loading === 'pending') {
    return <AccountsLoader />;
  }

  if (accounts.data.length) {
    return (
      <>
        <Box display="flex" flexWrap="wrap" gap={3}>
          {accountsByType.regular.length ? (
            accountsByType.regular.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onCardClick={() => onSelectAccount(account)}
                isSelected={selectedAccount?.id === account.id}
              />
            ))
          ) : (
            <Typography variant="body2">У вас немає рахунків у національній валюті.</Typography>
          )}
        </Box>
        <Typography variant="h6">Криптовалютні</Typography>
        <Box display="flex" flexWrap="wrap" gap={3}>
          {accountsByType.crypto.length ? (
            accountsByType.crypto.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onCardClick={() => onSelectAccount(account)}
                isSelected={selectedAccount?.id === account.id}
              />
            ))
          ) : (
            <Typography variant="body2">У вас немає криптовалютних рахунків.</Typography>
          )}
        </Box>
      </>
    );
  }

  return <Typography> У вас немає жодного рахунку. Створіть перший!</Typography>;
}
