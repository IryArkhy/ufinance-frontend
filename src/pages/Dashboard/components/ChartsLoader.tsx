import { Box, Card, CardContent, Skeleton } from '@mui/material';
import React from 'react';

export const ChartsLoader: React.FC = () => {
  const renderBar = () => (
    <Skeleton
      variant="rectangular"
      height={280}
      width={15}
      sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
    />
  );
  return (
    <>
      <Card sx={{ flex: 1, height: '100%' }}>
        <CardContent sx={{ width: '100%' }}>
          <Box display="flex" justifyContent="space-between" mb={1} alignItems="center" gap={3}>
            <Skeleton variant="text" sx={{ flex: 3 }} />
            <Skeleton variant="rectangular" height={30} sx={{ borderRadius: '4px', flex: 2 }} />
          </Box>
          <Box display="flex" gap={2} py={2} justifyContent="space-around">
            {renderBar()}
            {renderBar()}
            {renderBar()}
            {renderBar()}
            {renderBar()}
            {renderBar()}
            {renderBar()}
            {renderBar()}
            {renderBar()}
            {renderBar()}
            {renderBar()}
          </Box>
          <Skeleton variant="rectangular" height={2} width="100%" />
        </CardContent>
      </Card>
      <Card sx={{ flex: 1 }}>
        <CardContent sx={{ width: '100%' }}>
          <Box display="flex" justifyContent="space-between" mb={3} alignItems="center" gap={3}>
            <Skeleton variant="text" sx={{ flex: 3 }} />
            <Skeleton variant="rectangular" height={30} sx={{ borderRadius: '4px', flex: 2 }} />
          </Box>
          <Box display="flex" gap={2}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Skeleton variant="circular" height={300} width={300} />
            </Box>
            <Box display="flex" flexDirection="column" gap={2} flex={1} pt={5}>
              <Skeleton variant="rectangular" height={5} width="100%" sx={{ borderRadius: 4 }} />
              <Skeleton variant="rectangular" height={5} width="100%" sx={{ borderRadius: 4 }} />
              <Skeleton variant="rectangular" height={5} width="100%" sx={{ borderRadius: 4 }} />
              <Skeleton variant="rectangular" height={5} width="100%" sx={{ borderRadius: 4 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
