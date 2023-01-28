import { Box } from '@mui/material';
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <Box
      sx={{
        width: { sm: `calc(100% - ${250}px)` },
        ml: { sm: `${250}px` },
        px: 5,
        pb: 5,
      }}
    >
      {children}
    </Box>
  );
}
