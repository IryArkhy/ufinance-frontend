import { Box, Card, CardContent, Divider, Skeleton } from '@mui/material';
import React from 'react';

export const AccountsLoader: React.FC = () => {
  const cardsArray = [0, 1, 2];

  return (
    <Box display="flex" justify-content="space-between" gap={3} width="100%">
      {cardsArray.map((num) => (
        <Card key={num} sx={{ flex: 1 }}>
          <CardContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <Skeleton variant="text" width="60%" />
              <Box width="100%" flexDirection="column" justifyContent="stretch" gap={2} mb={2}>
                <Box display="flex" gap={2}>
                  <Skeleton variant="text" sx={{ flex: 1 }} />
                  <Skeleton variant="text" sx={{ flex: 2 }} />
                </Box>
                <Skeleton variant="text" />
              </Box>
              <Divider />
              <Skeleton variant="rectangular" height={20} width="100%" />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
