import { DeleteRounded } from '@mui/icons-material';
import InfoRounded from '@mui/icons-material/InfoRounded';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React from 'react';
import { useSelector } from 'react-redux';

import { useDispatch } from '../../redux/hooks';
import { getPayees } from '../../redux/payees/selectors';
import { createNewPayees, fetchPayees, removePayee } from '../../redux/payees/thunks';

export function PayeesPanel() {
  const { palette } = useTheme();
  const { payees, loading } = useSelector(getPayees);
  const dispatch = useDispatch();
  const [payeeNames, setPayeeNames] = React.useState<string[]>([]);

  const loadPayees = async () => {
    await dispatch(fetchPayees());
  };

  React.useEffect(() => {
    loadPayees().catch(console.log);
  }, []);

  if (loading && !payees) {
    return <CircularProgress />;
  }

  const handleDelete = async (id: string) => {
    await dispatch(removePayee(id));
  };

  const handleCreate = async () => {
    await dispatch(createNewPayees(payeeNames));
    setPayeeNames([]);
  };

  const rows: GridRowsProp = payees.map((c) => ({ ...c, action: c.id }));

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
    <Box display="flex" flexDirection="column" gap={5}>
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">Create payees</Typography>{' '}
              <Tooltip title="Hit Enter key to add payee to the list">
                <InfoRounded color="action" fontSize="small" />
              </Tooltip>
            </Box>
          }
          subheader={
            <Typography variant="body2" color="GrayText">
              Add multiple payees at once
            </Typography>
          }
        />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            <FormControl sx={{ width: '100%' }}>
              <Autocomplete
                multiple
                freeSolo
                value={payeeNames}
                options={[]}
                onChange={(_e, nextValue) => setPayeeNames(nextValue)}
                renderTags={(value, getTagProps) =>
                  value.map((category, index: number) => (
                    <Chip
                      variant="outlined"
                      label={category}
                      {...getTagProps({ index })}
                      key={category}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="Payees" />}
              />
            </FormControl>
            <LoadingButton
              sx={{ width: '20%' }}
              variant="contained"
              disabled={payeeNames.length === 0}
              loading={loading === 'pending'}
              onClick={handleCreate}
            >
              Create
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ width: '100%' }}>
        <CardHeader
          title={<Typography variant="h6">Payees</Typography>}
          subheader={
            <Typography variant="body2" color="GrayText">
              Manage your payees list
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
  );
}
