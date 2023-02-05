import { Box, Typography } from '@mui/material';
import React from 'react';

import { Account } from '../../../lib/api/accounts';
import { getAccounts, getSelectedAccount } from '../../../redux/accounts/selectors';
import { useSelector } from '../../../redux/hooks';
import { groupAccountsByType } from '../utils';

import { AccountCard } from './AccountCard';
import { AccountsLoader } from './AccountsLoader';

interface AccountsPanelProps {
  onSelectAccount: (account: Account) => void;
}

export function AccountsPanel({ onSelectAccount }: AccountsPanelProps) {
  const accounts = useSelector(getAccounts);
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
            <Typography variant="body2">You have no accounts in national currency.</Typography>
          )}
        </Box>
        <Typography variant="h6">Cryptocurrency Accounts</Typography>
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
            <Typography variant="body2">You have no Cryptocurrency accounts.</Typography>
          )}
        </Box>
      </>
    );
  }

  return <Typography> You have no accounts. Create one</Typography>;
}
