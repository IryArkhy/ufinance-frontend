import { ExpandMoreRounded } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';

import { Transaction } from '../types';

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
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
            <Typography color={transaction.type === 'DEPOSIT' ? 'success.light' : 'error.light'}>
              {transaction.type === 'DEPOSIT' ? transaction.amount : `-${transaction.amount}`}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <Button startIcon={<ExpandMoreRounded />}>Show more</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
