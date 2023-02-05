import { Box, Skeleton } from '@mui/material';
import React from 'react';

export const GridLoader: React.FC = () => {
  const rowArr = [0, 1, 2];

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {rowArr.map((num) => (
        <React.Fragment key={num}>
          <Skeleton variant="rectangular" width="100%" height={1} />
          <Box display="flex" justify-content="space-between" gap={4}>
            <Skeleton variant="text" height={40} sx={{ flex: 3 }} />
            <Skeleton variant="text" height={40} sx={{ flex: 2 }} />
            <Skeleton variant="text" height={40} sx={{ flex: 2 }} />
            <Skeleton variant="text" height={40} sx={{ flex: 2 }} />
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
};
