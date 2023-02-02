import { DeleteRounded } from '@mui/icons-material';
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
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React from 'react';
import { useSelector } from 'react-redux';

import { getCategories } from '../../redux/categories/selectors';
import {
  createNewCategories,
  fetchCategories,
  removeCategory,
} from '../../redux/categories/thunks';
import { useDispatch } from '../../redux/hooks';

export function CategoriesPanel() {
  const { palette } = useTheme();
  const { categories, loading } = useSelector(getCategories);
  const dispatch = useDispatch();
  const [categoryNames, setCategoryNames] = React.useState<string[]>([]);

  const loadCategories = async () => {
    await dispatch(fetchCategories());
  };

  React.useEffect(() => {
    loadCategories().catch(console.log);
  }, []);

  if (loading && !categories) {
    return <CircularProgress />;
  }

  const handleDelete = async (id: string) => {
    await dispatch(removeCategory(id));
  };
  const handleCreate = async () => {
    await dispatch(createNewCategories(categoryNames));
    setCategoryNames([]);
  };

  const categoriesRows: GridRowsProp = categories.map((c) => ({ ...c, action: c.id }));

  const categoriesColumns: GridColDef[] = [
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
        <CardHeader title={<Typography variant="h6">Create categories</Typography>} />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            <FormControl sx={{ width: '100%' }}>
              <Autocomplete
                multiple
                freeSolo
                value={categoryNames}
                options={[]}
                onChange={(_e, nextValue) => setCategoryNames(nextValue)}
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
                renderInput={(params) => <TextField {...params} label="Categories" />}
              />
            </FormControl>
            <LoadingButton
              sx={{ width: '20%' }}
              variant="contained"
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
          title={<Typography variant="h6">Categories</Typography>}
          subheader={
            <Typography variant="body2" color="GrayText">
              Manage your categories list
            </Typography>
          }
        />
        <DataGrid
          autoHeight
          rows={categoriesRows}
          columns={categoriesColumns}
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
