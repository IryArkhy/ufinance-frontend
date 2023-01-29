import { DeleteRounded } from '@mui/icons-material';
import { Box, Card, CardHeader, IconButton, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

import { PageWrapper, Toolbar } from '../../components';

export function SettingsView() {
  const { palette } = useTheme();

  const categories = [
    {
      id: '1',
      name: 'Shopping',
    },
    {
      id: '2',
      name: 'Groceries',
    },
    {
      id: '3',
      name: 'Utilities',
    },
    {
      id: '4',
      name: 'Clothes',
    },
    {
      id: '5',
      name: 'Car',
    },
  ];
  const rows: GridRowsProp = categories.map((c) => ({ ...c, action: c.id }));

  const handleDelete = (id: string) => undefined;

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      headerClassName: 'lastTableHeader',
    },
    {
      field: 'action',
      headerName: '',
      headerClassName: 'lastTableHeader',
      renderCell: ({ value }) => (
        <Box width="100%" display="flex" justifyContent="flex-end">
          <IconButton onClick={() => handleDelete(value)}>
            <DeleteRounded />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Toolbar />
      <Box width="100%" display="flex" flexDirection="column" gap={5}>
        <Card sx={{ width: '100%' }}>
          <CardHeader
            title={<Typography variant="h6">Categories</Typography>}
            subheader={
              <Typography variant="body2" color="GrayText">
                Manage your categories list
              </Typography>
            }
          />
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            loading={false}
            hideFooter
            sx={{
              border: 'hidden',
              borderRadius: 0,
              '& .lastTableHeader': {
                bgcolor: palette.grey[200],
              },
              '& .MuiDataGrid-columnHeaders': {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              },
              '& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within, .MuiDataGrid-columnHeader:focus-within':
                {
                  outline: 'none',
                },
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
          />
        </Card>
        <Card sx={{ width: '100%' }}>
          <CardHeader
            title={<Typography variant="h6">Tags</Typography>}
            subheader={
              <Typography variant="body2" color="GrayText">
                Manage your tags.
              </Typography>
            }
          />
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            loading={false}
            hideFooter
            sx={{
              border: 'hidden',
              borderRadius: 0,
              '& .lastTableHeader': {
                bgcolor: palette.grey[200],
              },
              '& .MuiDataGrid-columnHeaders': {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              },
              '& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within, .MuiDataGrid-columnHeader:focus-within':
                {
                  outline: 'none',
                },
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
          />
        </Card>
      </Box>
    </PageWrapper>
  );
}
