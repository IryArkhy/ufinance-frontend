import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

import { Account } from '../../../lib/api/accounts';
import { getAccounts, getSelectedAccount } from '../../../redux/accounts/selectors';
import { useSelector } from '../../../redux/hooks';
import { groupAccountsByType } from '../utils';

import { AccountCard } from './AccountCard';

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
    return <CircularProgress />;
  }

  if (accounts.data.length) {
    return (
      <>
        <Box display="flex" flexWrap="wrap" gap={3}>
          {accountsByType.regular.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onCardClick={() => onSelectAccount(account)}
              isSelected={selectedAccount?.id === account.id}
            />
          ))}
        </Box>
        <Typography variant="h6">Cryptocurrency Accounts</Typography>
        <Box display="flex" flexWrap="wrap" gap={3}>
          {accountsByType.crypto.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onCardClick={() => onSelectAccount(account)}
              isSelected={selectedAccount?.id === account.id}
            />
          ))}
        </Box>
      </>
    );
  }

  return <Typography> You have no accounts. Create one</Typography>;
}
